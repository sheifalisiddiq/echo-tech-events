"use client";

import { useRef } from "react";
import { CircleCheck } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Values as stacking cards: each card pins and the previous one recedes as the next slides over it. */
export function WhyStack({ values }: { values: readonly (readonly [string, string])[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".why-card", el);
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card, {
            scale: 0.93,
            filter: "brightness(.55)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 78%", end: "top 24%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div className="why-stack" ref={root}>
      {values.map(([title, body], i) => (
        <article className="why-card" key={title} style={{ "--i": i } as React.CSSProperties}>
          <span className="why-num" aria-hidden="true">0{i + 1}</span>
          <div className="why-head">
            <h3>{title}</h3>
            <CircleCheck />
          </div>
          <p>{body}</p>
        </article>
      ))}
    </div>
  );
}
