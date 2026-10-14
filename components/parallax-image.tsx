"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  src: string;
  alt: string;
  /** Travel as a percentage of the frame (each direction). */
  speed?: number;
  axis?: "y" | "x";
  /** For images inside a horizontally scrolled rail: the ScrollTrigger container animation. */
  containerAnimation?: gsap.core.Animation;
  priority?: boolean;
  sizes?: string;
  className?: string;
  objectPosition?: string;
  /** Keep the frame in normal flow (`relative`) rather than absolutely filling its parent. */
  inline?: boolean;
};

/**
 * Parallax image frame. The image is oversized inside an `overflow: hidden` frame and drifts against scroll.
 * Reduced on touch, off when the visitor prefers reduced motion.
 */
export function ParallaxImage({ src, alt, speed = 10, axis = "y", containerAnimation, priority, sizes = "100vw", className = "", objectPosition, inline }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = frame.current;
      const img = inner.current;
      if (!el || !img) return;
      const mm = gsap.matchMedia();
      const build = (amount: number) => {
        const prop = axis === "y" ? "yPercent" : "xPercent";
        gsap.fromTo(
          img,
          { [prop]: -amount },
          {
            [prop]: amount,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              containerAnimation,
              start: containerAnimation ? "left right" : "top bottom",
              end: containerAnimation ? "right left" : "bottom top",
              scrub: true,
            },
          },
        );
      };
      mm.add("(prefers-reduced-motion: no-preference) and (hover: hover)", () => build(speed));
      mm.add("(prefers-reduced-motion: no-preference) and (hover: none)", () => build(speed * 0.4));
      return () => mm.revert();
    },
    { scope: frame, dependencies: [speed, axis, containerAnimation] },
  );

  // Oversize the image on the parallax axis by twice the travel so no edge ever shows.
  const over = speed * 2;
  const innerStyle = axis === "y" ? { top: `-${over}%`, bottom: `-${over}%` } : { left: `-${over}%`, right: `-${over}%`, top: 0, bottom: 0 };

  return (
    <div ref={frame} className={`pimg ${inline ? "pimg-inline" : ""} ${className}`}>
      <div ref={inner} className="pimg-inner" style={innerStyle}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} style={objectPosition ? { objectPosition } : undefined} />
      </div>
    </div>
  );
}
