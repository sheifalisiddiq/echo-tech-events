"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2, X } from "lucide-react";
import { portfolioItems } from "@/lib/data";

export function PortfolioFilter() {
  const categories = ["All", ...new Set(portfolioItems.map((item) => item.category))];
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<(typeof portfolioItems)[number] | null>(null);
  const items = active === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === active);
  return (
    <>
      <div className="filter-bar portfolio-filters">{categories.map((cat) => <button key={cat} className={active === cat ? "active" : ""} onClick={() => setActive(cat)}>{cat}</button>)}</div>
      <div className="portfolio-grid">
        {items.map((item, index) => (
          <button className={`portfolio-card p-${index + 1}`} key={item.title} onClick={() => setSelected(item)}>
            <Image src={item.image} alt={`Demonstration visual: ${item.title}`} fill sizes="(max-width: 768px) 100vw, 50vw" />
            <span className="demo-tag">Demo concept</span><span className="portfolio-meta">{item.category}<strong>{item.title}</strong></span><Maximize2 />
          </button>
        ))}
      </div>
      {selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
        <button aria-label="Close viewer"><X /></button>
        <Image src={selected.image} alt={`Demonstration visual: ${selected.title}`} fill sizes="95vw" />
        <div><span>Demonstration media</span><h2>{selected.title}</h2><p>This placeholder shows the intended portfolio presentation. Replace with approved ECHO project media.</p></div>
      </div>}
    </>
  );
}
