"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight, MessageCircle } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onEchoReady } from "@/lib/scroll";

const HeroField = dynamic(() => import("@/components/three/hero-field"), { ssr: false });

export function Hero({ image }: { image: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(el);
        const bg = q(".hero-bg")[0];
        const streaks = q(".hero-streaks")[0];
        const content = q(".hero-content")[0];
        const lines = q(".hero-line > span");
        const fades = q("[data-hero-fade]");

        gsap.set(lines, { yPercent: 115 });
        gsap.set(fades, { autoAlpha: 0, y: 26 });
        gsap.set(bg, { scale: 1.2 });

        const off = onEchoReady(() => {
          gsap
            .timeline()
            .to(bg, { scale: 1.06, duration: 2.4, ease: "power3.out" }, 0)
            .to(lines, { yPercent: 0, duration: 1.25, stagger: 0.13, ease: "power4.out" }, 0.15)
            .to(fades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.55);
        });

        // Scroll parallax: each layer travels at its own speed.
        const scrub = { trigger: el, start: "top top", end: "bottom top", scrub: true };
        gsap.to(bg, { yPercent: 14, ease: "none", scrollTrigger: scrub });
        gsap.to(streaks, { yPercent: 32, ease: "none", scrollTrigger: scrub });
        gsap.to(content, { yPercent: -16, autoAlpha: 0.15, ease: "none", scrollTrigger: scrub });

        // Mouse parallax (fine pointers only).
        let cleanupPointer = () => {};
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          const bgX = gsap.quickTo(bg, "x", { duration: 1.2, ease: "power3" });
          const bgY = gsap.quickTo(bg, "y", { duration: 1.2, ease: "power3" });
          const stX = gsap.quickTo(streaks, "x", { duration: 1.6, ease: "power3" });
          const ctX = gsap.quickTo(content, "x", { duration: 1.1, ease: "power3" });
          const onMove = (event: PointerEvent) => {
            const nx = event.clientX / window.innerWidth - 0.5;
            const ny = event.clientY / window.innerHeight - 0.5;
            bgX(nx * -34);
            bgY(ny * -22);
            stX(nx * 70);
            ctX(nx * 10);
          };
          el.addEventListener("pointermove", onMove);
          cleanupPointer = () => el.removeEventListener("pointermove", onMove);
        }

        return () => {
          off();
          cleanupPointer();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="hero" ref={root} data-chapter="Arrive">
      <div className="hero-layers">
        <div className="hero-bg">
          <Image src={image} alt="Demonstration image of a cinematic event environment with blue lighting" fill priority sizes="100vw" />
        </div>
        <div className="hero-streaks" />
        <HeroField />
      </div>
      <div className="hero-overlay" />
      <div className="hero-gridlines" />
      <div className="hero-content">
        <div className="hero-kicker" data-hero-fade><span /> Dubai · United Arab Emirates</div>
        <h1>
          <span className="hero-line"><span>Premium photo booths</span></span>
          <span className="hero-line"><span>& interactive event</span></span>
          <span className="hero-line"><span className="outline-text">experiences.</span></span>
        </h1>
        <div className="hero-bottom">
          <p data-hero-fade>We create memorable, branded and customized event moments through premium capture technology and interactive entertainment.</p>
          <div className="hero-actions" data-hero-fade>
            <Link className="button button-light" href="/experiences">Explore experiences <ArrowUpRight /></Link>
            <Link className="button button-ghost" href="/contact">Get a quote</Link>
            <Link className="round-link" href="/contact" aria-label="WhatsApp enquiry"><MessageCircle /> <span>WhatsApp<br />via enquiry</span></Link>
          </div>
        </div>
      </div>
      <a className="scroll-cue" href="#featured"><ArrowDown /> Scroll to explore</a>
      <span className="demo-disclosure">Concept media · to be replaced with ECHO event footage</span>
    </section>
  );
}
