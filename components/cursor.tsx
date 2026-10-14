"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const LABELS: Record<string, string> = { view: "View", drag: "Drag", play: "Play", open: "Open" };
const TARGETS = "[data-cursor], a, button, [role='button'], summary, label, input, textarea, select";

/**
 * Custom cursor: a dot plus a lagging ring. Elements opt in with `data-cursor="view|drag|play"`
 * (optionally `data-cursor-label`). Only active for fine pointers and when motion is allowed.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !dot || !ring || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");

    const dotX = gsap.quickSetter(dot, "x", "px");
    const dotY = gsap.quickSetter(dot, "y", "px");
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    const over = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest?.(TARGETS) ?? null;
      let state = "default";
      let text = "";
      if (el) {
        const custom = el.getAttribute("data-cursor");
        if (custom) {
          state = custom;
          text = el.getAttribute("data-cursor-label") ?? LABELS[custom] ?? "";
        } else if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) state = "native";
        else state = "link";
      }
      root.dataset.state = state;
      label.textContent = text;
    };

    let shown = false;
    const move = (event: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot, ring], { x: event.clientX, y: event.clientY });
        root.dataset.visible = "1";
      }
      if ((event.target as HTMLElement | null)?.dataset?.cursorLive) over(event);
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const down = () => { root.dataset.pressed = "1"; };
    const up = () => { root.dataset.pressed = "0"; };
    const leave = () => { root.dataset.visible = "0"; shown = false; };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      html.classList.remove("has-cursor");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="cursor" ref={rootRef} data-state="default" data-visible="0" aria-hidden="true">
      <div className="cursor-ring" ref={ringRef}>
        <span ref={labelRef} />
      </div>
      <div className="cursor-dot" ref={dotRef} />
    </div>
  );
}
