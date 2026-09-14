import Link from "next/link";
import DanishOnlyNotice from "@/components/DanishOnlyNotice";
const GUIDES = [
  { href: "/guide/hvor-ofte", icon: "📅", title: "Hvor ofte bør man vaske sin bil?", desc: "Salt om vinteren, pollen om foråret, insekter om sommeren. Se den konkrete guide til vaskehyppighed efter årstid." },
  { href: "/guide/salt-og-lak", icon: "🧂", title: "Beskyt bilens lak mod vejsalt", desc: "Vejsalt er bilens største fjende i den danske vinter. Lær hvordan salt angriber lakken og hvad du gør ved det." },
  { href: "/guide/dampvask-vs-traditionel", icon: "♨️", title: "Dampvask vs. traditionel bilvask", desc: "1–3 liter vand vs. 200 liter. Ingen ridser, bakteriedrab ved 145°C. Se den fulde sammenligning." },
];

export const metadata = {
  title: "Bilpleje-guide – råd om mobil bilvask | Elite Vask",
  description: "Bilpleje Guide fra Elite Vask: hvor ofte du bør vaske bilen, beskyttelse mod vejsalt og dampvask vs. traditionel bilvask. Ekspertråd om mobil bilpleje.",
  alternates: { canonical: "/guide" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
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
        <Link href="/" className="gal-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          <span>Forside</span>
        </Link>
        <Link href="/" className="gal-brand"><span className="gal-brand-mark" />Elite Vask</Link>
        <Link href="/#vaelg" className="gal-book">Book nu</Link>
      </header>

      <div style={{ maxWidth: 900, margin: "16px auto 0", padding: "0 20px" }}><DanishOnlyNotice /></div>
      <section className="gal-hero">
        <div className="eyebrow">Bilpleje Guide</div>
        <h1 className="gal-hero-title">Råd &amp; viden om bilpleje</h1>
        <p className="gal-hero-sub">Praktiske guides til at holde din bil ren, beskyttet og smuk – fra eksperterne i mobil dampvask på Sjælland.</p>
      </section>

      {/* The hub page carried 129 words: three cards and nothing else. A page
          that only links onward gives a reader no reason to stay and gives a
          crawler almost nothing to rank. This intro says what the guides are
          for and who they are written by. */}
      <section className="gal-section">
        <div style={{ maxWidth: 780, margin: "0 auto 40px", padding: "0 4px" }}>
          <p className="guide-lead" style={{ marginBottom: 18 }}>
            Vi vasker biler på Sjælland hver uge – og de samme spørgsmål går igen.
            Hvor tit skal bilen egentlig vaskes? Hvad gør vejsaltet ved lakken hen
            over vinteren? Og er dampvask bare en dyrere måde at gøre det samme på?
          </p>
          <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.75, marginBottom: 16 }}>
            Guiderne herunder er vores svar, skrevet ud fra det vi ser på bilerne i
            praksis. De handler om bilpleje i det danske klima: salt og slud fra
            november til marts, pollen og insekter om foråret og sommeren, og fugt
            i kabinen året rundt. Du kan bruge dem, uanset om du vasker selv eller
            får os til det.
          </p>
          <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.75, margin: 0 }}>
            Er du i tvivl om hvor du skal starte, så læs <a href="/guide/hvor-ofte" style={{ color: "var(--green)" }}>hvor ofte du bør vaske bilen</a>.
            Kører du meget om vinteren, er <a href="/guide/salt-og-lak" style={{ color: "var(--green)" }}>guiden om vejsalt og lak</a> den vigtigste.
            Og vil du vide hvorfor vi bruger damp frem for spuleslange, forklarer vi
            forskellen i <a href="/guide/dampvask-vs-traditionel" style={{ color: "var(--green)" }}>dampvask vs. traditionel bilvask</a>.
          </p>
        </div>
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
        <Link href="/#vaelg" className="btn btn-green btn-lg">Find pris &amp; book din vask</Link>
      </div>
    </div>
  );
}
