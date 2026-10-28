import Link from "next/link";
import Bi from "@/components/Bi";
const GUIDES = [
  { href: "/guide/hvor-ofte", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>), title: "Hvor ofte bør man vaske sin bil?", desc: "Salt om vinteren, pollen om foråret, insekter om sommeren. Se den konkrete guide til vaskehyppighed efter årstid." },
  { href: "/guide/salt-og-lak", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4M12 16h.01"/></svg>), title: "Beskyt bilens lak mod vejsalt", desc: "Vejsalt er bilens største fjende i den danske vinter. Lær hvordan salt angriber lakken og hvad du gør ved det." },
  { href: "/guide/dampvask-vs-traditionel", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 3c-1 1.5 1 3 0 4.5S7 10 8 11M12 3c-1 1.5 1 3 0 4.5S11 10 12 11M16 3c-1 1.5 1 3 0 4.5S15 10 16 11"/><path d="M4 15h16l-1.5 5h-13z"/></svg>), title: "Dampvask vs. traditionel bilvask", desc: "1–3 liter vand mod ca. 140 liter i en vaskehal. Ingen ridser, bakteriedrab ved 145°C. Se den fulde sammenligning." },
];
const GUIDES_EN = {
  "/guide/hvor-ofte": { title: "How often should you wash your car?", desc: "Salt in winter, pollen in spring, insects in summer. See the practical guide to washing frequency by season." },
  "/guide/salt-og-lak": { title: "Protect your car's paint from road salt", desc: "Road salt is your car's worst enemy in the Danish winter. Learn how salt attacks the paint and what to do about it." },
  "/guide/dampvask-vs-traditionel": { title: "Steam wash vs. traditional car wash", desc: "1–3 litres of water against approx. 140 litres in an automatic car wash. No scratches, bacteria killed at 145°C. See the full comparison." },
};

export const metadata = {
  title: "Bilpleje-guide: bilvask, vejsalt og dampvask | Elite Vask",
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
          <span><Bi da="Forside" en="Home" /></span>
        </Link>
        <Link href="/" className="gal-brand"><span className="gal-brand-mark" />Elite Vask</Link>
        <Link href="/#vaelg" className="gal-book"><Bi da="Book nu" en="Book now" /></Link>
      </header>

      <Bi
        da={<>
      <section className="gal-hero">
        <div className="eyebrow">Bilpleje Guide</div>
        <h1 className="gal-hero-title">Bilpleje-guide: råd &amp; viden om bilvask</h1>
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
        </>}
        en={<>
      <section className="gal-hero">
        <div className="eyebrow">Car Care Guide</div>
        <h1 className="gal-hero-title">Car care guide: advice &amp; know-how about car washing</h1>
        <p className="gal-hero-sub">Practical guides to keeping your car clean, protected and beautiful – from the mobile steam wash experts on Zealand.</p>
      </section>

      <section className="gal-section">
        <div style={{ maxWidth: 780, margin: "0 auto 40px", padding: "0 4px" }}>
          <p className="guide-lead" style={{ marginBottom: 18 }}>
            We wash cars on Zealand every week – and the same questions keep coming up.
            How often does the car actually need washing? What does road salt do to the paint
            over the winter? And is a steam wash just a more expensive way of doing the same thing?
          </p>
          <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.75, marginBottom: 16 }}>
            The guides below are our answers, written from what we see on the cars in
            practice. They are about car care in the Danish climate: salt and slush from
            November to March, pollen and insects in spring and summer, and moisture
            in the cabin all year round. You can use them whether you wash the car yourself
            or have us do it.
          </p>
          <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.75, margin: 0 }}>
            If you are unsure where to start, read <a href="/guide/hvor-ofte" style={{ color: "var(--green)" }}>how often you should wash your car</a>.
            If you drive a lot in winter, <a href="/guide/salt-og-lak" style={{ color: "var(--green)" }}>the guide to road salt and paint</a> is the most important one.
            And if you want to know why we use steam rather than a hose, we explain
            the difference in <a href="/guide/dampvask-vs-traditionel" style={{ color: "var(--green)" }}>steam wash vs. traditional car wash</a>.
          </p>
        </div>
        <div className="guide-index-grid">
          {GUIDES.map((g) => (
            <a key={g.href} href={g.href} className="guide-index-card">
              <div className="guide-card-icon">{g.icon}</div>
              <h2>{GUIDES_EN[g.href].title}</h2>
              <p>{GUIDES_EN[g.href].desc}</p>
              <span className="guide-card-read">Read guide →</span>
            </a>
          ))}
        </div>
      </section>

      <div className="gal-foot-cta">
        <Link href="/#vaelg" className="btn btn-green btn-lg">Find a price &amp; book your wash</Link>
      </div>
        </>}
      />
    </div>
  );
}
