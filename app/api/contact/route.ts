const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const FIELDS: [string, string][] = [
  ["name", "Name"],
  ["phone", "Phone / WhatsApp"],
  ["email", "Email"],
  ["eventType", "Event type"],
  ["experiences", "Interested in"],
  ["date", "Event date"],
  ["location", "Location"],
  ["notes", "Notes"],
];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  if (!name || phone.replace(/\D/g, "").length < 6 || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: "Please complete your name, phone and email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return Response.json({ error: "Email is not configured yet." }, { status: 503 });
  }
  const from = process.env.CONTACT_FROM_EMAIL || "ECHO TECH EVENTS <onboarding@resend.dev>";

  const value = (k: string) => {
    const v = body[k];
    return (Array.isArray(v) ? v.join(", ") : String(v ?? "")).trim() || "-";
  };
  const rows = FIELDS.map(
    ([k, label]) =>
      `<tr><td style="padding:8px 16px 8px 0;color:#667;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:8px 0"><strong>${esc(value(k))}</strong></td></tr>`,
  ).join("");
  const text = FIELDS.map(([k, label]) => `${label}: ${value(k)}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: email,
      subject: `New enquiry from ${name}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px"><h2 style="margin:0 0 12px">New event enquiry</h2><table>${rows}</table></div>`,
      text,
    }),
  });

  if (!res.ok) return Response.json({ error: "Could not send your enquiry. Please try again." }, { status: 502 });
  return Response.json({ ok: true });
}
