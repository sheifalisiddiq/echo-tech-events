"use client";

import * as THREE from "three";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ScrollTrigger } from "@/lib/gsap";
import { experiences } from "@/lib/data";

const FILTERS = ["All", "Photo", "Video", "AI", "Immersive"] as const;
type Filter = (typeof FILTERS)[number];

const RADIUS = 4.4;
const PLANE_W = 2.6;
const PLANE_H = 3.4;
const PER_TURN = 7;
const STEP = (Math.PI * 2) / PER_TURN;
const RISE = 0.62;
const TEX_W = 640;
const TEX_H = 840;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform float uOpacity;
  uniform float uHover;
  varying vec2 vUv;
  float roundedBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main() {
    vec2 p = (vUv - 0.5) * vec2(${(PLANE_W / PLANE_H).toFixed(4)}, 1.0);
    float d = roundedBox(p, vec2(${(PLANE_W / PLANE_H / 2).toFixed(4)}, 0.5), 0.05);
    float alpha = 1.0 - smoothstep(-0.003, 0.003, d);
    vec3 col = texture2D(map, vUv).rgb;
    col *= 1.0 + uHover * 0.16;
    float rim = smoothstep(-0.012, 0.0, d) * alpha;
    col = mix(col, vec3(0.62, 0.75, 1.0), rim * (0.35 + uHover * 0.5));
    gl_FragColor = vec4(col, alpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

function drawCard(ctx: CanvasRenderingContext2D, index: number, item: (typeof experiences)[number], image?: HTMLImageElement) {
  ctx.clearRect(0, 0, TEX_W, TEX_H);
  ctx.fillStyle = "#10141b";
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  if (image && image.naturalWidth) {
    const scale = Math.max(TEX_W / image.naturalWidth, TEX_H / image.naturalHeight);
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    ctx.drawImage(image, (TEX_W - w) / 2, (TEX_H - h) / 2, w, h);
  }
  const shade = ctx.createLinearGradient(0, TEX_H * 0.35, 0, TEX_H);
  shade.addColorStop(0, "rgba(3,5,9,0)");
  shade.addColorStop(1, "rgba(3,5,9,0.92)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  const top = ctx.createLinearGradient(0, 0, 0, 180);
  top.addColorStop(0, "rgba(3,5,9,0.55)");
  top.addColorStop(1, "rgba(3,5,9,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, TEX_W, 180);

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 24px Inter, Arial, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(String(index + 1).padStart(2, "0"), 40, 62);
  ctx.textAlign = "right";
  ctx.font = "600 20px Inter, Arial, sans-serif";
  ctx.fillText(item.category.toUpperCase(), TEX_W - 40, 60);
  ctx.textAlign = "left";

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 66px 'Space Grotesk', 'Arial Black', sans-serif";
  const words = item.shortTitle.toUpperCase().split(" ");
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > TEX_W - 80 && line) { lines.push(line); line = word; } else line = test;
  });
  lines.push(line);
  const baseY = TEX_H - 48;
  lines.slice(-3).reverse().forEach((text, i) => ctx.fillText(text, 40, baseY - i * 64));
}

export default function HelixScene() {
  const router = useRouter();
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState(0);
  const filterRef = useRef<Filter>("All");
  filterRef.current = filter;

  useEffect(() => {
    const stageEl = stage.current;
    const canvasEl = canvas.current;
    if (!stageEl || !canvasEl) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(0, 0.2, 14.8);
    const group = new THREE.Group();
    scene.add(group);

    // Guide spiral
    const guidePoints: THREE.Vector3[] = [];
    for (let t = -0.6; t <= experiences.length - 0.4; t += 0.05) {
      guidePoints.push(new THREE.Vector3(Math.sin(t * STEP) * (RADIUS - 0.08), t * RISE, Math.cos(t * STEP) * (RADIUS - 0.08)));
    }
    const guideGeometry = new THREE.BufferGeometry().setFromPoints(guidePoints);
    const guideMaterial = new THREE.LineBasicMaterial({ color: 0x246bfd, transparent: true, opacity: 0.45 });
    group.add(new THREE.Line(guideGeometry, guideMaterial));

    // Cards
    const planeGeometry = new THREE.PlaneGeometry(PLANE_W, PLANE_H);
    const cards = experiences.map((item, i) => {
      const cardCanvas = document.createElement("canvas");
      cardCanvas.width = TEX_W;
      cardCanvas.height = TEX_H;
      const ctx = cardCanvas.getContext("2d") as CanvasRenderingContext2D;
      drawCard(ctx, i, item);
      const texture = new THREE.CanvasTexture(cardCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      const material = new THREE.ShaderMaterial({
        uniforms: { map: { value: texture }, uOpacity: { value: 1 }, uHover: { value: 0 } },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(planeGeometry, material);
      const angle = i * STEP;
      mesh.position.set(Math.sin(angle) * RADIUS, i * RISE, Math.cos(angle) * RADIUS);
      mesh.rotation.y = angle;
      group.add(mesh);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.src = item.image.replace("w=1800", "w=760");
      img.onload = () => {
        drawCard(ctx, i, item, img);
        texture.needsUpdate = true;
      };
      return { mesh, material, texture, angle, hover: 0, hoverTarget: 0, opacity: 1, item };
    });

    // Redraw labels once fonts are ready.
    document.fonts?.ready.then(() => {
      cards.forEach(({ texture }) => { texture.needsUpdate = true; });
    });

    const total = experiences.length - 1;
    let shiftX = 0;
    const state = { target: 0, current: 0, pointer: new THREE.Vector2(9, 9), hovered: -1, px: 0, py: 0 };
    const raycaster = new THREE.Raycaster();

    const trigger = ScrollTrigger.create({
      trigger: stageEl,
      start: "top top",
      end: () => `+=${Math.round(window.innerHeight * 3.6)}`,
      pin: true,
      anticipatePin: 1,
      refreshPriority: 2,
      invalidateOnRefresh: true,
      onUpdate: (self) => { state.target = self.progress; },
    });

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = stageEl;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = Math.max(13.5, 14.8 / Math.min(1, camera.aspect / 1.6));
      shiftX = camera.aspect > 1.25 ? Math.min(3.4, (camera.aspect - 1.25) * 4.2 + 1.2) : 0;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const matches = (c: (typeof cards)[number]) => filterRef.current === "All" || c.item.category === filterRef.current;

    const onMove = (event: PointerEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      state.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      state.px = state.pointer.x;
      state.py = state.pointer.y;
    };
    const onLeave = () => { state.pointer.set(9, 9); };
    const onClick = () => {
      if (state.hovered >= 0) router.push(`/experiences/${cards[state.hovered].item.slug}`);
    };
    canvasEl.addEventListener("pointermove", onMove);
    canvasEl.addEventListener("pointerleave", onLeave);
    canvasEl.addEventListener("click", onClick);

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "200px" });
    observer.observe(stageEl);

    let frame = 0;
    let lastActive = -1;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      state.current += (state.target - state.current) * 0.085;
      const p = state.current;
      group.rotation.y = -p * total * STEP;
      group.position.y = -p * total * RISE - 0.1;
      group.position.x = shiftX;
      camera.position.x += (state.px * 0.7 - camera.position.x) * 0.05;
      camera.position.y += (0.2 + state.py * 0.35 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Hover via raycast
      let hit = -1;
      if (Math.abs(state.pointer.x) <= 1) {
        raycaster.setFromCamera(state.pointer, camera);
        const hits = raycaster.intersectObjects(cards.filter(matches).map((c) => c.mesh), false);
        if (hits.length) hit = cards.findIndex((c) => c.mesh === hits[0].object);
      }
      if (hit >= 0) {
        const facing = Math.cos(cards[hit].angle + group.rotation.y);
        if (facing < 0.05) hit = -1;
      }
      if (hit !== state.hovered) {
        state.hovered = hit;
        canvasEl.dataset.cursor = hit >= 0 ? "view" : "";
        if (hit < 0) canvasEl.removeAttribute("data-cursor");
      }

      let best = -1;
      let bestFacing = -2;
      cards.forEach((card, i) => {
        const facing = Math.cos(card.angle + group.rotation.y);
        const enabled = matches(card);
        const baseOpacity = THREE.MathUtils.clamp((facing + 0.45) / 1.3, 0.1, 1);
        card.opacity += ((enabled ? baseOpacity : Math.min(0.1, baseOpacity)) - card.opacity) * 0.12;
        card.hoverTarget = i === state.hovered ? 1 : 0;
        card.hover += (card.hoverTarget - card.hover) * 0.14;
        card.material.uniforms.uOpacity.value = card.opacity;
        card.material.uniforms.uHover.value = card.hover;
        const radius = RADIUS + card.hover * 0.55;
        card.mesh.position.x = Math.sin(card.angle) * radius;
        card.mesh.position.z = Math.cos(card.angle) * radius;
        card.mesh.scale.setScalar(1 + card.hover * 0.05);
        card.mesh.renderOrder = Math.round((facing + 1) * 10);
        const worldY = card.mesh.position.y + group.position.y;
        const score = facing - Math.abs(worldY) * 0.16;
        if (enabled && score > bestFacing) { bestFacing = score; best = i; }
      });
      if (best !== lastActive && best >= 0) {
        lastActive = best;
        setActive(best);
      }
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(refreshTimer);
      observer.disconnect();
      trigger.kill();
      window.removeEventListener("resize", resize);
      canvasEl.removeEventListener("pointermove", onMove);
      canvasEl.removeEventListener("pointerleave", onLeave);
      canvasEl.removeEventListener("click", onClick);
      planeGeometry.dispose();
      guideGeometry.dispose();
      guideMaterial.dispose();
      cards.forEach(({ material, texture }) => { material.dispose(); texture.dispose(); });
      renderer.dispose();
    };
  }, [router]);

  const current = experiences[active];

  return (
    <section id="all-experiences" className="helix" data-chapter="Imagine">
      <div className="helix-stage" ref={stage}>
        <div className="helix-head">
          <Reveal>
            <span className="chapter-tag">02 / The full collection</span>
            <h2>Choose your<br /><em>kind of moment.</em></h2>
          </Reveal>
          <div className="filter-bar" role="group" aria-label="Filter experiences">
            {FILTERS.map((name) => (
              <button key={name} type="button" className={filter === name ? "active" : ""} onClick={() => setFilter(name)}>
                {name}<sup>{name === "All" ? experiences.length : experiences.filter((x) => x.category === name).length}</sup>
              </button>
            ))}
          </div>
        </div>
        <canvas ref={canvas} className="helix-canvas" data-cursor-live="true" aria-label="Interactive 3D spiral of ECHO experiences. Scroll to rotate, click a card to open it." role="img" />
        <div className="helix-caption">
          <div key={current.slug}>
            <small>{String(active + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")} · {current.category} experience</small>
            <h3>{current.shortTitle}</h3>
            <p>{current.description}</p>
            <Link href={`/experiences/${current.slug}`} className="button button-dark">Explore {current.shortTitle} <ArrowUpRight /></Link>
          </div>
          <span className="helix-hint">Scroll to spin the spiral</span>
        </div>
      </div>
    </section>
  );
}

