import Image from "next/image";
import { ParallaxImage } from "@/components/parallax-image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PortfolioFilter } from "@/components/portfolio-filter";
import { ClientWork } from "@/components/client-work";
import { VideoGallery } from "@/components/video-gallery";
import { magicMirror, portfolioPreview, PREVIEW_IMAGES, PREVIEW_VIDEOS, scribbleBooth, workBySlug } from "@/lib/client-work";

export const metadata: Metadata = { title: "Portfolio", description: "Explore the visual direction for ECHO TECH EVENTS projects across corporate, brand, government and private events." };

const boothLinks = Object.entries(workBySlug).map(([slug, work]) => ({ slug, work }));

export default function PortfolioPage() {
  return (
    <>
      <section className="page-hero portfolio-page-hero">
        <div className="hero-photo" aria-hidden="true"><ParallaxImage src="/hero-booth-portfolio.png" alt="" speed={14} /></div>
        <div><span className="eyebrow">Selected work / Demo direction</span><h1>Experiences,<br/><em>in their element.</em></h1></div>
        <p>Real footage from delivered events, alongside clearly marked concept imagery until more approved ECHO project photography and films are supplied.</p>
        <span className="page-number">P / 06</span>
      </section>
      <section className="browse-booths" aria-label="Browse by experience">
        <span className="chapter-tag">Browse by experience</span>
        <div className="browse-booths-grid">
          {boothLinks.map(({ slug, work }) => (
            <Link key={slug} href={`/experiences/${slug}`} className="booth-card" data-cursor="view">
              <Image src={work.videos[0].poster} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
              <div className="card-shade" />
              <div className="booth-card-body">
                <span>{work.category} experience · {work.videos.length} videos</span>
                <h3>{work.title}</h3>
              </div>
              <div className="card-arrow"><ArrowUpRight /></div>
            </Link>
          ))}
        </div>
      </section>
      <ClientWork work={portfolioPreview(scribbleBooth)} />
      <ClientWork work={portfolioPreview(magicMirror)} />
      <section className="portfolio-more" aria-label="More footage">
        <span className="chapter-tag">More footage</span>
        {[scribbleBooth, magicMirror].map((work) => {
          const videos = work.videos.slice(PREVIEW_VIDEOS);
          const images = work.images.slice(PREVIEW_IMAGES);
          if (!videos.length && !images.length) return null;
          return (
            <div className="portfolio-more-group" key={work.title}>
              <h3>{work.title}</h3>
              {videos.length > 0 && <VideoGallery videos={videos} />}
              {images.length > 0 && (
                <div className={images.length < 4 ? "client-shots is-few" : "client-shots"} style={{ "--n": images.length } as React.CSSProperties}>
                  {images.map((img) => (
                    <figure className="client-tile" key={img.src}>
                      <Image src={img.src} alt={img.title} width={img.width} height={img.height} sizes="(max-width: 760px) 50vw, 20vw" />
                    </figure>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
      <section className="section light-section portfolio-page"><PortfolioFilter/></section>
      <section className="portfolio-disclosure"><span>Transparency note</span><p>Scribble Booth and Magic Mirror media is from delivered client events. Items tagged “Demo concept” are placeholder imagery. No client names, results or testimonials have been invented.</p></section>
      <section className="mini-cta"><p>Picture your event here.</p><h2>Let’s create the<br/>next standout frame.</h2><Link href="/contact" className="button button-light">Start an enquiry <ArrowUpRight /></Link></section>
    </>
  );
}
