"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Experiences", "/experiences"],
  ["Portfolio", "/portfolio"],
  ["Contact", "/contact"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="ECHO TECH EVENTS home">
        <Image src="/echo-logo.png" alt="ECHO TECH EVENTS" width={1563} height={1563} priority />
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}>{label}</Link>
        ))}
      </nav>
      <Link href="/contact" className="button button-small header-quote">Get a quote <span>↗</span></Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
        {open ? <X /> : <Menu />}
      </button>
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <span className="eyebrow">Navigate / ECHO</span>
        {links.map(([label, href], i) => (
          <Link key={href} href={href}><small>0{i + 1}</small>{label}</Link>
        ))}
        <Link href="/contact" className="button">Start a project</Link>
      </div>
    </header>
  );
}
