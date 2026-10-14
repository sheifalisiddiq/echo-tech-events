import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { ExperienceCard } from "@/components/experience-card";
import { FAQList } from "@/components/faq";
import { experiences } from "@/lib/data";

type PageProps = { params: Promise<{ slug: string }> };

const detail: Record<string, { intro: string; features: string[]; custom: string[]; suitable: string[] }> = {
  "glambot-experience": {
    intro: "A robotic camera movement turns a few seconds in front of the lens into a cinematic slow-motion sequence. Designed for entrances, red carpets and high-energy brand moments.",
    features: ["Robotic high-speed camera movement", "Cinematic slow-motion output", "Event-branded visual treatment", "Guest-ready sharing workflow"],
    custom: ["Branded intros and outros", "Music and motion styling", "Physical set direction", "Guest-facing screen graphics"],
    suitable: ["Corporate galas", "Luxury launches", "Red carpet arrivals", "Brand activations"],
  },
  "360-video-booth": {
    intro: "Guests step onto a platform while the camera moves around them, creating energetic video clips with branded effects built for immediate social impact.",
    features: ["Dynamic 360-degree capture", "Slow-motion and speed effects", "Branded overlays and audio", "Shareable vertical video"],
    custom: ["Platform styling", "Overlay animation", "Music selection", "Backdrop and lighting direction"],
    suitable: ["Exhibitions", "Product launches", "Mall activations", "Private celebrations"],
  },
  "ai-photo-booth": {
    intro: "A portrait becomes the starting point for imaginative transformation. AI-generated visual worlds can be directed around a campaign, theme or creative concept.",
    features: ["AI-powered portrait transformation", "Curated visual directions", "Digital delivery or print options", "Brand-aware output design"],
    custom: ["Custom visual themes", "Campaign art direction", "Branded layouts", "Guest prompt experience"],
    suitable: ["Brand activations", "Technology events", "Conferences", "Corporate celebrations"],
  },
};

export function generateStaticParams() { return experiences.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = experiences.find((x) => x.slug === slug);
  return item ? { title: item.title, description: item.description } : {};
}

export default async function ExperienceDetail({ params }: PageProps) {
  const { slug } = await params;
  const item = experiences.find((x) => x.slug === slug);
  if (!item) notFound();
  const content = detail[slug] ?? {
    intro: item.description + " The experience can be shaped to sit naturally within the look, audience and rhythm of your event.",
    features: ["Premium capture setup", "Event-ready guest flow", "Digital output options", "Brand customization possibilities"],
    custom: ["Visual overlays", "Screen graphics", "Print or digital layouts", "Physical presentation"],
    suitable: ["Corporate events", "Brand activations", "Exhibitions", "Private events"],
  };
  const related = experiences.filter((x) => x.slug !== slug && (x.category === item.category || x.featured)).slice(0, 3);
  const serviceFaq = [
    ["Can this experience be branded?", "Yes. Available branding depends on the chosen configuration and may include overlays, screens, outputs, backdrops or physical presentation."],
    ["How much space is required?", "Space, power and access requirements vary by setup. ECHO will confirm the technical footprint after reviewing the venue and event plan."],
    ["Can guests receive their content?", "Digital sharing or physical print options may be available depending on the experience and agreed event setup."],
  ] as const;
  return (
    <>
      <section className="service-hero">
        <Image src={item.image} alt={`Demonstration visual for ${item.title}`} fill priority sizes="100vw" />
        <div className="service-hero-overlay" />
        <div className="service-hero-content"><span className="eyebrow">{item.category} experience / Dubai UAE</span><h1>{item.title}</h1><p>{content.intro}</p><Link href="/contact" className="button button-light">Request a quote <ArrowUpRight /></Link></div>
        <span className="demo-disclosure">Demonstration media · not an ECHO project</span>
        <a href="#overview" className="scroll-cue"><ArrowDown/> Discover the experience</a>
      </section>
      <section id="overview" className="service-overview">
        <div><span className="eyebrow dark">The experience</span><h2>A camera moment,<br/><em>elevated.</em></h2></div>
        <p>{content.intro}</p>
      </section>
      <section className="service-feature-band">
        <div className="service-feature-image"><Image src={item.image} alt={`Concept detail for ${item.title}`} fill sizes="55vw" /><span>Concept visual</span></div>
        <div className="feature-checklist"><span className="eyebrow">Key features</span><h2>Made to look as good<br/>as it feels.</h2>{content.features.map((x) => <div key={x}><Check/><span>{x}</span></div>)}</div>
      </section>
      <section className="customization-section">
        <div><span className="eyebrow dark">Customization</span><h2>Make it<br/><em>unmistakably yours.</em></h2><p>Customization possibilities are scoped for the selected setup, venue and event goals.</p></div>
        <div className="custom-list">{content.custom.map((x, i) => <div key={x}><span>0{i + 1}</span><h3>{x}</h3></div>)}</div>
      </section>
      <section className="suitable-section"><span className="eyebrow">Ideal settings</span><h2>Where it comes alive.</h2><div>{content.suitable.map((x, i) => <span key={x}>0{i + 1} / {x}</span>)}</div></section>
      <section className="service-faq"><div><span className="eyebrow dark">Practical questions</span><h2>Good to<br/>know.</h2></div><FAQList items={serviceFaq}/></section>
      <section className="section related-section"><div className="section-heading"><span className="eyebrow">Keep exploring</span><h2>Related experiences.</h2></div><div className="directory-grid">{related.map((x, i) => <ExperienceCard key={x.slug} item={x} index={i}/>)}</div></section>
      <section className="mini-cta"><p>Bring {item.shortTitle} to your next event.</p><h2>Let’s make the<br/>moment yours.</h2><Link href="/contact" className="button button-light">Request a quote <ArrowUpRight /></Link></section>
    </>
  );
}
