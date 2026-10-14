"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { gsap } from "@/lib/gsap";

type Occasion = readonly [title: string, description: string, image: string];

/** Occasions on a 3D ring: drag, swipe, arrows or autoplay; the front card is the active one. */
export function OccasionOrbit({ items }: { items: readonly Occasion[] }) {
  const count = items.length;
  const step = 360 / count;
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const angle = useRef({ value: 0 });
  const paused = useRef(false);
  const inView = useRef(false);
  const [active, setActive] = useState(0);
  const [radius, setRadius] = useState(420);
  const [dragging, setDragging] = useState(false);

  const render = useCallback(() => {
    if (!ring.current) return;
    const a = angle.current.value;
    gsap.set(ring.current, { rotationY: a, z: -radius });
    const index = (((Math.round(-a / step) % count) + count) % count);
    setActive((prev) => (prev === index ? prev : index));
  }, [count, radius, step]);

  const goTo = useCallback(
    (target: number, duration = 1.1) => {
      gsap.to(angle.current, { value: target, duration, ease: "power3.out", overwrite: true, onUpdate: render });
    },
    [render],
  );

  const snap = useCallback(() => goTo(Math.round(angle.current.value / step) * step, 0.9), [goTo, step]);
  const next = useCallback(() => goTo(Math.round(angle.current.value / step) * step - step), [goTo, step]);
  const prev = useCallback(() => goTo(Math.round(angle.current.value / step) * step + step), [goTo, step]);

  // Size the ring to the card width.
  useEffect(() => {
    const measure = () => {
      const cardWidth = Math.min(340, Math.max(240, window.innerWidth * 0.24));
      setRadius(Math.round((cardWidth / 2) / Math.tan(Math.PI / count) * 1.28));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [count]);

  useEffect(() => { render(); }, [render]);

  // Autoplay while visible and untouched.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => { inView.current = entry.isIntersecting; }, { threshold: 0.35 });
    observer.observe(el);
    const id = window.setInterval(() => {
      if (inView.current && !paused.current && !document.hidden) next();
    }, 3800);
    return () => { observer.disconnect(); window.clearInterval(id); };
  }, [next]);

  // Drag / swipe.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let startX = 0;
    let startAngle = 0;
    let down = false;
    let moved = 0;
    const onDown = (event: PointerEvent) => {
      down = true;
      moved = 0;
      startX = event.clientX;
      startAngle = angle.current.value;
      gsap.killTweensOf(angle.current);
      paused.current = true;
      setDragging(true);
      el.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!down) return;
      const dx = event.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      angle.current.value = startAngle + dx * 0.22;
      render();
    };
    const onUp = (event: PointerEvent) => {
      if (!down) return;
      down = false;
      setDragging(false);
      paused.current = false;
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
      snap();
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [render, snap]);

  const [title, description] = items[active];

  return (
    <section className="occasion-section" data-chapter="Imagine">
      <div className="orbit-head">
        <Reveal>
          <span className="chapter-tag">03 / Built for the occasion</span>
          <h2>One technology partner.<br /><em>Every kind of room.</em></h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p>From boardrooms to ballrooms, the format changes and the standard stays the same. Drag the ring to explore.</p>
        </Reveal>
      </div>

      <div className={`orbit ${dragging ? "dragging" : ""}`} ref={root} data-cursor="drag" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
        <div className="orbit-ring" ref={ring} style={{ transformStyle: "preserve-3d" }}>
          {items.map(([name, , image], i) => (
            <div key={name} className="orbit-card" style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}>
              <Image src={image} alt={`Demonstration visual for ${name}`} fill sizes="340px" draggable={false} />
              <em>0{i + 1}</em>
              <span>{name}</span>
            </div>
          ))}
        </div>
        <div className="orbit-floor" />
      </div>

      <div className="orbit-info">
        <div key={title}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="orbit-controls">
          <span className="orbit-count">{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
          <button type="button" onClick={prev} aria-label="Previous occasion"><ArrowLeft /></button>
          <button type="button" onClick={next} aria-label="Next occasion"><ArrowRight /></button>
          <Link href="/contact" className="button button-light" style={{ marginLeft: ".6rem" }}>Plan your event <ArrowUpRight /></Link>
        </div>
      </div>
    </section>
  );
}
