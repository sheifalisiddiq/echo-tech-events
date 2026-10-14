"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { Review } from "@/lib/data";

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className="stars" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (i < count ? <Star key={i} /> : <Star key={i} style={{ opacity: 0.25 }} />))}
    </span>
  );
}

const initials = (name: string) => name.replace(/^Dr\.?\s+/i, "").split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

/** Google reviews as a 3D coverflow: swipe, drag, arrows or autoplay. The owner reply slides up on request. */
export function ReviewsFlow({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0);
  const [replyOpen, setReplyOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const inView = useRef(false);
  const count = reviews.length;

  const go = useCallback((index: number) => {
    setReplyOpen(false);
    setActive(Math.max(0, Math.min(count - 1, index)));
  }, [count]);

  useEffect(() => {
    const el = root.current;
    if (!el || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => { inView.current = entry.isIntersecting; }, { threshold: 0.4 });
    observer.observe(el);
    const id = window.setInterval(() => {
      if (inView.current && !paused.current && !document.hidden) setActive((a) => (a + 1) % count);
    }, 7000);
    return () => { observer.disconnect(); window.clearInterval(id); };
  }, [count]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let startX = 0;
    let tracking = false;
    const onDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("button, a")) return;
      tracking = true;
      startX = event.clientX;
    };
    const onUp = (event: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > 55) go(active + (dx < 0 ? 1 : -1));
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [active, go]);

  const current = reviews[active];

  return (
    <>
      <div
        className="flow"
        ref={root}
        data-cursor={count > 1 ? "drag" : undefined}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        {reviews.map((review, i) => {
          const d = i - active;
          const isActive = d === 0;
          return (
            <article
              key={review.name}
              className="flow-card"
              style={{ "--d": d, "--ad": Math.abs(d) } as React.CSSProperties}
              aria-hidden={!isActive}
              onClick={() => { if (!isActive) go(i); }}
            >
              <Stars count={review.stars} />
              <blockquote className="flow-quote">“{review.text}”</blockquote>
              <div className="flow-who">
                <span className="flow-avatar" aria-hidden="true">{initials(review.name)}</span>
                <div>
                  <strong>{review.name}</strong>
                  <small>Google review · {review.when}</small>
                </div>
                <button type="button" className="flow-reply-toggle" onClick={() => setReplyOpen((v) => !v)} tabIndex={isActive ? 0 : -1} aria-expanded={isActive && replyOpen}>
                  Owner reply
                </button>
              </div>
              <div className={`flow-reply ${isActive && replyOpen ? "open" : ""}`}>
                <b>Response from ECHO TECH EVENTS <button type="button" onClick={() => setReplyOpen(false)} tabIndex={isActive && replyOpen ? 0 : -1}>Close</button></b>
                <p>{review.ownerReply}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flow-nav">
        <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous review"><ArrowLeft /></button>
        <span>{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
        <button type="button" onClick={() => go(active + 1)} disabled={active === count - 1} aria-label="Next review"><ArrowRight /></button>
      </div>
      <div className="reviews-more">
        <a className="text-link" href={current.url} target="_blank" rel="noopener noreferrer">Read this review on Google <ArrowUpRight /></a>
      </div>
    </>
  );
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="reviews-section" data-chapter="Share">
      <div className="reviews-head">
        <Reveal>
          <span className="chapter-tag">07 / Client voices</span>
          <h2>Heard from<br /><em>the room.</em></h2>
        </Reveal>
        <Reveal delay={0.1} className="reviews-badge">
          <span className="google-pill"><GoogleG /> Reviews on Google</span>
          <p>Words from clients who hosted ECHO at their events, shared publicly on Google. Each review links to its original.</p>
        </Reveal>
      </div>
      <ReviewsFlow reviews={reviews} />
    </section>
  );
}
