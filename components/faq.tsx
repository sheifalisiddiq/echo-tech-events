"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export function FAQList({ items }: { items: readonly (readonly [string, string])[] }) {
  const [active, setActive] = useState<number | null>(0);
  return (
    <div className="faq-list">
      {items.map(([q, a], index) => (
        <div className={`faq-item ${active === index ? "open" : ""}`} key={q}>
          <button onClick={() => setActive(active === index ? null : index)} aria-expanded={active === index}>
            <span><small>0{index + 1}</small>{q}</span><Plus />
          </button>
          <div className="faq-answer"><p>{a}</p></div>
        </div>
      ))}
    </div>
  );
}
