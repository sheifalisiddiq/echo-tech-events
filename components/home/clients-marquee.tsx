const logos = [
  "c1.webp", "c2.webp", "c3.webp", "c4.webp", "c5.webp", "c6.webp", "c7.png", "c8.webp",
  "c9.webp", "c10.webp", "c11.webp", "c12.png", "c13.png", "c-oj.webp", "c14.webp", "c15.webp",
  "c16.webp", "c17.png", "c18.webp", "c19.webp", "c20.png", "c21.png", "c22.webp",
] as const;

export function ClientsMarquee() {
  const row = (hidden: boolean) => (
    <ul className="clients-row" aria-hidden={hidden || undefined}>
      {logos.map((file) => (
        <li key={file}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/clients/${file}`} alt="" loading="lazy" decoding="async" />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="clients-section" aria-label="Trusted by leading brands">
      <h2 className="clients-title">Trusted by leading brands</h2>
      <div className="clients-viewport">
        <div className="clients-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
