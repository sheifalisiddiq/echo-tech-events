import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, CircleCheck, MessageCircle } from "lucide-react";
import { ExperienceCard } from "@/components/experience-card";
import { ExperienceFilter } from "@/components/experience-filter";
import { FAQList } from "@/components/faq";
import { ParallaxMedia } from "@/components/parallax-media";
import { Reveal } from "@/components/reveal";
import { faq, featured, occasions, portfolioItems } from "@/lib/data";

const heroImage = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2400&q=92";
const values = [
  ["Customized Event Experiences", "Every touchpoint can be shaped around your event, audience and visual identity."],
  ["Premium Event Technology", "Contemporary capture formats selected for both visual impact and guest experience."],
  ["Professional Event Execution", "A considered approach to planning, setup and the live event environment."],
  ["Corporate Branding Opportunities", "Thoughtful ways to make your brand present without overpowering the moment."],
  ["On-Site Setup & Support", "Execution requirements are planned with the venue and event team before show day."],
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <ParallaxMedia src={heroImage} alt="Demonstration image of a cinematic event environment with blue lighting" priority />
        <div className="hero-overlay" />
        <div className="hero-gridlines" />
        <div className="hero-content">
          <div className="hero-kicker"><span /> Dubai · United Arab Emirates</div>
          <h1><span>Premium photo booths</span><span>& interactive event</span><span className="outline-text">experiences.</span></h1>
          <div className="hero-bottom">
            <p>We create memorable, branded and customized event moments through premium capture technology and interactive entertainment.</p>
            <div className="hero-actions">
              <Link className="button button-light" href="/experiences">Explore experiences <ArrowUpRight /></Link>
              <Link className="button button-ghost" href="/contact">Get a quote</Link>
              <Link className="round-link" href="/contact" aria-label="WhatsApp enquiry"><MessageCircle /> <span>WhatsApp<br/>via enquiry</span></Link>
            </div>
          </div>
        </div>
        <div className="hero-side-note">Experience engineering / 2026</div>
        <a className="scroll-cue" href="#featured"><ArrowDown /> Scroll to explore</a>
        <span className="demo-disclosure">Concept media · to be replaced with ECHO event footage</span>
      </section>

      <section id="featured" className="section dark-section">
        <Reveal className="section-heading split-heading">
          <div><span className="eyebrow">01 / Signature experiences</span><h2>Designed to stop<br/>the room.</h2></div>
          <p>More than a camera. Each format is a visual centerpiece, a guest interaction and a shareable piece of your event story.</p>
        </Reveal>
        <div className="featured-grid">
          {featured.map((item, index) => <Reveal key={item.slug} delay={(index % 2) * .08}><ExperienceCard item={item} index={index} large={index < 2} /></Reveal>)}
        </div>
        <div className="section-end-link"><Link href="/experiences">View all 14 experiences <ArrowRight /></Link></div>
      </section>

      <div className="ticker" aria-hidden="true"><div>PHOTO &nbsp;·&nbsp; MOTION &nbsp;·&nbsp; AI &nbsp;·&nbsp; INTERACTION &nbsp;·&nbsp; BRAND EXPERIENCE &nbsp;·&nbsp; PHOTO &nbsp;·&nbsp; MOTION &nbsp;·&nbsp; AI &nbsp;·&nbsp; INTERACTION</div></div>

      <section className="section light-section" id="all-experiences">
        <Reveal className="section-heading">
          <span className="eyebrow dark">02 / The full collection</span>
          <h2>Choose your<br/><em>kind of moment.</em></h2>
        </Reveal>
        <ExperienceFilter />
      </section>

      <section className="occasion-section">
        <div className="occasion-intro">
          <span className="eyebrow">03 / Built for the occasion</span>
          <h2>One technology partner.<br/>Every kind of room.</h2>
        </div>
        <div className="occasion-list">
          {occasions.map(([title, description, image], index) => (
            <Reveal className="occasion-row" key={title}>
              <span>0{index + 1}</span><h3>{title}</h3><p>{description}</p>
              <div className="occasion-thumb"><Image src={image} alt={`Demonstration visual for ${title}`} fill sizes="240px" /></div>
              <ArrowUpRight />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section portfolio-preview">
        <Reveal className="section-heading split-heading">
          <div><span className="eyebrow">04 / Portfolio direction</span><h2>Moments with<br/><em>presence.</em></h2></div>
          <div><p>Real ECHO project media has not yet been supplied. These concept frames demonstrate the intended premium portfolio art direction.</p><Link href="/portfolio" className="text-link">Explore portfolio <ArrowUpRight /></Link></div>
        </Reveal>
        <div className="preview-collage">
          {portfolioItems.slice(0, 3).map((item, index) => (
            <div className={`preview-shot shot-${index + 1}`} key={item.title}>
              <Image src={item.image} alt={`Demonstration visual: ${item.title}`} fill sizes="50vw" />
              <span>Demo concept / {item.category}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div className="why-sticky">
          <span className="eyebrow dark">05 / Why ECHO</span>
          <h2>Technology is only<br/>the beginning.</h2>
          <p>We focus on how the experience looks, feels and lives within the wider event.</p>
          <Link href="/about" className="text-link">Our approach <ArrowUpRight /></Link>
        </div>
        <div className="value-list">
          {values.map(([title, body], index) => <Reveal className="value-item" key={title}><span>0{index + 1}</span><CircleCheck/><h3>{title}</h3><p>{body}</p></Reveal>)}
        </div>
      </section>

      <section className="section process-section">
        <Reveal className="section-heading"><span className="eyebrow">06 / A considered process</span><h2>From brief to<br/>show time.</h2></Reveal>
        <div className="process-line">
          {[
            ["Share", "Share your event requirements", "Tell us the setting, audience, date and ambition."],
            ["Shape", "Choose & customize the experience", "Select the format, then tailor its visual language."],
            ["Deliver", "Event setup & execution", "Align on venue access, setup and operating needs."],
            ["Remember", "Create memorable experiences", "Give guests a moment worth keeping and sharing."],
          ].map(([label, title, body], i) => <Reveal className="process-step" delay={i * .08} key={label}><div className="step-dot"/><span>0{i + 1} / {label}</span><h3>{title}</h3><p>{body}</p></Reveal>)}
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-copy">
          <span className="eyebrow dark">07 / Client trust</span>
          <h2>Built to represent<br/>your brand well.</h2>
          <p>Verified client names, logos and testimonials have not yet been supplied for this demo. This area is intentionally reserved for approved proof only.</p>
        </div>
        <div className="logo-placeholder-grid" aria-label="Reserved client logo area">
          {[1,2,3,4,5,6].map((x) => <div key={x}><span>Approved logo</span><small>Pending</small></div>)}
        </div>
      </section>

      <section className="section faq-section">
        <div className="faq-title"><span className="eyebrow">08 / Questions, answered</span><h2>Before we<br/>begin.</h2><p>Have something specific in mind? Share the details and we’ll shape the right starting point.</p><Link href="/contact" className="text-link light">Ask a question <ArrowUpRight /></Link></div>
        <FAQList items={faq} />
      </section>

      <section className="final-cta">
        <div className="cta-orb" />
        <span className="eyebrow">Your next event / amplified</span>
        <h2>Let’s create an experience<br/><em>worth remembering.</em></h2>
        <div><Link className="button button-light" href="/contact">Request a quote <ArrowUpRight /></Link><Link className="button button-ghost" href="/contact">Contact us</Link></div>
      </section>
    </>
  );
}
