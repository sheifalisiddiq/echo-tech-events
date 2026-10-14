"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ExperienceFilter } from "@/components/experience-filter";
import { Reveal } from "@/components/reveal";
import { DESKTOP_MOTION } from "@/lib/gsap";

const HelixScene = dynamic(() => import("./helix-scene"), { ssr: false });

function webglAvailable() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}

/** 3D spiral on capable desktops; the filterable grid everywhere else (and before hydration). */
export function HelixGallery() {
  const [mode, setMode] = useState<"grid" | "3d">("grid");

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MOTION);
    const update = () => setMode(mq.matches && webglAvailable() ? "3d" : "grid");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (mode === "3d") return <HelixScene />;

  return (
    <section className="section light-section" id="all-experiences" data-chapter="Imagine">
      <Reveal className="section-heading">
        <span className="chapter-tag">02 / The full collection</span>
        <h2>Choose your<br /><em>kind of moment.</em></h2>
      </Reveal>
      <ExperienceFilter />
    </section>
  );
}
