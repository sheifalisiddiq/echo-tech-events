"use client";

import { useEffect, useRef } from "react";
import type { ClientVideo } from "@/lib/client-work";

/** Muted looping video that plays only while on screen (and not at all under reduced motion). */
export function AutoplayVideo({ video, controls = false }: { video: ClientVideo; controls?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={video.src}
      poster={video.poster}
      width={video.width}
      height={video.height}
      muted
      loop
      playsInline
      preload="metadata"
      controls={controls}
      aria-label={video.title}
    />
  );
}
