"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { DESKTOP_MOTION } from "@/lib/gsap";

/** Drifting particle field with soundwave rings radiating from the focal point. Desktop only. */
export default function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.matchMedia(DESKTOP_MOTION).matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 9;

    // Particles
    const COUNT = 650;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const radius = 3 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * radius * 1.4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = Math.sin(theta) * radius * 0.6 - 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x7fa4ff, size: 0.05, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Echo rings
    const rings: { mesh: THREE.Mesh; offset: number }[] = [];
    const ringGeometry = new THREE.RingGeometry(1, 1.012, 160);
    for (let i = 0; i < 5; i++) {
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x5b8cff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
      const mesh = new THREE.Mesh(ringGeometry, ringMaterial);
      mesh.position.set(3.2, 0.2, -1);
      scene.add(mesh);
      rings.push({ mesh, offset: i / 5 });
    }

    const pointer = { x: 0, y: 0 };
    const onMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { clientWidth: w, clientHeight: h } = parent;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);

    const clock = new THREE.Clock();
    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.035;
      points.rotation.x = Math.sin(t * 0.1) * 0.04;
      camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      rings.forEach(({ mesh, offset }) => {
        const phase = (t * 0.16 + offset) % 1;
        mesh.scale.setScalar(0.4 + phase * 8);
        (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * (1 - phase) * 0.5;
      });
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      ringGeometry.dispose();
      rings.forEach(({ mesh }) => (mesh.material as THREE.Material).dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
