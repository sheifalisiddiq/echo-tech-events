import Image from "next/image";
import { ParallaxImage } from "@/components/parallax-image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
        <p>Real footage from delivered ECHO events. More approved project photography and films will be added as they are supplied.</p>
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
        <header className="portfolio-more-head">
          <span className="chapter-tag">The full reel</span>
          <h2>More <em>footage</em></h2>
          <p>Every extra clip and frame from the booths above. Tap a clip to hear it.</p>
        </header>
        {[scribbleBooth, magicMirror].map((work, g) => {
          const videos = work.videos.slice(PREVIEW_VIDEOS);
          const images = work.images.slice(PREVIEW_IMAGES);
          if (!videos.length && !images.length) return null;
          const counts = [videos.length && `${videos.length} clip${videos.length > 1 ? "s" : ""}`, images.length && `${images.length} photo${images.length > 1 ? "s" : ""}`].filter(Boolean).join(" · ");
          return (
            <div className="portfolio-more-group" key={work.title}>
              <div className="portfolio-more-title">
                <span className="more-index">{String(g + 1).padStart(2, "0")}</span>
                <h3>{work.title}</h3>
                <span className="more-count">{counts}</span>
              </div>
              <div className={videos.length === 1 && images.length > 0 ? "more-body is-mix" : "more-body"}>
              {videos.length > 0 && <VideoGallery videos={videos} />}
              {images.length > 0 && (
                <div className="client-shots more-shots">
                  {images.map((img) => (
                    <figure className="client-tile" key={img.src}>
                      <Image src={img.src} alt={img.title} width={img.width} height={img.height} sizes="(max-width: 760px) 50vw, 20vw" />
                    </figure>
                  ))}
                </div>
              )}
              </div>
            </div>
          );
        })}
      </section>
      <section className="portfolio-disclosure"><span>Transparency note</span><p>Scribble Booth and Magic Mirror media is from delivered client events. No client names, results or testimonials have been invented.</p></section>
      <section className="mini-cta"><p>Picture your event here.</p><h2>Let’s create the<br/>next standout frame.</h2><Link href="/contact" className="button button-light">Start an enquiry <ArrowUpRight /></Link></section>
    </>
  );
}
