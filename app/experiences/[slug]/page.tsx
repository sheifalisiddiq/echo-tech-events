import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { VideoGallery } from "@/components/video-gallery";
import { workBySlug } from "@/lib/client-work";
import { experiences } from "@/lib/data";

type PageProps = { params: Promise<{ slug: string }> };

// Only experiences with real footage get a page. Add footage in lib/client-work.ts to add one.
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(workBySlug).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = workBySlug[slug];
  const item = experiences.find((x) => x.slug === slug);
  return work && item ? { title: `${item.title} videos`, description: work.description } : {};
}

export default async function BoothPage({ params }: PageProps) {
  const { slug } = await params;
  const work = workBySlug[slug];
  const item = experiences.find((x) => x.slug === slug);
  if (!work || !item) notFound();

  const others = Object.entries(workBySlug).filter(([key]) => key !== slug);

  return (
    <>
      <section className="booth-hero" data-chapter="Selected work">
        <Link href="/portfolio" className="booth-back"><ArrowLeft /> Portfolio</Link>
        <span className="eyebrow">{work.category} experience / Dubai UAE</span>
        <h1>{item.title}</h1>
        <p>{work.description}</p>
        <div className="booth-meta">
          <span>{work.videos.length} videos</span>
          {work.images.length > 0 && <span>{work.images.length} {work.images.length === 1 ? "photo" : "photos"}</span>}
        </div>
        <Link href="/contact" className="button button-light">Request a quote <ArrowUpRight /></Link>
      </section>

      <section className="booth-videos" aria-label={`${item.title} videos`}>
        <VideoGallery videos={work.videos} />
      </section>

      {work.images.length > 0 && (
        <section className="client-shots-wrap booth-shots">
          <span className="chapter-tag">{work.imagesLabel ?? "Guest-facing screens"}</span>
          <div className={work.images.length < 4 ? "client-shots is-few" : "client-shots"} style={{ "--n": work.images.length } as React.CSSProperties}>
            {work.images.map((img) => (
              <figure className="client-tile" key={img.src}>
                <Image src={img.src} alt={img.title} width={img.width} height={img.height} sizes="(max-width: 760px) 50vw, 20vw" />
              </figure>
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="booth-more">
          <span className="chapter-tag">More footage</span>
          <div>
            {others.map(([key, other]) => (
              <Link key={key} href={`/experiences/${key}`} className="text-link light">
                {other.title} · {other.videos.length} videos <ArrowUpRight />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mini-cta">
        <p>Bring {item.shortTitle} to your next event.</p>
        <h2>Let’s make the<br />moment yours.</h2>
        <Link href="/contact" className="button button-light">Request a quote <ArrowUpRight /></Link>
      </section>
    </>
  );
}
