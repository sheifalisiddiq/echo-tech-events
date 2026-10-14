"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isReady, lockScroll, unlockScroll } from "@/lib/scroll";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Experiences", "/experiences"],
  ["Portfolio", "/portfolio"],
  ["Contact", "/contact"],
] as const;

const COIN_LAYERS = Array.from({ length: 9 }, (_, i) => i - 4);

/** Extruded 3D crown: stacked layers spin with page scroll and flip on hover. */
function LogoCoin() {
  const coinRef = useRef<HTMLSpanElement>(null);
  const spin = useRef({ scroll: 0, hover: 0 });

  useEffect(() => {
    const el = coinRef.current;
    if (!el) return;
    const state = spin.current;
    const render = () => { gsap.set(el, { rotationY: state.scroll + state.hover }); };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.to(state, { scroll: self.progress * 720, duration: 0.6, ease: "power2.out", overwrite: "auto", onUpdate: render });
      },
    });
    return () => trigger.kill();
  }, []);

  const flip = () => {
    const el = coinRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const state = spin.current;
    gsap.to(state, {
      hover: state.hover + 360,
      duration: 1.1,
      ease: "power3.inOut",
      overwrite: false,
      onUpdate: () => { gsap.set(el, { rotationY: state.scroll + state.hover }); },
    });
  };

  return (
    <Link href="/" className="brand" aria-label="ECHO TECH EVENTS home" onPointerEnter={flip}>
      <span className="logo-stage" aria-hidden="true">
        <span className="logo-coin" ref={coinRef}>
          {COIN_LAYERS.map((z) => (
            <span key={z} className={`coin-layer${z === 4 ? " front" : ""}`} style={{ transform: `translateZ(${z * 1.1}px)` }} />
          ))}
        </span>
      </span>
      <span className="brand-word" aria-hidden="true">ECHO<small>Tech Events</small></span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tone, setTone] = useState<"dark" | "light">("dark");
  const [refract, setRefract] = useState(false);
  const pathname = usePathname();
  const glassRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  openRef.current = open;

  const isActive = useCallback((href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)), [pathname]);
  const activeHref = links.find(([, href]) => isActive(href))?.[1] ?? null;
  const indicator = hovered ?? activeHref;

  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    setRefract(Boolean((window as unknown as { chrome?: unknown }).chrome) && CSS.supports("backdrop-filter", "url(#x)"));
  }, []);

  // Mobile menu scroll lock.
  useEffect(() => {
    if (open) lockScroll();
    else if (isReady()) unlockScroll();
  }, [open]);

  // Hide on scroll down, show on scroll up, and adapt the glass tint to the section underneath.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const detectTone = () => {
      const pill = glassRef.current;
      if (!pill) return;
      const rect = pill.getBoundingClientRect();
      const stack = document.elementsFromPoint(window.innerWidth / 2, Math.min(window.innerHeight - 2, rect.bottom + 6));
      for (const node of stack) {
        if (node.closest(".site-header")) continue;
        const match = getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
        if (!match) continue;
        const [r, g, b, a = "1"] = match;
        if (Number(a) < 0.6) continue;
        const luminance = (0.2126 * Number(r) + 0.7152 * Number(g) + 0.0722 * Number(b)) / 255;
        setTone(luminance > 0.62 ? "light" : "dark");
        return;
      }
      setTone("dark");
    };
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (!openRef.current) {
        if (y > 180 && y > last + 6) setHidden(true);
        else if (y < last - 6 || y < 180) setHidden(false);
      }
      last = y;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(detectTone);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = glassRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <>
      <svg className="glass-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="liquid-glass" x="-4%" y="-20%" width="108%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.022" numOctaves="2" seed="7" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2.2" result="soft" />
            <feDisplacementMap in="SourceGraphic" in2="soft" scale="26" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <header className="site-header" data-hidden={hidden && !open} data-scrolled={scrolled} data-tone={tone} data-refract={refract}>
        <div className="glass-nav" ref={glassRef} onPointerMove={onPointerMove}>
          <span className="glass-sheen" aria-hidden="true" />
          <LogoCoin />
          <nav className="desktop-nav" aria-label="Primary navigation" onPointerLeave={() => setHovered(null)}>
            {links.map(([label, href]) => (
              <Link key={href} href={href} className={isActive(href) ? "active" : ""} onPointerEnter={() => setHovered(href)} onFocus={() => setHovered(href)} onBlur={() => setHovered(null)}>
                {indicator === href && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }} />}
                <span className="nav-label">{label}</span>
              </Link>
            ))}
          </nav>
          <Link href="/contact" className="button button-small header-quote">Get a quote <ArrowUpRight /></Link>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <span className="eyebrow">Navigate / ECHO</span>
        {links.map(([label, href], i) => (
          <Link key={href} href={href} style={{ transitionDelay: open ? `${0.08 + i * 0.06}s` : "0s" }} tabIndex={open ? 0 : -1}><small>0{i + 1}</small>{label}</Link>
        ))}
        <Link href="/contact" className="button button-light" tabIndex={open ? 0 : -1}>Start a project <ArrowUpRight /></Link>
      </div>
    </>
  );
}
