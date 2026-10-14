import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Image className="footer-logo" src="/echo-logo.png" alt="ECHO TECH EVENTS" width={1563} height={1563} />
          <p>Premium event technology and experiential entertainment, based in Dubai.</p>
        </div>
        <div className="footer-links">
          <div><span>Explore</span><Link href="/about">About</Link><Link href="/experiences">Experiences</Link><Link href="/portfolio">Portfolio</Link></div>
          <div><span>Connect</span><Link href="/contact">Request a quote</Link><Link href="/contact">Contact</Link></div>
          <div><span>Social</span><p className="footer-pending">Verified profiles pending</p></div>
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
