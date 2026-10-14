"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

const MAGNETIC = ".button, .round-link, [data-magnetic]";

/** Global pointer behaviours: magnetic buttons and the cursor-origin fill sweep. */
export function Interactions() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let current: HTMLElement | null = null;
    const release = (el: HTMLElement) => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)", overwrite: "auto" });

    const move = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest?.(MAGNETIC) as HTMLElement | null;
      if (current && current !== el) {
        release(current);
        current = null;
      }
      if (!el) return;
      current = el;
      const rect = el.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      el.style.setProperty("--bx", `${px}px`);
      el.style.setProperty("--by", `${py}px`);
      gsap.to(el, { x: (px - rect.width / 2) * 0.22, y: (py - rect.height / 2) * 0.32, duration: 0.35, ease: "power3.out", overwrite: "auto" });
    };
    const leave = () => {
      if (current) release(current);
      current = null;
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);
  return null;
}
