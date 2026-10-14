"use client";

import { useRef } from "react";
import { ParallaxImage } from "@/components/parallax-image";
import { Reveal } from "@/components/reveal";
import { DESKTOP_MOTION, gsap, useGSAP } from "@/lib/gsap";

type Step = readonly [label: string, title: string, body: string];

/** Process section: pinned on desktop; a line draws across and the four steps light up in sequence. */
export function ProcessJourney({ steps, image }: { steps: readonly Step[]; image: string }) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = section.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        el.classList.add("journey-pinned");
        const items = gsap.utils.toArray<HTMLElement>(".process-step", el);
        const fill = el.querySelector<HTMLElement>(".journey-rail span");
        const update = (progress: number) => {
          if (fill) gsap.set(fill, { scaleX: progress });
          items.forEach((item, i) => item.classList.toggle("on", progress >= (i + 0.35) / items.length - 0.02));
        };
        update(0);
        const trigger = gsap.to({}, {
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            refreshPriority: 1,
            onUpdate: (self) => update(self.progress),
          },
        });
        return () => {
          el.classList.remove("journey-pinned");
          items.forEach((item) => item.classList.remove("on"));
          trigger.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section className="journey" ref={section} data-chapter="Share">
      <div className="journey-bg"><ParallaxImage src={image} alt="" speed={12} /></div>
      <div className="process-echo" aria-hidden="true" />
      <div className="journey-inner">
        <Reveal className="section-heading">
          <span className="chapter-tag">06 / A considered process</span>
          <h2>From brief to<br /><em>show time.</em></h2>
        </Reveal>
        <div className="process-line">
          <div className="journey-rail" aria-hidden="true"><span /></div>
          {steps.map(([label, title, body], i) => (
            <Reveal className="process-step" delay={i * 0.08} key={label}>
              <div className="step-dot" />
              <span>0{i + 1} / {label}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
