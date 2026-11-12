import { ParallaxImage } from "@/components/parallax-image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PortfolioFilter } from "@/components/portfolio-filter";
import { ClientWork } from "@/components/client-work";

export const metadata: Metadata = { title: "Portfolio", description: "Explore the visual direction for ECHO TECH EVENTS projects across corporate, brand, government and private events." };

export default function PortfolioPage() {
  return (
    <>
      <section className="page-hero portfolio-page-hero">
        <div className="hero-photo" aria-hidden="true"><ParallaxImage src="https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&w=2000&q=80" alt="" speed={14} /></div>
        <div><span className="eyebrow">Selected work / Demo direction</span><h1>Experiences,<br/><em>in their element.</em></h1></div>
        <p>Real footage from delivered events, alongside clearly marked concept imagery until more approved ECHO project photography and films are supplied.</p>
        <span className="page-number">P / 06</span>
      </section>
      <ClientWork />
      <section className="section light-section portfolio-page"><PortfolioFilter/></section>
      <section className="portfolio-disclosure"><span>Transparency note</span><p>Scribble Booth media is from a delivered client event. Items tagged “Demo concept” are placeholder imagery. No client names, results or testimonials have been invented.</p></section>
      <section className="mini-cta"><p>Picture your event here.</p><h2>Let’s create the<br/>next standout frame.</h2><Link href="/contact" className="button button-light">Start an enquiry <ArrowUpRight /></Link></section>
    </>
  );
}
