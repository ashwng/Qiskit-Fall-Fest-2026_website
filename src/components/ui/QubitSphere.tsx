"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

/**
 * An interactive Bloch sphere.
 *
 * Drag it to orbit; press a gate to rotate the qubit's state. The gates are
 * the real thing — each is a rotation of the state vector about an axis of the
 * sphere — so the arrow lands exactly where the maths says it should, and the
 * trail it draws is the actual path traced on the sphere.
 *
 * Scene axes are not Bloch axes. The labels put |0⟩ at the top, so Bloch z
 * maps to scene **Y**, Bloch x to scene X, and Bloch y to scene **−Z**.
 *
 * That last minus sign matters. Mapping Bloch y to +Z leaves the frame
 * left-handed, and every quarter turn — the S gate — then runs backwards:
 * S would carry |+⟩ to |−i⟩ instead of |+i⟩. π rotations hide the error, so
 * only the S gate exposes it. Every axis below is in scene coordinates.
 */

const SPHERE_RADIUS = 2.2;
const AXIS_LENGTH = 2.75;
const TRAIL_MAX = 260;

type Gate = {
  id: string;
  label: string;
  /** Shown in the button tooltip and read out to screen readers. */
  title: string;
  /** Rotation axis, in scene coordinates. */
  axis: [number, number, number];
  angle: number;
};

const GATES: Gate[] = [
  { id: "X", label: "X", title: "Pauli-X — π about x, flips |0⟩ and |1⟩", axis: [1, 0, 0], angle: Math.PI },
  { id: "Y", label: "Y", title: "Pauli-Y — π about y", axis: [0, 0, -1], angle: Math.PI },
  { id: "Z", label: "Z", title: "Pauli-Z — π about z, a phase flip", axis: [0, 1, 0], angle: Math.PI },
  { id: "H", label: "H", title: "Hadamard — π about the x+z diagonal, makes a superposition", axis: [1, 1, 0], angle: Math.PI },
  { id: "S", label: "S", title: "Phase — π/2 about z", axis: [0, 1, 0], angle: Math.PI / 2 },
];

/** Cardinal states, for the readout. Scene coordinates. */
const NAMED: Array<[string, THREE.Vector3]> = [
  ["|0⟩", new THREE.Vector3(0, 1, 0)],
  ["|1⟩", new THREE.Vector3(0, -1, 0)],
  ["|+⟩", new THREE.Vector3(1, 0, 0)],
  ["|−⟩", new THREE.Vector3(-1, 0, 0)],
  ["|+i⟩", new THREE.Vector3(0, 0, -1)],
  ["|−i⟩", new THREE.Vector3(0, 0, 1)],
];

const PALETTES = {
  light: {
    hull: 0x8a3ffc,
    hullOpacity: 0.45,
    equator: 0x6929c4,
    equatorOpacity: 0.72,
    axis: 0xbe95ff,
    axisOpacity: 0.8,
    vector: 0xd02670,
    trail: 0xff7eb6,
    label: "#d02670",
    poleLabel: "#4c3a6b",
    fog: 0xf6f7fd,
  },
  dark: {
    hull: 0xa56eff,
    hullOpacity: 0.42,
    equator: 0xbe95ff,
    equatorOpacity: 0.7,
    axis: 0x6929c4,
    axisOpacity: 0.75,
    vector: 0xff7eb6,
    trail: 0xff9ec7,
    label: "#ff9ec7",
    poleLabel: "#b6a6cf",
    fog: 0x0a0420,
  },
} as const;

type Palette = (typeof PALETTES)[keyof typeof PALETTES];

function createLabel(text: string, color: string) {
  const labelCanvas = document.createElement("canvas");
  const context = labelCanvas.getContext("2d");
  labelCanvas.width = 256;
  labelCanvas.height = 96;
  if (!context) {
    return new THREE.Sprite(new THREE.SpriteMaterial({ color }));
  }
  context.font = '600 44px "IBM Plex Mono", monospace';
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 128, 48);

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }),
  );
  sprite.scale.set(0.8, 0.3, 1);
  return sprite;
}

/** A great (or small) circle, in the plane spanned by `u` and `v`. */
function circle(
  u: THREE.Vector3,
  v: THREE.Vector3,
  radius: number,
  color: number,
  opacity: number,
) {
  const points = Array.from({ length: 97 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2;
    return new THREE.Vector3()
      .addScaledVector(u, Math.cos(a) * radius)
      .addScaledVector(v, Math.sin(a) * radius);
  });
  return new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

function axisLine(dir: THREE.Vector3, color: number, opacity: number) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      dir.clone().multiplyScalar(-AXIS_LENGTH),
      dir.clone().multiplyScalar(AXIS_LENGTH),
    ]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function describe(v: THREE.Vector3) {
  for (const [name, dir] of NAMED) {
    if (v.dot(dir) > 0.999) return name;
  }
  // polar angle from |0⟩ (scene +Y); azimuth measured from Bloch x toward
  // Bloch y, which is scene −Z
  const theta = Math.round((Math.acos(THREE.MathUtils.clamp(v.y, -1, 1)) * 180) / Math.PI);
  let phi = Math.round((Math.atan2(-v.z, v.x) * 180) / Math.PI);
  if (phi < 0) phi += 360;
  return `θ ${theta}° · φ ${phi}°`;
}

type Props = {
  /**
   * "lab" (default) brings its own frame, gate buttons and state readout.
   * "bare" renders only the canvas, for callers that supply their own frame
   * and want the sphere as decoration rather than as a control.
   */
  variant?: "lab" | "bare";
};

export default function QubitSphere({ variant = "lab" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const palette: Palette =
    resolvedTheme === "dark" ? PALETTES.dark : PALETTES.light;

  // Kept in refs so the qubit's state and the camera angle survive a theme
  // flip, which tears the whole scene down and rebuilds it.
  const stateRef = useRef(new THREE.Vector3(0, 1, 0));
  const orbitRef = useRef({ az: 0.7, el: 0.32, azVel: 0, elVel: 0 });
  const queueRef = useRef<Gate[]>([]);

  const [readout, setReadout] = useState("|0⟩");
  const [busy, setBusy] = useState(false);

  const push = useCallback((gate: Gate) => {
    // Cap the queue so a mash of clicks doesn't spool up a long animation.
    if (queueRef.current.length < 3) queueRef.current.push(gate);
  }, []);

  const reset = useCallback(() => {
    queueRef.current.length = 0;
    stateRef.current.set(0, 1, 0);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(palette.fog, 0.04);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    // three.js creates its own canvas rather than adopting one from JSX.
    // Under StrictMode the effect mounts, cleans up, then mounts again — and a
    // <canvas> whose context has been disposed cannot hand out a new one, so
    // the second mount rendered nothing and its loop never started. A fresh
    // element per mount sidesteps that entirely.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.className =
      "block h-full w-full cursor-grab touch-none active:cursor-grabbing";
    host.appendChild(canvas);

    // Everything lives in one group; orbiting spins the group, not the camera,
    // which keeps the lighting-free wireframe stable and the maths simple.
    const world = new THREE.Group();
    scene.add(world);

    const X = new THREE.Vector3(1, 0, 0);
    const Y = new THREE.Vector3(0, 1, 0);
    const Z = new THREE.Vector3(0, 0, 1);

    // Great circles — an equator plus two meridians — instead of a dense edge
    // mesh, which reads as a sphere rather than as a ball of noise.
    world.add(circle(X, Z, SPHERE_RADIUS, palette.equator, palette.equatorOpacity));
    world.add(circle(X, Y, SPHERE_RADIUS, palette.hull, palette.hullOpacity));
    world.add(circle(Z, Y, SPHERE_RADIUS, palette.hull, palette.hullOpacity));
    // Two parallels give the surface some latitude without crowding it.
    for (const lat of [Math.PI / 4, -Math.PI / 4]) {
      const ring = circle(
        X,
        Z,
        SPHERE_RADIUS * Math.cos(lat),
        palette.hull,
        palette.hullOpacity * 0.7,
      );
      ring.position.y = SPHERE_RADIUS * Math.sin(lat);
      world.add(ring);
    }

    for (const dir of [X, Y, Z]) {
      world.add(axisLine(dir, palette.axis, palette.axisOpacity));
    }

    const labels: Array<[string, THREE.Vector3, string]> = [
      ["|0⟩", new THREE.Vector3(0, AXIS_LENGTH + 0.28, 0), palette.label],
      ["|1⟩", new THREE.Vector3(0, -AXIS_LENGTH - 0.28, 0), palette.label],
      ["|+⟩", new THREE.Vector3(AXIS_LENGTH + 0.3, 0, 0), palette.poleLabel],
      ["|−⟩", new THREE.Vector3(-AXIS_LENGTH - 0.3, 0, 0), palette.poleLabel],
    ];
    for (const [text, position, color] of labels) {
      const sprite = createLabel(text, color);
      sprite.position.copy(position);
      world.add(sprite);
    }

    // State vector: a shaft, a cone head, and a glow disc at the tip.
    const arrow = new THREE.ArrowHelper(
      stateRef.current.clone(),
      new THREE.Vector3(),
      SPHERE_RADIUS,
      palette.vector,
      0.34,
      0.17,
    );
    world.add(arrow);

    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 16, 12),
      new THREE.MeshBasicMaterial({ color: palette.vector }),
    );
    world.add(tip);

    const origin = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 12, 10),
      new THREE.MeshBasicMaterial({ color: palette.vector, transparent: true, opacity: 0.7 }),
    );
    world.add(origin);

    // Trail. Preallocated so the render loop never allocates.
    const trailPositions = new Float32Array(TRAIL_MAX * 3);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setDrawRange(0, 0);
    const trail = new THREE.Line(
      trailGeometry,
      new THREE.LineBasicMaterial({ color: palette.trail, transparent: true, opacity: 0.85 }),
    );
    world.add(trail);
    let trailCount = 0;

    const pushTrail = (v: THREE.Vector3) => {
      if (trailCount >= TRAIL_MAX) {
        trailPositions.copyWithin(0, 3);
        trailCount = TRAIL_MAX - 1;
      }
      const i = trailCount * 3;
      trailPositions[i] = v.x;
      trailPositions[i + 1] = v.y;
      trailPositions[i + 2] = v.z;
      trailCount += 1;
      trailGeometry.setDrawRange(0, trailCount);
      trailGeometry.attributes.position.needsUpdate = true;
    };

    const shrinkTrail = () => {
      if (trailCount === 0) return;
      trailPositions.copyWithin(0, 3);
      trailCount -= 1;
      trailGeometry.setDrawRange(0, trailCount);
      trailGeometry.attributes.position.needsUpdate = true;
    };

    const resize = () => {
      const { clientWidth, clientHeight } = host;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setSize(clientWidth, clientHeight, false);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(host);

    /* ---- drag to orbit ------------------------------------------------- */
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let idleFor = 0;

    const onDown = (event: PointerEvent) => {
      dragging = true;
      idleFor = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      orbitRef.current.azVel = dx * 0.006;
      orbitRef.current.elVel = dy * 0.006;
    };
    const onUp = (event: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    /* ---- gate animation ------------------------------------------------ */
    type Anim = { axis: THREE.Vector3; angle: number; from: THREE.Vector3; t: number };
    let anim: Anim | null = null;
    let lastReadout = "";
    let lastBusy: boolean | null = null;
    const scratch = new THREE.Vector3();

    let frame: number | undefined;
    let previous = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      // start the next queued gate
      if (!anim && queueRef.current.length > 0) {
        const gate = queueRef.current.shift()!;
        anim = {
          axis: new THREE.Vector3(...gate.axis).normalize(),
          angle: gate.angle,
          from: stateRef.current.clone(),
          t: 0,
        };
      }

      if (anim) {
        anim.t = Math.min(anim.t + dt / 0.85, 1);
        const eased = easeInOutCubic(anim.t);
        stateRef.current
          .copy(anim.from)
          .applyAxisAngle(anim.axis, anim.angle * eased)
          .normalize();
        pushTrail(scratch.copy(stateRef.current).multiplyScalar(SPHERE_RADIUS));
        if (anim.t >= 1) anim = null;
      } else {
        // the trail retracts once the gate has landed
        shrinkTrail();
        shrinkTrail();
      }

      const isBusy = anim !== null || queueRef.current.length > 0;
      if (isBusy !== lastBusy) {
        lastBusy = isBusy;
        setBusy(isBusy);
      }
      if (!isBusy) {
        const name = describe(stateRef.current);
        if (name !== lastReadout) {
          lastReadout = name;
          setReadout(name);
        }
      }

      arrow.setDirection(stateRef.current);
      tip.position.copy(stateRef.current).multiplyScalar(SPHERE_RADIUS);

      // orbit: momentum from the drag, decaying, with a slow idle spin
      const orbit = orbitRef.current;
      if (!dragging) {
        orbit.azVel *= 0.92;
        orbit.elVel *= 0.92;
        idleFor += dt;
        if (idleFor > 2 && !reduceMotion.matches) {
          orbit.azVel += (0.0022 - orbit.azVel) * 0.02;
        }
      }
      orbit.az += orbit.azVel;
      orbit.el = THREE.MathUtils.clamp(orbit.el + orbit.elVel, -1.2, 1.2);
      world.rotation.y = orbit.az;
      world.rotation.x = orbit.el;

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.remove();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const material of materials) {
            (material as THREE.SpriteMaterial).map?.dispose();
            material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [palette]);

  const canvasEl = <div ref={hostRef} className="relative h-full w-full" />;

  if (variant === "bare") {
    // Fills whatever frame the caller has already positioned.
    return <div className="absolute inset-0">{canvasEl}</div>;
  }

  return (
    <div className="w-full">
      <div className="relative mx-auto aspect-square w-full max-w-[26rem] lg:max-w-none">
        <div className="pointer-events-none absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,126,182,0.22),transparent_70%)] blur-2xl" />
        <div className="glass-dark relative h-full w-full overflow-hidden rounded-full shadow-[0_0_40px_rgba(255,126,182,0.14)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(138,63,252,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(138,63,252,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
          {canvasEl}
          <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Drag to rotate
          </p>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[26rem] lg:max-w-none">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            State
          </p>
          <p
            aria-live="polite"
            className="font-mono text-sm font-semibold text-pink-ink tabular-nums"
          >
            {readout}
          </p>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {GATES.map((gate) => (
            <button
              key={gate.id}
              type="button"
              onClick={() => push(gate)}
              title={gate.title}
              aria-label={`Apply ${gate.title}`}
              className="h-10 w-10 rounded-xl border border-line bg-surface/70 font-mono text-sm font-semibold text-ink backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-pink hover:bg-pink/10 hover:text-pink-ink"
            >
              {gate.label}
            </button>
          ))}
          <button
            type="button"
            onClick={reset}
            aria-label="Reset the qubit to |0⟩"
            className="h-10 rounded-xl border border-line bg-surface/70 px-3.5 font-mono text-xs font-medium text-muted backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-pink hover:text-ink"
          >
            Reset
          </button>
          <span
            aria-hidden
            className={`ml-auto h-1.5 w-1.5 rounded-full bg-pink transition-opacity duration-300 ${
              busy ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
