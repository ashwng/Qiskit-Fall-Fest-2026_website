"use client";

import { useEffect, useRef } from "react";

import * as THREE from "three";

const SPHERE_RADIUS = 2.2;
type Point3D = [number, number, number];

function createLabel(text: string, color: string) {
  const labelCanvas = document.createElement("canvas");

  const context = labelCanvas.getContext("2d");

  labelCanvas.width = 256;

  labelCanvas.height = 96;

  if (!context) {
    return new THREE.Sprite(new THREE.SpriteMaterial({ color }));
  }

  context.font = "600 42px Space Grotesk, sans-serif";

  context.fillStyle = color;

  context.textAlign = "center";

  context.textBaseline = "middle";

  context.fillText(text, 128, 48);

  const texture = new THREE.CanvasTexture(labelCanvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map: texture,

    transparent: true,

    depthTest: false,
  });

  const sprite = new THREE.Sprite(material);

  sprite.scale.set(0.85, 0.32, 1);

  return sprite;
}

function createAxis(start: Point3D, end: Point3D, color: number) {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...start),

    new THREE.Vector3(...end),
  ]);

  return new THREE.Line(
    geometry,

    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.65 }),
  );
}

function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !canvas.parentElement) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,

      alpha: true,

      canvas,
    });

    const pointer = new THREE.Vector2();

    const stateVector = new THREE.Vector3(0, 0, 1);

    const startTime = performance.now();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    camera.position.set(0, 0, 9);

    scene.fog = new THREE.FogExp2(0xfbf8fc, 0.055);

    const sphere = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.SphereGeometry(SPHERE_RADIUS, 32, 20)),

      new THREE.LineBasicMaterial({
        color: 0x8b4fc7,

        transparent: true,

        opacity: 0.4,
      }),
    );

    scene.add(sphere);

    const equatorPoints = Array.from({ length: 65 }, (_, index) => {
      const angle = (index / 64) * Math.PI * 2;

      return new THREE.Vector3(
        Math.cos(angle) * SPHERE_RADIUS,

        Math.sin(angle) * SPHERE_RADIUS,

        0,
      );
    });

    const equator = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(equatorPoints),

      new THREE.LineBasicMaterial({
        color: 0x8b4fc7,

        transparent: true,

        opacity: 0.46,
      }),
    );

    scene.add(equator);

    [
      createAxis([-3, 0, 0], [3, 0, 0], 0xd8c6e1),

      createAxis([0, -3, 0], [0, 3, 0], 0xd8c6e1),

      createAxis([0, 0, -3], [0, 0, 3], 0xd8c6e1),
    ].forEach((axis) => scene.add(axis));

    const labels: Array<[string, string, Point3D]> = [
      // ["|0>", "#b8efe5", [0, 0, SPHERE_RADIUS + 0.42]],

      // ["|1⟩", "#e38b68", [0, 0, -SPHERE_RADIUS - 0.42]],

      ["|0⟩", "#EC4899", [0, 3.18, 0]],

      ["|1⟩", "#EC4899", [0, -3.18, 0]],

      // ["Z", "#f2c7a5", [0, 0, 3.18]],
    ];

    labels.forEach(([text, color, position]) => {
      const label = createLabel(text, color);

      label.position.set(...position);

      scene.add(label);
    });

    const arrow = new THREE.ArrowHelper(
      stateVector,

      new THREE.Vector3(),

      SPHERE_RADIUS,

      0xec4899,

      0.28,

      0.14,
    );

    scene.add(arrow);

    const parent = canvas.parentElement;

    if (!parent) return;

    const resize = () => {
      const { clientWidth, clientHeight } = parent;

      if (!clientWidth || !clientHeight) return;

      camera.aspect = clientWidth / clientHeight;

      camera.updateProjectionMatrix();

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

      renderer.setSize(clientWidth, clientHeight, false);
    };

    const movePointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;

      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    resize();

    window.addEventListener("resize", resize);

    window.addEventListener("pointermove", movePointer, { passive: true });

    let animationFrame: number | undefined;

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      const target = new THREE.Vector3(
        pointer.x * 0.9,

        pointer.y * 0.9,

        0.82 + Math.sin(elapsed * 0.45) * 0.04,
      ).normalize();

      stateVector.lerp(target, 0.08).normalize();

      arrow.setDirection(stateVector);

      renderer.render(scene, camera);

      animationFrame = window.requestAnimationFrame(render);
    };

    if (prefersReducedMotion.matches) {
      renderer.render(scene, camera);
    } else {
      render();
    }

    return () => {
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("resize", resize);

      window.removeEventListener("pointermove", movePointer);

      scene.traverse((object) => {
        const renderObject = object as THREE.Mesh;

        if (renderObject.geometry) {
          renderObject.geometry.dispose();
        }

        if (renderObject.material) {
          const materials = Array.isArray(renderObject.material)
            ? renderObject.material
            : [renderObject.material];

          materials.forEach((material) => {
            const texturedMaterial = material as THREE.MeshBasicMaterial;

            texturedMaterial.map?.dispose();
            material.dispose();
          });
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div className="three-background" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default ThreeBackground;
