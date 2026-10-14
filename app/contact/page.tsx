import type { Metadata } from "next";
import { Clock3, MapPin } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = { title: "Request a Quote", description: "Tell ECHO TECH EVENTS about your upcoming event in Dubai or the UAE." };

export default function ContactPage() {
  return (
    <>
      <section className="contact-hero">
        <div><span className="eyebrow">Start an enquiry</span><h1>Tell us about<br/>the moment<br/><em>you’re planning.</em></h1></div>
        <div className="contact-intro"><p>Share the essentials below. This demo will prepare your enquiry on screen without transmitting or storing any information.</p><div><span><MapPin/> Based in Dubai, UAE</span><span><Clock3/> Availability confirmed by quotation</span></div></div>
      </section>
      <section className="form-section">
        <div className="form-side"><span>01</span><h2>Your event brief</h2><p>The more context you share, the easier it is to shape the right starting point.</p></div>
        <QuoteForm />
      </section>
      <section className="contact-note"><span>Prefer a direct conversation?</span><p>Verified phone, WhatsApp and email details have not yet been supplied. Add approved contact details before launch.</p></section>
    </>
  );
}
