"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ParallaxImage } from "@/components/parallax-image";
import { Reveal } from "@/components/reveal";
import { DESKTOP_MOTION, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Experience } from "@/lib/data";

/**
 * Signature experiences. Desktop: the section pins and vertical scroll drives a horizontal rail with
 * in-frame image parallax and 3D tilt. Touch/tablet/reduced motion: a native swipe carousel.
 */
export function SignatureRail({ items, total }: { items: Experience[]; total: number }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLElement>(null);
  const [rail, setRail] = useState<gsap.core.Tween | undefined>();

  useGSAP(
    () => {
      const sectionEl = section.current;
      const trackEl = track.current;
      if (!sectionEl || !trackEl) return;
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        sectionEl.classList.add("sig-pinned");
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

        const tween = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            refreshPriority: 3,
            onUpdate: (self) => {
              if (bar.current) gsap.set(bar.current, { scaleX: Math.max(0.04, self.progress) });
              if (counter.current) counter.current.textContent = String(Math.min(items.length, Math.floor(self.progress * items.length) + 1)).padStart(2, "0");
            },
          },
        });
        setRail(tween);

        const cards = gsap.utils.toArray<HTMLElement>(".sig-card", trackEl);
        cards.forEach((card) => {
          ScrollActive(card, tween);
        });

        // 3D tilt toward the cursor.
        const cleanups = cards.map((card) => {
          const onMove = (event: PointerEvent) => {
            const rect = card.getBoundingClientRect();
            const nx = (event.clientX - rect.left) / rect.width - 0.5;
            const ny = (event.clientY - rect.top) / rect.height - 0.5;
            card.classList.add("is-tilting");
            card.style.setProperty("--ry", `${nx * 9}deg`);
            card.style.setProperty("--rx", `${ny * -9}deg`);
          };
          const onLeave = () => {
            card.classList.remove("is-tilting");
            card.style.setProperty("--ry", "0deg");
            card.style.setProperty("--rx", "0deg");
          };
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          return () => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          };
        });

        return () => {
          sectionEl.classList.remove("sig-pinned");
          cleanups.forEach((fn) => fn());
          setRail(undefined);
        };
      });

      return () => mm.revert();
    },
    { scope: section, dependencies: [items.length] },
  );

  return (
    <section id="featured" className="sig" ref={section} data-chapter="Imagine">
      <div className="sig-head">
        <Reveal>
          <span className="chapter-tag">01 / Signature experiences</span>
          <h2>Designed to stop<br />the <em>room.</em></h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p>More than a camera. Each format is a visual centerpiece, a guest interaction and a shareable piece of your event story.</p>
        </Reveal>
      </div>

      <div className="sig-viewport">
        <div className="sig-track" ref={track}>
          {items.map((item, index) => (
            <Link key={item.slug} href={`/experiences/${item.slug}`} className="sig-card" data-cursor="view">
              <ParallaxImage src={item.image} alt={`Demonstration visual for ${item.title}`} axis="x" speed={9} containerAnimation={rail} sizes="(max-width: 1024px) 80vw, 34vw" />
              <div className="card-shade" />
              <span className="sig-num" aria-hidden="true">0{index + 1}</span>
              <div className="demo-tag">Demo media</div>
              <div className="sig-body">
                <span>{item.category} experience</span>
                <h3>{item.shortTitle}</h3>
                <p>{item.description}</p>
                <div className="card-arrow"><ArrowUpRight /></div>
              </div>
            </Link>
          ))}
          <div className="sig-outro">
            <strong>{String(total).padStart(2, "0")}</strong>
            <p>formats across photo, video, AI and immersive experiences.</p>
            <Link href="/experiences" className="button button-light">View all {total} experiences <ArrowRight /></Link>
          </div>
        </div>
      </div>

      <div className="sig-meter" aria-hidden="true">
        <span><b ref={counter}>01</b> / {String(items.length).padStart(2, "0")}</span>
        <div className="sig-meter-bar"><span ref={bar} /></div>
        <span>Keep scrolling</span>
      </div>
    </section>
  );
}

/** Highlight the card nearest the centre of the pinned rail. */
function ScrollActive(card: HTMLElement, tween: gsap.core.Tween) {
  ScrollTrigger.create({
    trigger: card,
    containerAnimation: tween,
    start: "left 70%",
    end: "right 30%",
    toggleClass: { targets: card, className: "is-active" },
  });
}
