import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./motion.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Preloader } from "@/components/preloader";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Cursor } from "@/components/cursor";
import { Interactions } from "@/components/interactions";
import { ScrollProgress } from "@/components/scroll-progress";

export const metadata: Metadata = {
  metadataBase: new URL("https://echotechevents.example"),
  title: { default: "ECHO TECH EVENTS | Premium Event Technology Dubai", template: "%s | ECHO TECH EVENTS" },
  description: "Premium photo booths, interactive event technology and customized event experiences in Dubai and across the UAE.",
  openGraph: { title: "ECHO TECH EVENTS", description: "Premium event technology and experiential entertainment in Dubai.", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#05070a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Preloader />
        <SmoothScroll />
        <Interactions />
        <Cursor />
        <ScrollProgress />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
