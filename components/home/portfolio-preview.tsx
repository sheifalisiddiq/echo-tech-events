"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { AutoplayVideo } from "@/components/autoplay-video";
import { Reveal } from "@/components/reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { scribbleBooth } from "@/lib/client-work";

/** Home portfolio teaser: three real pieces of delivered work drifting at different speeds. */
export function PortfolioPreview() {
  const grid = useRef<HTMLDivElement>(null);
  const [v1, v2] = scribbleBooth.videos;
  const shot = scribbleBooth.images[1];

  useGSAP(
    () => {
      const el = grid.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
        const offsets = [0, 70, 20];
        gsap.utils.toArray<HTMLElement>(".home-work-tile", el).forEach((tile, i) => {
          gsap.fromTo(tile, { y: offsets[i] }, {
            y: offsets[i] - 90,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: grid },
  );

  return (
    <section className="section portfolio-preview" data-chapter="Experience">
      <Reveal className="section-heading split-heading">
        <div><span className="chapter-tag">04 / Selected work</span><h2>Moments with<br /><em>presence.</em></h2></div>
        <div>
          <p>Real footage and guest screens from a delivered {scribbleBooth.title} activation.</p>
          <Link href="/portfolio" className="text-link">View full portfolio <ArrowUpRight /></Link>
        </div>
      </Reveal>
      <div className="home-work" ref={grid}>
        <figure className="home-work-tile"><AutoplayVideo video={v1} /></figure>
        <figure className="home-work-tile">
          <Image src={shot.src} alt={shot.title} width={shot.width} height={shot.height} sizes="(max-width: 760px) 100vw, 30vw" />
        </figure>
        <figure className="home-work-tile"><AutoplayVideo video={v2} /></figure>
      </div>
      <Link href="/portfolio" className="button home-work-cta" data-cursor="view" data-cursor-label="Open">See all work <ArrowUpRight /></Link>
    </section>
  );
}
