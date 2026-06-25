const GUIDES = [
  { href: "/guide/hvor-ofte", icon: "📅", title: "Hvor ofte bør man vaske sin bil?", desc: "Salt om vinteren, pollen om foråret, insekter om sommeren. Se den konkrete guide til vaskehyppighed efter årstid." },
  { href: "/guide/salt-og-lak", icon: "🧂", title: "Beskyt bilens lak mod vejsalt", desc: "Vejsalt er bilens største fjende i den danske vinter. Lær hvordan salt angriber lakken og hvad du gør ved det." },
  { href: "/guide/dampvask-vs-traditionel", icon: "♨️", title: "Dampvask vs. traditionel bilvask", desc: "1–3 liter vand vs. 200 liter. Ingen ridser, bakteriedrab ved 145°C. Se den fulde sammenligning." },
];

export const metadata = {
  title: "Bilpleje Guide | Elite Vask – råd om mobil bilvask & bilpleje",
  description: "Bilpleje Guide fra Elite Vask: hvor ofte du bør vaske bilen, beskyttelse mod vejsalt og dampvask vs. traditionel bilvask. Ekspertråd om mobil bilpleje.",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "Bilpleje Guide | Elite Vask",
    description: "Ekspertråd om mobil bilvask og bilpleje på Sjælland.",
    url: "https://www.elite-vask.dk/guide",
    type: "website",
    locale: "da_DK",
  },
};

export default function GuidePage() {
  return (
    <div className="gal-page">
      <header className="gal-topbar">
        <a href="/" className="gal-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          <span>Forside</span>
        </a>
        <a href="/" className="gal-brand"><span className="gal-brand-mark" />Elite Vask</a>
        <a href="/#vaelg" className="gal-book">Book nu</a>
      </header>

      <section className="gal-hero">
        <div className="eyebrow">Bilpleje Guide</div>
        <h1 className="gal-hero-title">Råd &amp; viden om bilpleje</h1>
        <p className="gal-hero-sub">Praktiske guides til at holde din bil ren, beskyttet og smuk – fra eksperterne i mobil dampvask på Sjælland.</p>
      </section>

      <section className="gal-section">
        <div className="guide-index-grid">
          {GUIDES.map((g) => (
            <a key={g.href} href={g.href} className="guide-index-card">
              <div className="guide-card-icon">{g.icon}</div>
              <h2>{g.title}</h2>
              <p>{g.desc}</p>
              <span className="guide-card-read">Læs guide →</span>
            </a>
          ))}
        </div>
      </section>

      <div className="gal-foot-cta">
        <a href="/#vaelg" className="btn btn-green btn-lg">Find pris &amp; book din vask</a>
      </div>
    </div>
  );
}
