import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Experience } from "@/lib/data";

export function ExperienceCard({ item, index = 0, large = false }: { item: Experience; index?: number; large?: boolean }) {
  return (
    <Link href={`/experiences/${item.slug}`} className={`experience-card ${large ? "large" : ""}`}>
      <Image src={item.image} alt={`Demonstration visual for ${item.title}`} fill sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"} />
      <div className="card-shade" />
      <div className="card-index">0{index + 1}</div>
      <div className="demo-tag">Demo media</div>
      <div className="card-content">
        <span>{item.category} experience</span>
        <h3>{item.shortTitle}</h3>
        <p>{item.description}</p>
      </div>
      <div className="card-arrow"><ArrowUpRight /></div>
    </Link>
  );
}
