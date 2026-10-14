import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FAQList } from "@/components/faq";
import { ParallaxImage } from "@/components/parallax-image";
import { Reveal } from "@/components/reveal";
import { Hero } from "@/components/home/hero";
import { HelixGallery } from "@/components/home/helix-gallery";
import { OccasionOrbit } from "@/components/home/occasion-orbit";
import { PortfolioPreview } from "@/components/home/portfolio-preview";
import { ProcessJourney } from "@/components/home/process-journey";
import { ReviewsSection } from "@/components/home/reviews-flow";
import { SignatureRail } from "@/components/home/signature-rail";
import { WhyStack } from "@/components/home/why-stack";
import { experiences, faq, featured, occasions, portfolioItems, reviews } from "@/lib/data";

const heroImage = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2400&q=92";
const values = [
  ["Customized Event Experiences", "Every touchpoint can be shaped around your event, audience and visual identity."],
  ["Premium Event Technology", "Contemporary capture formats selected for both visual impact and guest experience."],
  ["Professional Event Execution", "A considered approach to planning, setup and the live event environment."],
  ["Corporate Branding Opportunities", "Thoughtful ways to make your brand present without overpowering the moment."],
  ["On-Site Setup & Support", "Execution requirements are planned with the venue and event team before show day."],
] as const;

const steps = [
  ["Share", "Share your event requirements", "Tell us the setting, audience, date and ambition."],
  ["Shape", "Choose & customize the experience", "Select the format, then tailor its visual language."],
  ["Deliver", "Event setup & execution", "Align on venue access, setup and operating needs."],
  ["Remember", "Create memorable experiences", "Give guests a moment worth keeping and sharing."],
] as const;

export default function HomePage() {
  return (
    <>
      <Hero image={heroImage} />

      <SignatureRail items={featured} total={experiences.length} />

      <div className="ticker" aria-hidden="true"><div>PHOTO &nbsp;·&nbsp; MOTION &nbsp;·&nbsp; AI &nbsp;·&nbsp; INTERACTION &nbsp;·&nbsp; BRAND EXPERIENCE &nbsp;·&nbsp; PHOTO &nbsp;·&nbsp; MOTION &nbsp;·&nbsp; AI &nbsp;·&nbsp; INTERACTION</div></div>

      <HelixGallery />

      <OccasionOrbit items={occasions} />

      <PortfolioPreview items={portfolioItems} />

      <section className="why-section" data-chapter="Experience">
        <div className="why-sticky">
          <span className="chapter-tag">05 / Why ECHO</span>
          <h2>Technology is only<br />the beginning.</h2>
          <p>We focus on how the experience looks, feels and lives within the wider event.</p>
          <Link href="/about" className="text-link">Our approach <ArrowUpRight /></Link>
        </div>
        <WhyStack values={values} />
      </section>

      <ProcessJourney steps={steps} image={portfolioItems[3].image} />

      <ReviewsSection reviews={reviews} />

      <section className="section faq-section" data-chapter="Echo">
        <div className="faq-title"><span className="chapter-tag">08 / Questions, answered</span><h2>Before we<br />begin.</h2><p>Have something specific in mind? Share the details and we’ll shape the right starting point.</p><Link href="/contact" className="text-link light">Ask a question <ArrowUpRight /></Link></div>
        <FAQList items={faq} />
      </section>

      <section className="final-cta" data-chapter="Echo">
        <div className="cta-bg"><ParallaxImage src={heroImage} alt="" speed={10} /></div>
        <div className="cta-orb" />
        <div className="cta-rings" aria-hidden="true"><i /><i /><i /><i /></div>
        <Reveal><span className="eyebrow">Your next event / amplified</span></Reveal>
        <Reveal delay={0.08}><h2>Let’s create an experience<br /><em>worth remembering.</em></h2></Reveal>
        <Reveal delay={0.16} className="final-cta-actions"><Link className="button button-light" href="/contact">Request a quote <ArrowUpRight /></Link><Link className="button button-ghost" href="/contact">Contact us</Link></Reveal>
      </section>
    </>
  );
}
