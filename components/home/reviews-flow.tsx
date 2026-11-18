import { ArrowUpRight, Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { Review, Testimonial } from "@/lib/data";

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
    <span className="rv-stars" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => <Star key={i} style={i < count ? undefined : { opacity: 0.25 }} />)}
    </span>
  );
}

const initials = (name: string) => name.replace(/^Dr\.?\s+/i, "").split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

type Slide = { kind: "google"; review: Review } | { kind: "testimonial"; testimonial: Testimonial };

/** Interleave Google reviews with client testimonials so both slide in one row. */
function mix(reviews: Review[], testimonials: Testimonial[]): Slide[] {
  const slides: Slide[] = [];
  const total = Math.max(reviews.length, testimonials.length);
  for (let i = 0; i < total; i++) {
    if (reviews[i]) slides.push({ kind: "google", review: reviews[i] });
    if (testimonials[i]) slides.push({ kind: "testimonial", testimonial: testimonials[i] });
  }
  return slides;
}

function SlideCard({ slide }: { slide: Slide }) {
  if (slide.kind === "testimonial") {
    return (
      <article className="rv-card tm-card">
        <span className="rv-mark" aria-hidden="true">“</span>
        <blockquote>{slide.testimonial.text}</blockquote>
        <div className="rv-who">
          <div>
            <strong>Client testimonial</strong>
          </div>
        </div>
      </article>
    );
  }
  const { review } = slide;
  return (
    <article className="rv-card">
      <span className="rv-mark" aria-hidden="true">“</span>
      <Stars count={review.stars} />
      <blockquote>{review.text}</blockquote>
      <div className="rv-who">
        <span className="rv-avatar" aria-hidden="true">{initials(review.name)}</span>
        <div>
          <strong>{review.name}</strong>
          <small>{review.when}</small>
        </div>
        <a href={review.url} target="_blank" rel="noopener noreferrer" aria-label={`Read ${review.name}'s review on Google`}>
          <GoogleG /> View <ArrowUpRight />
        </a>
      </div>
      <details className="rv-reply">
        <summary>Reply from ECHO TECH EVENTS</summary>
        <p>{review.ownerReply}</p>
      </details>
    </article>
  );
}

export function ReviewsSection({ reviews, testimonials }: { reviews: Review[]; testimonials: Testimonial[] }) {
  const average = reviews.reduce((sum, r) => sum + r.stars, 0) / Math.max(reviews.length, 1);
  const slides = mix(reviews, testimonials);

  return (
    <section className="reviews-section" data-chapter="Share">
      <div className="reviews-head">
        <Reveal>
          <span className="chapter-tag">06 / Client voices</span>
          <h2>Heard from<br /><em>the room.</em></h2>
        </Reveal>
        <Reveal delay={0.1} className="rv-score">
          <span className="rv-score-g"><GoogleG /></span>
          <div>
            <div className="rv-score-top"><strong>{average.toFixed(1)}</strong><Stars count={Math.round(average)} /></div>
            <p>{reviews.length} Google {reviews.length === 1 ? "review" : "reviews"} from real clients</p>
          </div>
        </Reveal>
      </div>

      <div className="rv-viewport" role="region" aria-label="Client reviews and testimonials">
        <div className="rv-track">
          {[false, true].map((copy) => (
            <div className="rv-row" key={String(copy)} aria-hidden={copy || undefined} inert={copy || undefined}>
              {slides.map((slide, i) => (
                <div className="rv-slide" key={i}>
                  <SlideCard slide={slide} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
