import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, MessageCircle } from "lucide-react";

const TikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
);

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/echotechevent?rpxt=MTM0eHVmMjZteGcx&utm_source=qr", icon: <Instagram /> },
  { label: "TikTok", href: "https://www.tiktok.com/@echo.tech.events?_r=1&_t=ZS-9BLHm3TmpWP", icon: <TikTok /> },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61574805213714", icon: <Facebook /> },
  { label: "WhatsApp", href: "https://wa.me/971503482477", icon: <MessageCircle /> },
];

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" className="footer-lockup" aria-label="ECHO TECH EVENTS home">
            <span className="footer-crown" aria-hidden="true" />
            <span className="footer-word"><strong>ECHO</strong><small>Tech Events</small></span>
          </Link>
          <p>Premium event technology and experiential entertainment, based in Dubai.</p>
          <Link href="/contact" className="button footer-cta">Request a quote <ArrowUpRight /></Link>
          <div className="footer-social">
            {socials.map((x) => (
              <a key={x.label} href={x.href} target="_blank" rel="noopener noreferrer" aria-label={x.label} title={x.label}>{x.icon}</a>
            ))}
          </div>
        </div>
        <div className="footer-links">
          <div><span>Explore</span><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/portfolio">Portfolio</Link></div>
          <div><span>Connect</span><Link href="/contact">Request a quote</Link><Link href="/contact">Contact us</Link></div>
          <div><span>Location</span><p className="footer-pending">Dubai, United Arab Emirates</p></div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ECHO TECH EVENTS</span>
        <span>Dubai · United Arab Emirates</span>
        <Link href="/contact">Plan an experience <ArrowUpRight size={15}/></Link>
      </div>
    </footer>
  );
}
