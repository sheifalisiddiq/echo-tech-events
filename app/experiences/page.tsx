import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ExperienceFilter } from "@/components/experience-filter";

export const metadata: Metadata = { title: "All Experiences", description: "Explore premium photo booth, video, AI and interactive event experiences in Dubai and the UAE." };

export default function ExperiencesPage() {
  return (
    <>
      <section className="page-hero directory-hero">
        <div><span className="eyebrow">The experience directory</span><h1>Fourteen ways to<br/><em>move the room.</em></h1></div>
        <p>Explore premium capture technology, social-first video, AI transformations and immersive guest interactions — each ready to become unmistakably yours.</p>
        <span className="page-number">E / 14</span>
      </section>
      <section className="section light-section directory-page">
        <div className="directory-note"><span>Browse by format</span><p>All visuals are demonstrative placeholders until approved ECHO project media is supplied.</p></div>
        <ExperienceFilter />
      </section>
      <section className="directory-cta"><span className="eyebrow">Not sure what fits?</span><h2>Tell us about the event.<br/>We’ll help shape the moment.</h2><Link href="/contact" className="button button-light">Discuss your event <ArrowUpRight /></Link></section>
    </>
  );
}
