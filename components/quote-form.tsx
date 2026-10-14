"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { experiences } from "@/lib/data";

export function QuoteForm() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent) { event.preventDefault(); setSent(true); }
  if (sent) return <div className="form-success"><span><Check /></span><p className="eyebrow">Demo complete</p><h2>Your brief is ready.</h2><p>This demonstration does not transmit or store enquiries. Connect a secure backend before launch.</p><button className="text-link" onClick={() => setSent(false)}>Create another brief ↗</button></div>;
  return (
    <form className="quote-form" onSubmit={submit}>
      <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required placeholder="Full name" /></div>
      <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" placeholder="Company / organization" /></div>
      <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="name@company.com" /></div>
      <div className="field"><label htmlFor="phone">WhatsApp number</label><input id="phone" name="phone" type="tel" placeholder="+971" /></div>
      <div className="field"><label htmlFor="date">Event date</label><input id="date" name="date" type="date" /></div>
      <div className="field"><label htmlFor="location">Event location</label><input id="location" name="location" placeholder="Dubai, UAE" /></div>
      <div className="field"><label htmlFor="type">Event type</label><select id="type" name="type" defaultValue=""><option value="" disabled>Select event type</option><option>Corporate event</option><option>Brand activation</option><option>Exhibition / conference</option><option>Hospitality event</option><option>Wedding / private event</option><option>Other</option></select></div>
      <div className="field"><label htmlFor="experience">Required experience</label><select id="experience" name="experience" defaultValue=""><option value="" disabled>Select an experience</option>{experiences.map((x) => <option key={x.slug}>{x.title}</option>)}</select></div>
      <div className="field field-full"><label htmlFor="requirements">Additional requirements</label><textarea id="requirements" name="requirements" rows={5} placeholder="Tell us about the guest experience, branding, operating hours or anything else you have in mind." /></div>
      <div className="form-note field-full"><p>Demo form — no information is sent or stored.</p><button className="button" type="submit">Prepare enquiry <ArrowUpRight /></button></div>
    </form>
  );
}
