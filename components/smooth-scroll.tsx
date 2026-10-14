"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
    });
    setLenis(lenis);
    if (document.documentElement.classList.contains("is-locked")) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // New route: start at the top and let triggers re-measure the new page.
  useEffect(() => {
    window.scrollTo(0, 0);
    const ids = [250, 1200, 2800].map((ms) => window.setTimeout(() => ScrollTrigger.refresh(), ms));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [pathname]);

  return null;
}
