import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = { title: "Request a Quote", description: "Tell ECHO TECH EVENTS about your upcoming event in Dubai or the UAE." };

export default function ContactPage() {
  return (
    <main className="cq-page">
      <QuoteForm />
    </main>
  );
}
