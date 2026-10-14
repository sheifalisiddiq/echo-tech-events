import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PortfolioFilter } from "@/components/portfolio-filter";

export const metadata: Metadata = { title: "Portfolio", description: "Explore the visual direction for ECHO TECH EVENTS projects across corporate, brand, government and private events." };

export default function PortfolioPage() {
  return (
    <>
      <section className="page-hero portfolio-page-hero">
        <div><span className="eyebrow">Selected work / Demo direction</span><h1>Experiences,<br/><em>in their element.</em></h1></div>
        <p>This portfolio uses clearly marked concept imagery to demonstrate the intended presentation until approved ECHO project photography and films are supplied.</p>
        <span className="page-number">P / 06</span>
      </section>
      <section className="section light-section portfolio-page"><PortfolioFilter/></section>
      <section className="portfolio-disclosure"><span>Transparency note</span><p>No client names, event claims, results or testimonials have been invented in this demonstration.</p></section>
      <section className="mini-cta"><p>Picture your event here.</p><h2>Let’s create the<br/>next standout frame.</h2><Link href="/contact" className="button button-light">Start an enquiry <ArrowUpRight /></Link></section>
    </>
  );
}
