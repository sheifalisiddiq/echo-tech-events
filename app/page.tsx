import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FAQList } from "@/components/faq";
import { ParallaxImage } from "@/components/parallax-image";
import { Reveal } from "@/components/reveal";
import { Hero } from "@/components/home/hero";
import { ClientsMarquee } from "@/components/home/clients-marquee";
import { OccasionOrbit } from "@/components/home/occasion-orbit";
import { PortfolioPreview } from "@/components/home/portfolio-preview";
import { ProcessJourney } from "@/components/home/process-journey";
import { ReviewsSection } from "@/components/home/reviews-flow";
import { SignatureRail } from "@/components/home/signature-rail";
import { WhyStack } from "@/components/home/why-stack";
import { experiences, faq, featured, occasions, reviews } from "@/lib/data";

const heroImages = [
  { desktop: "/hero-home-v2/brand-desktop.png", mobile: "/hero-home-v2/brand-mobile.png" },
  { desktop: "/hero-home-v2/technology-desktop.png", mobile: "/hero-home-v2/technology-mobile.png" },
  { desktop: "/hero-home-v2/delivery-desktop.png", mobile: "/hero-home-v2/delivery-mobile.png" },
  { desktop: "/hero-home-v2/visibility-desktop.png", mobile: "/hero-home-v2/visibility-mobile.png" },
  { desktop: "/hero-home-v2/support-desktop.png", mobile: "/hero-home-v2/support-mobile.png" },
] as const;
const values = [
  ["Made around your brand", "Colors, graphics and screens designed to match your event and identity."],
  ["Premium tech, great results", "Modern photo, video and AI formats that look sharp and get guests talking."],
  ["Smooth, professional delivery", "We plan, set up and run everything so show day goes without a hitch."],
  ["Your brand front and center", "Logos and messaging built into every photo and screen, without stealing the moment."],
  ["On-site team, start to finish", "We coordinate with your venue ahead of time and stay on hand throughout the event."],
] as const;

const steps = [
  ["Share", "Tell us about your event", "Share the date, venue, guest count, and the kind of booth you have in mind."],
  ["Shape", "Make the booth yours", "Choose your setup, then tailor the backdrop, screen, photo layout, and sharing experience."],
  ["Deliver", "We set it up and run it", "Our team coordinates with the venue, installs the booth, and helps guests throughout the event."],
  ["Remember", "Guests take the moment home", "They leave with photos or videos ready to print, share, and remember."],
] as const;

export default function HomePage() {
  return (
    <>
      <Hero images={heroImages} />

      <ClientsMarquee />

      <SignatureRail items={featured} total={experiences.length} />

      <PortfolioPreview />

      <div className="ticker" aria-hidden="true"><div>{[0, 1].map((half) => <span key={half}>{Array.from({ length: 4 }, () => "PHOTO · MOTION · AI · INTERACTION · BRAND EXPERIENCE · ").join("")}</span>)}</div></div>


      <OccasionOrbit items={occasions} />

      <section className="why2" data-chapter="Experience">
        <div className="why2-head">
          <div>
            <span className="chapter-tag">04 / Why ECHO</span>
            <h2>Why brands<br />choose <em>ECHO.</em></h2>
          </div>
          <div className="why2-intro">
            <p>One team for the technology, the design and the day itself. Your guests get a moment worth sharing, and you get a stress-free event.</p>
            <Link href="/about" className="text-link light">Our approach <ArrowUpRight /></Link>
          </div>
        </div>
        <WhyStack values={values} />
      </section>

      <ProcessJourney steps={steps} image="/hero-home-v2/delivery-desktop.png" />

      <ReviewsSection reviews={reviews} />

      <section className="section faq-section" data-chapter="Echo">
        <div className="faq-title"><span className="chapter-tag">07 / Questions, answered</span><h2>Before we<br />begin.</h2><p>Have something specific in mind? Share the details and we’ll shape the right starting point.</p><Link href="/contact" className="text-link light">Ask a question <ArrowUpRight /></Link></div>
        <FAQList items={faq} />
      </section>

      <section className="final-cta" data-chapter="Echo">
        <div className="cta-bg"><ParallaxImage src={heroImages[0].desktop} alt="" speed={10} /></div>
        <div className="cta-orb" />
        <div className="cta-rings" aria-hidden="true"><i /><i /><i /><i /></div>
        <Reveal><span className="eyebrow">Your next event / amplified</span></Reveal>
        <Reveal delay={0.08}><h2>Let’s create an experience<br /><em>worth remembering.</em></h2></Reveal>
        <Reveal delay={0.16} className="final-cta-actions"><Link className="button button-light" href="/contact">Request a quote <ArrowUpRight /></Link><Link className="button button-ghost" href="/contact">Contact us</Link></Reveal>
      </section>
    </>
  );
}
