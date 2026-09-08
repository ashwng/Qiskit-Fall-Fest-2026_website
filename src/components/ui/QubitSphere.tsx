"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

/**
 * A Bloch sphere whose state vector follows the cursor.
 *
 * Two groups, deliberately: the wireframe shell turns slowly on its own axis,
 * while the vector sits in an unrotated group so it can point at the cursor in
 * *screen* space. Putting the vector inside the spinning group would drag it
 * around with the shell and it would no longer track the pointer.
 *
 * The shell turns about Y only, so the poles — and their |0⟩ / |1⟩ labels —
 * stay put while the meridians sweep behind the vector.
 *
 * Fills whatever frame the caller positions; the caller owns the surround.
 */

const SPHERE_RADIUS = 2.2;
const AXIS_LENGTH = 2.75;

const PALETTES = {
  light: {
    hull: 0x8a3ffc,
    hullOpacity: 0.45,
    equator: 0x6929c4,
    equatorOpacity: 0.72,
    axis: 0xbe95ff,
    axisOpacity: 0.8,
    vector: 0xd02670,
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

export default function QubitSphere() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const palette: Palette =
    resolvedTheme === "dark" ? PALETTES.dark : PALETTES.light;

  // Survives the teardown/rebuild that a theme flip causes.
  const stateRef = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(palette.fog, 0.04);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    // three.js creates its own canvas rather than adopting one from JSX. Under
    // StrictMode the effect mounts, cleans up, then mounts again — and a
    // <canvas> whose context has been disposed cannot hand out a new one, so
    // the second mount would render nothing.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "block h-full w-full";
    host.appendChild(canvas);

    const shell = new THREE.Group();
    const vector = new THREE.Group();
    scene.add(shell, vector);

    const X = new THREE.Vector3(1, 0, 0);
    const Y = new THREE.Vector3(0, 1, 0);
    const Z = new THREE.Vector3(0, 0, 1);

    shell.add(circle(X, Z, SPHERE_RADIUS, palette.equator, palette.equatorOpacity));
    shell.add(circle(X, Y, SPHERE_RADIUS, palette.hull, palette.hullOpacity));
    shell.add(circle(Z, Y, SPHERE_RADIUS, palette.hull, palette.hullOpacity));
    for (const lat of [Math.PI / 4, -Math.PI / 4]) {
      const ring = circle(
        X,
        Z,
        SPHERE_RADIUS * Math.cos(lat),
        palette.hull,
        palette.hullOpacity * 0.7,
      );
      ring.position.y = SPHERE_RADIUS * Math.sin(lat);
      shell.add(ring);
    }
    for (const dir of [X, Y, Z]) {
      shell.add(axisLine(dir, palette.axis, palette.axisOpacity));
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
      shell.add(sprite);
    }

    const arrow = new THREE.ArrowHelper(
      stateRef.current.clone(),
      new THREE.Vector3(),
      SPHERE_RADIUS,
      palette.vector,
      0.34,
      0.17,
    );
    vector.add(arrow);

    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 16, 12),
      new THREE.MeshBasicMaterial({ color: palette.vector }),
    );
    vector.add(tip);

    const origin = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 12, 10),
      new THREE.MeshBasicMaterial({
        color: palette.vector,
        transparent: true,
        opacity: 0.7,
      }),
    );
    vector.add(origin);

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

    /* ---- pointer tracking ---------------------------------------------- */
    // Measured against the sphere's own centre, not the window's. The previous
    // version divided by innerWidth/innerHeight, which put the vector's neutral
    // position at the middle of the *page* — so the arrow sat off to one side
    // and the cursor pulled it from the wrong origin.
    const pointer = new THREE.Vector2(0, 0.6);
    let hasPointer = false;

    const movePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      pointer.y = -(event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      hasPointer = true;
    };
    window.addEventListener("pointermove", movePointer, { passive: true });

    let frame: number | undefined;
    const start = performance.now();
    const target = new THREE.Vector3();

    const render = (now: number) => {
      const elapsed = (now - start) / 1000;

      // Pull the pointer onto the sphere. z keeps the tip in front of the
      // shell; the gentle breathing keeps it alive before the cursor arrives.
      target
        .set(
          pointer.x * 0.95,
          pointer.y * 0.95,
          (hasPointer ? 0.7 : 0.85) + Math.sin(elapsed * 0.5) * 0.05,
        )
        .normalize();
      stateRef.current.lerp(target, 0.07).normalize();

      arrow.setDirection(stateRef.current);
      tip.position.copy(stateRef.current).multiplyScalar(SPHERE_RADIUS);

      if (!reduceMotion.matches) shell.rotation.y = elapsed * 0.12;

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", movePointer);
      canvas.remove();

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          for (const material of materials) {
            (material as THREE.SpriteMaterial).map?.dispose();
            material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [palette]);

  return <div ref={hostRef} className="absolute inset-0" />;
}
