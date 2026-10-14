"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Top progress bar plus a right-hand chapter rail driven by `data-chapter` sections. */
export function ScrollProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [chapters, setChapters] = useState<string[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => { gsap.set(bar, { scaleX: self.progress }); },
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    // Wait for pinned scenes (created by page components) so section offsets include their pin spacing.
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
      const names = Array.from(new Set(sections.map((section) => section.dataset.chapter as string)));
      setChapters(names);
      setActive(0);
      triggers = sections.map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => { if (self.isActive) setActive(names.indexOf(section.dataset.chapter as string)); },
        }),
      );
    }, 350);
    return () => {
      window.clearTimeout(timer);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  const jump = (name: string) => {
    const target = document.querySelector<HTMLElement>(`[data-chapter="${name}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="scroll-bar" aria-hidden="true"><div ref={barRef} /></div>
      {chapters.length > 1 && (
        <nav className="chapter-rail" aria-label="Page chapters">
          {chapters.map((name, i) => (
            <button key={name} type="button" className={i === active ? "active" : ""} onClick={() => jump(name)} aria-label={`Jump to ${name}`} aria-current={i === active}>
              <span className="chapter-label"><small>0{i + 1}</small>{name}</span>
              <span className="chapter-dot" />
            </button>
          ))}
        </nav>
      )}
    </>
  );
}
