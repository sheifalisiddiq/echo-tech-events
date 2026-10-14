"use client";

import { useState } from "react";
import { experiences } from "@/lib/data";
import { ExperienceCard } from "./experience-card";

const filters = ["All", "Photo", "Video", "AI", "Immersive"] as const;

export function ExperienceFilter() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const visible = active === "All" ? experiences : experiences.filter((item) => item.category === active);
  return (
    <>
      <div className="filter-bar" role="group" aria-label="Filter experiences">
        {filters.map((filter) => <button key={filter} className={active === filter ? "active" : ""} onClick={() => setActive(filter)}>{filter}<sup>{filter === "All" ? experiences.length : experiences.filter((x) => x.category === filter).length}</sup></button>)}
      </div>
      <div className="directory-grid">
        {visible.map((item, index) => <ExperienceCard key={item.slug} item={item} index={index} />)}
      </div>
    </>
  );
}
