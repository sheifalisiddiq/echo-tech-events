"use client";

import Image from "next/image";
import { useRef } from "react";
import { AutoplayVideo } from "@/components/autoplay-video";
import { gsap, useGSAP } from "@/lib/gsap";
import { scribbleBooth } from "@/lib/client-work";

/** Animated portfolio: pinned horizontal reel on desktop, then screens that fly in on scroll. */
export function ClientWork() {
  const work = scribbleBooth;
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current;
        const p = pin.current;
        if (!t || !p) return;
        const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
        const total = work.videos.length;
        const tween = gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: p,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
              if (count.current) count.current.textContent = `0${Math.min(total, Math.floor(self.progress * total) + 1)} / 0${total}`;
            },
          },
        });
        // each reel tilts and scales as it crosses the viewport
        gsap.utils.toArray<HTMLElement>(".reel", t).forEach((reel) => {
          gsap.fromTo(
            reel,
            { rotate: 5, scale: 0.9 },
            {
              rotate: -3,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: reel, containerAnimation: tween, start: "left 90%", end: "right 10%", scrub: true },
            },
          );
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        gsap.utils.toArray<HTMLElement>(".client-shots figure", el).forEach((fig, i) => {
          gsap.from(fig, {
            y: 90,
            opacity: 0,
            scale: 0.88,
            rotate: i % 2 ? 4 : -4,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: fig, start: "top 92%" },
          });
        });
        gsap.from(".client-intro > *", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.2,
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="client-work" data-chapter="Selected work" ref={root}>
      <div className="client-pin" ref={pin}>
        <div className="client-track" ref={track}>
          <div className="client-intro">
            <span className="chapter-tag">Delivered / {work.category}</span>
            <h2>
              {work.title},
              <br />
              <em>in the wild.</em>
            </h2>
            <p>{work.description}</p>
            <div className="client-progress" aria-hidden="true">
              <span ref={count}>{`01 / 0${work.videos.length}`}</span>
              <i><span ref={bar} /></i>
              <em>Scroll →</em>
            </div>
          </div>
          {work.videos.map((video) => (
            <figure className="reel client-tile client-video" key={video.src}>
              <AutoplayVideo video={video} />
            </figure>
          ))}
        </div>
      </div>
      <div className="client-shots-wrap">
        <span className="chapter-tag">Guest-facing screens</span>
        <div className="client-shots">
          {work.images.map((img) => (
            <figure className="client-tile" key={img.src}>
              <Image src={img.src} alt={img.title} width={img.width} height={img.height} sizes="(max-width: 760px) 50vw, 20vw" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
