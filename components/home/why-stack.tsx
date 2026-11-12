"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const photos = [
  "/why-echo-brand.png",
  "/why-echo-technology.png",
  "/why-echo-delivery.png",
  "/why-echo-visibility.png",
  "/why-echo-support.png",
];
const kickers = ["Brand", "Technology", "Delivery", "Visibility", "Support"];

/** Index list: hover a row and a portrait preview follows the cursor, revealing that row's image. */
export function WhyStack({ values }: { values: readonly (readonly [string, string])[] }) {
  const index = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hovering) return;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.14;
      pos.current.y += (target.current.y - pos.current.y) * 0.14;
      if (preview.current) preview.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [hovering]);

  const move = (e: React.MouseEvent) => {
    const r = index.current?.getBoundingClientRect();
    if (!r) return;
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (!hovering) pos.current = { ...target.current };
  };

  return (
    <div
      className="why2-index"
      ref={index}
      onMouseMove={move}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className={`why2-preview${hovering ? " is-on" : ""}`} aria-hidden="true">
        <div ref={preview} className="why2-preview-pos">
          <div className="why2-preview-box">
            {photos.map((src, i) => (
              <div key={src} className="why2-preview-item" data-active={i === active}>
                <Image src={src} alt="" fill sizes="22vw" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {values.map(([title, body], i) => (
        <div
          className="why2-row"
          key={title}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          tabIndex={0}
        >
          <span className="why2-row-num">0{i + 1}</span>
          <div className="why2-row-main">
            <span className="why2-row-thumb" aria-hidden="true"><Image src={photos[i % photos.length]} alt="" fill sizes="64px" /></span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </div>
          <span className="why2-row-kicker">{kickers[i % kickers.length]}</span>
          <span className="why2-row-arrow" aria-hidden="true"><ArrowUpRight /></span>
        </div>
      ))}
    </div>
  );
}
