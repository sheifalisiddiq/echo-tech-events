"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { ParallaxImage } from "@/components/parallax-image";
import { Reveal } from "@/components/reveal";
import { gsap, useGSAP } from "@/lib/gsap";

type Item = { title: string; category: string; image: string };

/** Portfolio direction: three layered frames drifting at different speeds, then a slow marquee strip. */
export function PortfolioPreview({ items }: { items: Item[] }) {
  const collage = useRef<HTMLDivElement>(null);
  const shots = items.slice(0, 3);
  const strip = [...items, ...items];

  useGSAP(
    () => {
      const el = collage.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
        const speeds = [6, 16, 26];
        gsap.utils.toArray<HTMLElement>(".preview-shot", el).forEach((shot, i) => {
          gsap.fromTo(shot, { yPercent: speeds[i] }, {
            yPercent: -speeds[i],
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: collage },
  );

  return (
    <section className="section portfolio-preview" data-chapter="Experience">
      <Reveal className="section-heading split-heading">
        <div><span className="chapter-tag">04 / Portfolio direction</span><h2>Moments with<br /><em>presence.</em></h2></div>
        <div>
          <p>Real ECHO project media has not yet been supplied. These concept frames demonstrate the intended premium portfolio art direction.</p>
          <Link href="/portfolio" className="text-link">Explore portfolio <ArrowUpRight /></Link>
        </div>
      </Reveal>
      <div className="preview-collage" ref={collage}>
        {shots.map((item, index) => (
          <div className={`preview-shot shot-${index + 1}`} key={item.title} data-cursor="view" data-cursor-label="Demo">
            <ParallaxImage src={item.image} alt={`Demonstration visual: ${item.title}`} speed={9} sizes="50vw" />
            <span>Demo concept / {item.category}</span>
          </div>
        ))}
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {strip.map((item, i) => (
            <div className="marquee-item" key={`${item.title}-${i}`}>
              <Image src={item.image} alt="" fill sizes="320px" />
              <span>{item.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
