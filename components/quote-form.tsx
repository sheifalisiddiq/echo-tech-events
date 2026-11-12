"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { experiences } from "@/lib/data";

type Step = {
  key: string;
  q: string;
  hint?: string;
  kind: "text" | "tel" | "email" | "choice" | "multi" | "date" | "long";
  placeholder?: string;
  options?: string[];
  optional?: boolean;
};

const steps: Step[] = [
  { key: "name", q: "Hey! What's your name?", kind: "text", placeholder: "Your full name" },
  { key: "phone", q: "What number should we reach you on?", hint: "WhatsApp is perfect.", kind: "tel", placeholder: "+971 50 000 0000" },
  { key: "email", q: "And your email?", kind: "email", placeholder: "name@company.com" },
  { key: "eventType", q: "What kind of event is it?", kind: "choice", options: ["Corporate event", "Brand activation", "Exhibition / conference", "Hospitality", "Wedding / private", "Other"] },
  { key: "experiences", q: "What are you interested in?", hint: "Pick as many as you like.", kind: "multi", options: experiences.map((x) => x.title), optional: true },
  { key: "date", q: "When is it happening?", hint: "An approximate date is fine.", kind: "date", optional: true },
  { key: "location", q: "Where will it take place?", kind: "text", placeholder: "Venue or area, e.g. Dubai Marina", optional: true },
  { key: "notes", q: "Anything else we should know?", hint: "Guest count, branding ideas, timings...", kind: "long", placeholder: "Tell us a bit more...", optional: true },
];

type Answers = Record<string, string | string[]>;

function validate(s: Step, v: string | string[] | undefined): string {
  const str = typeof v === "string" ? v.trim() : "";
  if (s.key === "name" && !str) return "Please tell us your name.";
  if (s.key === "phone" && str.replace(/\D/g, "").length < 6) return "Please enter a valid phone number.";
  if (s.key === "email" && !/^\S+@\S+\.\S+$/.test(str)) return "Please enter a valid email address.";
  if (s.key === "eventType" && !str) return "Please choose one.";
  return "";
}

export function QuoteForm() {
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const total = steps.length;
  const done = status === "done";
  const percent = done ? 100 : Math.round((i / total) * 100);
  const step = steps[i];
  const isLast = i === total - 1;

  useEffect(() => {
    const t = setTimeout(() => field.current?.focus({ preventScroll: true }), 420);
    return () => clearTimeout(t);
  }, [i]);
  useEffect(() => () => clearTimeout(timer.current), []);

  function go(next: number, d: 1 | -1) {
    setDir(d);
    setLeaving(i);
    setI(next);
    setError("");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLeaving(null), 600);
  }

  async function submit(final: Answers) {
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(final) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Something went wrong.");
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  function next(override?: Answers) {
    if (status === "sending") return;
    const data = override ?? answers;
    const err = validate(step, data[step.key]);
    if (err) return setError(err);
    if (isLast) return void submit(data);
    go(i + 1, 1);
  }

  function pick(s: Step, opt: string) {
    if (s.kind === "choice") {
      const data = { ...answers, [s.key]: opt };
      setAnswers(data);
      setTimeout(() => next(data), 260);
    } else {
      const cur = (answers[s.key] as string[]) ?? [];
      setAnswers({ ...answers, [s.key]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt] });
    }
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !(step.kind === "long" && e.shiftKey)) {
      e.preventDefault();
      next();
    }
  }

  function render(s: Step, idx: number, active: boolean) {
    const v = answers[s.key];
    return (
      <div className="cq-step" aria-hidden={!active} onKeyDown={active ? onKey : undefined}>
        <span className="cq-count">{String(idx + 1).padStart(2, "0")} <i /> {String(total).padStart(2, "0")}</span>
        <h2>{s.q}</h2>
        {s.hint && <p className="cq-hint">{s.hint}</p>}
        {(s.kind === "text" || s.kind === "tel" || s.kind === "email") && (
          <input ref={active ? field : undefined} className="cq-input" type={s.kind} value={(v as string) ?? ""} placeholder={s.placeholder} autoComplete={s.key === "name" ? "name" : s.key === "phone" ? "tel" : s.key === "email" ? "email" : "off"} tabIndex={active ? 0 : -1} onChange={(e) => setAnswers({ ...answers, [s.key]: e.target.value })} />
        )}
        {s.kind === "date" && (
          <input ref={active ? field : undefined} className="cq-input cq-date" type="date" value={(v as string) ?? ""} tabIndex={active ? 0 : -1} onChange={(e) => setAnswers({ ...answers, [s.key]: e.target.value })} />
        )}
        {s.kind === "long" && (
          <textarea ref={active ? field : undefined} className="cq-input cq-long" rows={3} value={(v as string) ?? ""} placeholder={s.placeholder} tabIndex={active ? 0 : -1} onChange={(e) => setAnswers({ ...answers, [s.key]: e.target.value })} />
        )}
        {(s.kind === "choice" || s.kind === "multi") && (
          <div className="cq-options" role={s.kind === "choice" ? "radiogroup" : "group"}>
            {s.options!.map((o) => {
              const on = s.kind === "choice" ? v === o : ((v as string[]) ?? []).includes(o);
              return (
                <button key={o} type="button" className={on ? "is-on" : undefined} aria-pressed={on} tabIndex={active ? 0 : -1} onClick={() => pick(s, o)}>
                  <Check /> {o}
                </button>
              );
            })}
          </div>
        )}
        <p className="cq-error" role="alert">{active ? error : ""}</p>
      </div>
    );
  }

  const hasAnswer = Array.isArray(answers[step.key]) ? (answers[step.key] as string[]).length > 0 : !!(answers[step.key] as string)?.trim();

  return (
    <section className="cq">
      <div className="cq-top">
        <div className="cq-meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Enquiry progress">
          <span style={{ transform: `scaleX(${percent / 100})` }} />
        </div>
        <strong>{percent}%</strong>
      </div>

      {done ? (
        <div className="cq-stage">
          <div className="cq-step cq-thanks">
            <span className="cq-tick"><Check /></span>
            <h2>Thank you{typeof answers.name === "string" && answers.name.trim() ? `, ${answers.name.trim().split(" ")[0]}` : ""}!</h2>
            <p className="cq-hint">We have your details and will get back to you shortly.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="cq-stage" data-dir={dir}>
            {leaving !== null && <div className="cq-layer is-leaving" key={`l${leaving}`}>{render(steps[leaving], leaving, false)}</div>}
            <div className="cq-layer is-entering" key={`e${i}`}>{render(step, i, true)}</div>
          </div>
          <div className="cq-nav">
            <button type="button" className="cq-back" onClick={() => go(i - 1, -1)} disabled={i === 0 || status === "sending"} aria-label="Previous question"><ArrowLeft /></button>
            <button type="button" className="button cq-next" onClick={() => next()} disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : isLast ? "Send enquiry" : step.optional && !hasAnswer ? "Skip" : "Next"} <ArrowRight />
            </button>
            <span className="cq-enter">press <kbd>Enter</kbd></span>
          </div>
        </>
      )}
    </section>
  );
}
