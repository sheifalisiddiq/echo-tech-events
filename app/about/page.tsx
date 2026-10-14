import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "About", description: "Meet ECHO TECH EVENTS, a Dubai-based event technology and experiential entertainment company." };

const capabilities = [
  ["Creative direction", "Shaping the guest journey and visual presentation around the event context."],
  ["Experience customization", "Adapting digital outputs, physical details and branded touchpoints."],
  ["Technical planning", "Considering venue, guest flow, operating requirements and event logistics."],
  ["Live execution", "Bringing the experience into the room with an event-ready approach."],
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero about-hero">
        <div><span className="eyebrow">About / ECHO TECH EVENTS</span><h1>We turn event<br/>technology into<br/><em>human moments.</em></h1></div>
        <p>Based in Dubai, ECHO TECH EVENTS creates premium photo, video, AI and interactive experiences for ambitious events across the UAE.</p>
        <span className="page-number">A / 01</span>
      </section>
      <section className="about-statement">
        <Reveal><p className="big-statement">Technology should never feel like equipment placed in a room. It should feel like it was <em>always part of the idea.</em></p></Reveal>
        <div className="statement-aside"><span className="eyebrow dark">Our point of view</span><p>We bring together strong visual presentation, guest interaction and event-minded execution. The result is an experience that feels considered from first glance to final share.</p></div>
      </section>
      <section className="about-image-band">
        <Image src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2200&q=90" alt="Demonstration image of an elevated event environment" fill sizes="100vw" />
        <span className="demo-tag">Demo media / art direction reference</span>
        <div><span>Dubai based</span><span>UAE focused</span><span>Experience led</span></div>
      </section>
      <section className="section capability-section">
        <div className="section-heading split-heading"><div><span className="eyebrow">What we bring</span><h2>More than<br/>the machine.</h2></div><p>Every engagement is viewed as part creative challenge, part technical production and part live guest experience.</p></div>
        <div className="capability-grid">{capabilities.map(([title, body], i) => <Reveal className="capability-card" delay={i * .06} key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{body}</p></Reveal>)}</div>
      </section>
      <section className="brand-position">
        <div className="brand-position-copy"><span className="eyebrow dark">Built for the room</span><h2>Corporate clarity.<br/>Creative energy.<br/><em>Luxury restraint.</em></h2><p>From board-level gatherings to public-facing activations, the visual language can flex while the standard of presentation stays consistent.</p></div>
        <div className="brand-position-visual">
          <Image src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=90" alt="Demonstration visual of event lighting" fill sizes="50vw" />
          <span>Concept image</span>
        </div>
      </section>
      <section className="mini-cta"><p>Have an event in mind?</p><h2>Let’s shape the<br/>experience together.</h2><Link href="/contact" className="button button-light">Start a conversation <ArrowUpRight /></Link></section>
    </>
  );
}
