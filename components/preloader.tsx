"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scroll";

const SEEN_KEY = "echo-preloaded";
const RING_COUNT = 4;
const PROGRESS_RADIUS = 78;
const PROGRESS_LENGTH = 2 * Math.PI * PROGRESS_RADIUS;

function heroImageReady() {
  return new Promise<void>((resolve) => {
    const img = document.querySelector<HTMLImageElement>(".hero img");
    if (!img || img.complete) return resolve();
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function Preloader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch {}
    let cancelled = false;

    const markReady = () => {
      if (html.dataset.echoReady === "1") return;
      html.dataset.echoReady = "1";
      unlockScroll();
      window.dispatchEvent(new Event("echo:ready"));
      try { sessionStorage.setItem(SEEN_KEY, "1"); } catch {}
    };
    const done = () => { if (!cancelled) setGone(true); };

    lockScroll();
    // Safety net: never trap a visitor behind the loader.
    const failsafe = window.setTimeout(() => { markReady(); done(); }, 9000);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const veil = q(".pl-veil")[0] as HTMLElement;
      const edge = q(".pl-edge")[0] as HTMLElement;
      const countEl = q(".pl-num")[0] as HTMLElement;
      const arc = q(".pl-arc")[0] as unknown as SVGCircleElement;

      if (reduce || seen) {
        markReady();
        gsap.to(root, { autoAlpha: 0, duration: reduce ? 0.3 : 0.5, delay: seen && !reduce ? 0.1 : 0, ease: "power2.out", onComplete: done });
        return;
      }

      const progress = { p: 0 };
      const render = () => {
        const v = Math.round(progress.p);
        countEl.textContent = String(v).padStart(3, "0");
        arc.style.strokeDashoffset = String(PROGRESS_LENGTH * (1 - progress.p / 100));
      };
      render();

      gsap.set(q(".pl-logo"), { autoAlpha: 0, scale: 0.8 });
      gsap.set(q(".pl-tag span"), { autoAlpha: 0, y: 14 });
      gsap.set(q(".pl-meta"), { autoAlpha: 0 });

      const intro = gsap.timeline();
      intro
        .to(q(".pl-logo"), { autoAlpha: 1, scale: 1, duration: 1, ease: "power3.out" }, 0.1)
        .to(q(".pl-meta"), { autoAlpha: 1, duration: 0.6 }, 0.3)
        .to(q(".pl-tag span"), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }, 0.55);

      // Echo: soundwave rings radiate out of the mark until the page is ready.
      const rings = gsap.fromTo(
        q(".pl-ring"),
        { scale: 0.32, autoAlpha: 0.8, svgOrigin: "200 200" },
        { scale: 1.9, autoAlpha: 0, svgOrigin: "200 200", duration: 2.4, stagger: 0.6, repeat: -1, ease: "power1.out" },
      );

      const run = async () => {
        await new Promise<void>((resolve) => gsap.to(progress, { p: 88, duration: 1.9, ease: "power2.out", onUpdate: render, onComplete: resolve }));
        await Promise.race([Promise.all([document.fonts?.ready, heroImageReady()]), wait(4200)]);
        if (cancelled) return;
        await new Promise<void>((resolve) => gsap.to(progress, { p: 100, duration: 0.45, ease: "power1.out", onUpdate: render, onComplete: resolve }));
        await wait(180);
        if (cancelled) return;

        // Aperture: a glowing iris opens from the centre and reveals the hero.
        root.style.pointerEvents = "none";
        markReady();
        rings.kill();
        const maxR = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 40;
        const hole = { r: 0 };
        const applyHole = () => {
          const mask = `radial-gradient(circle at 50% 50%, transparent ${hole.r}px, #000 ${hole.r + 1.5}px)`;
          veil.style.maskImage = mask;
          veil.style.setProperty("-webkit-mask-image", mask);
          edge.style.transform = `translate(-50%, -50%) scale(${Math.max(hole.r, 1) / 50})`;
        };
        applyHole();
        gsap.to(q(".pl-logo, .pl-tag, .pl-meta, .pl-count"), { autoAlpha: 0, scale: 1.06, duration: 0.45, ease: "power2.in" });
        gsap.to(edge, { autoAlpha: 1, duration: 0.2 });
        gsap.to(hole, {
          r: maxR,
          duration: 1.35,
          ease: "power3.inOut",
          onUpdate: applyHole,
          onComplete: () => { gsap.to(edge, { autoAlpha: 0, duration: 0.2 }); done(); },
        });
      };
      run();
    }, root);

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  return (
    <div className="preloader" ref={rootRef} aria-hidden="true">
      <div className="pl-veil">
        <div className="pl-center">
          <svg className="pl-rings" viewBox="0 0 400 400" fill="none">
            {Array.from({ length: RING_COUNT }, (_, i) => (
              <circle key={i} className="pl-ring" cx="200" cy="200" r="100" />
            ))}
            <circle className="pl-track" cx="200" cy="200" r={PROGRESS_RADIUS} />
            <circle
              className="pl-arc"
              cx="200"
              cy="200"
              r={PROGRESS_RADIUS}
              strokeDasharray={PROGRESS_LENGTH}
              strokeDashoffset={PROGRESS_LENGTH}
              transform="rotate(-90 200 200)"
            />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pl-logo" src="/echo-crown.png" alt="" width={640} height={456} />
        </div>
        <p className="pl-tag">
          <span>Engineering</span> <span>the</span> <span>moment</span>
        </p>
        <span className="pl-meta pl-count">
          <b className="pl-num">000</b>
          <i>%</i>
        </span>
        <span className="pl-meta pl-city">DXB / UAE</span>
      </div>
      <div className="pl-edge" />
    </div>
  );
}
