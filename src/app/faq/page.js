export const metadata = {
  title: "FAQ – Elite Vask | Ofte stillede spørgsmål om mobil dampvask",
  description: "Svar på de mest stillede spørgsmål om Elite Vaskes mobile bil dampvask på Sjælland. Priser, behandlingstid, sikkerhed, elbiler, aftaler og meget mere.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ – Elite Vask | Ofte stillede spørgsmål",
    description: "Svar på de mest stillede spørgsmål om Elite Vaskes mobile bil dampvask på Sjælland.",
    type: "website",
    locale: "da_DK",
    url: "/faq",
  },
};

const DEFAULT_FAQ = [
  { q: "Kan dampvask skade lakken?", a: "Nej – dampvask er faktisk skånsom for lakken end traditionel højtryk- eller tunnelvask. Vi bruger professionel damp ved kontrolleret temperatur og bløde mikrofiberklude. Ingen roterende børster og ingen aggressive kemikalier. Metoden er anbefalet til biler med keramisk coating, poleret lak og sarte overflader." },
  { q: "Hvor lang tid tager det?", a: "Det afhænger af bilstørrelse og pakke: Lille bil: 100–120 min · Mellemstor bil: 120–180 min · Stor bil / SUV: 150–200 min · Varebil: 90–180 min. Vi er altid præcise med vores tidsestimater og holder dig opdateret undervejs." },
  { q: "Skal jeg være hjemme?", a: "Ikke nødvendigvis. Mange kunder er på arbejde, mens vi vasker bilen. Det eneste krav er, at bilen er tilgængelig og at der er fri adgang rundt om den. Ring eller skriv til os, så finder vi en løsning der passer dig." },
  { q: "Vasker I elbiler?", a: "Ja, vi vasker alle typer elbiler – Tesla, Polestar, VW ID, Hyundai Ioniq og alle andre mærker. Dampvask er ideelt til elbiler: vi bruger minimalt vand, ingen aggressive kemikalier der kan påvirke tætninger og elektronik, og vi undgår højtryk tæt på batteripakke og ladeporte." },
  { q: "Hvad hvis det regner?", a: "Let regn er sjældent et problem – vi kan vaske under overdækning, i carporte eller i garager. Ved kraftigt regn kontakter vi dig dagen inden og tilbyder at ombooke til nærmeste ledige tid helt uden gebyr." },
  { q: "Hvad koster mobil bilvask?", a: "Prisen afhænger af biltype og pakke: Udvendig vask fra 500 kr · Hel bil (ind & ud) fra 800 kr · Guld pakke (inkl. motorrens + lakforsegling) fra 2.000 kr. Kørsel til din adresse på Sjælland er gratis." },
  { q: "Kommer I til min adresse?", a: "Ja – det er hele idéen! Vi er 100% mobile og kører ud til dig, uanset om du er hjemme, på arbejdet eller i sommerhuset. Du behøver slet ikke flytte dig. Vi medbringer alt udstyr." },
  { q: "Arbejder I i hele Sjælland?", a: "Ja! Vi dækker hele Sjælland – postnumre 1000–4799 – inkl. Storkøbenhavn, Nordsjælland, Køge, Roskilde, Næstved, Ringsted og omegn. Kørsel er gratis til alle adresser inden for serviceområdet." },
  { q: "Er dampvask sikkert for min bil?", a: "Ja, dampvask er skånsomt for bilen. Vi bruger professionelle, pH-neutrale produkter og varm damp der løsner snavs uden at ridse lakken. Metoden bruges af professionelle detailere verden over og er anbefalet til biler med keramisk coating og poleret lak." },
  { q: "Hvad er inkluderet i Guld pakken?", a: "Guld pakken er vores mest komplette behandling og inkluderer alt: Komplet udvendig dampvask · Grundig indvendig rens · Professionel motorrens · Lak- & glansbeskyttelse (lakforsegling) · Interiørbeskyttelse · Dybderens ved uheld. Vores mest populære valg til biler der skal fremstå som nye." },
  { q: "Kan I vaske leasingbiler?", a: "Ja, vi klargør leasingbiler til aflevering. Vi sørger for at bilen fremstår ren og velholdt – både udvendigt og indvendigt – så du undgår ekstraomkostninger ved aflevering." },
  { q: "Hvad er forskellen på dampvask og almindelig bilvask?", a: "Traditionel bilvask ridser lakken over tid med børster og aggressive kemikalier. Dampvask bruger varme og tryk til at løsne snavs skånsomt – uden børster, uden aggressive kemikalier og med op til 90% mindre vandforbrug. Resultatet er en dybere rens, bedre glans og ingen mikroridser." },
  { q: "Skal jeg forberede bilen inden I kommer?", a: "Det er ikke nødvendigt, men du er velkommen til at fjerne løse genstande og personlige ejendele fra kabinen. Sørg blot for at bilen er tilgængelig og at der er fri plads rundt om den. Vi klarer resten!" },
  { q: "Kan I vaske elbiler og hybridbiler?", a: "Ja, vi vasker alle typer elbiler og hybridbiler. Dampvask er ideel til elbiler – vi bruger minimalt vand og ingen aggressive kemikalier, der kan påvirke tætninger og elektronik. Vi undgår naturligvis højtryksrenser tæt på batteripakken og ladeporte." },
  { q: "Hvad er forskellen på udvendig, indvendig og hel vask?", a: "Udvendig vask dækker karosseri, ruder, fælge og dæk. Indvendig vask dækker sæder, gulvmåtter, instrumentbræt, dørpaneler og ruder indefra. Hel vask er kombinationen af begge og er den mest populære løsning – alt renses i ét besøg." },
  { q: "Hvad sker der, hvis det regner på min bookingdag?", a: "Vi kontakter dig dagen inden og tilbyder enten at fortsætte (let regn er sjældent et problem indendørs eller under overdækning) eller at ombooke til nærmeste ledige tid uden ekstra gebyr. Vi er fleksible og finder altid en løsning." },
  { q: "Bruger I kemikalier, der kan skade lakken?", a: "Nej. Vi bruger miljøvenlige rengøringsmidler, der er testet til brug på biloverflader. Dampvasken kræver desuden langt færre kemikalier end traditionel bilvask – den varme damp opløser snavs og fedt mekanisk uden at angribe lakken." },
  { q: "Kan I vaske bilen, selvom den er meget beskidt eller fuld af dyrehår?", a: "Ja. Vi er vant til biler i alle tilstande – fra leasingbiler klar til aflevering til familievogne med sæsoners ophobede snavs og kæledyrhår. Meget kraftig tilsmudsning kan kræve ekstra tid, som vi aftaler med dig på forhånd." },
  { q: "Tilbyder I erhvervsaftaler til virksomheder med flåder?", a: "Ja, vi laver aftaler med virksomheder, der har behov for regelmæssig vask af firmabiler, varevogne eller hele flåder. Kontakt os på info@elite-vask.dk for et tilbud tilpasset jeres behov og lokation." },
  { q: "Hvad er jeres aflysningspolitik?", a: "Du kan aflyse eller ombooke gratis op til 24 timer inden din booking. Ved aflysning kortere end 24 timer forbeholder vi os retten til at opkræve et aflysningsgebyr på 150 kr. for at dække den reserverede kørselstid." },
  { q: "Rengør I sæder af læder og stof forskelligt?", a: "Ja. Læder behandles med skånsom rengøring og afsluttes med en fugtighedscreme, der holder læret blødt og forhindrer revner. Stofbeklædning damprenses, hvilket løsner snavs, fjerner lugt og dræber bakterier uden at mætte stoffet med vand." },
  { q: "Hvad dækker tilfredshedsgarantien?", a: "Hvis du ikke er tilfreds med resultatet, kigger vi altid på det igen og udbedrer det, der ikke lever op til vores standard – uden ekstra betaling. Vi beder dig blot kontakte os inden for 24 timer efter vasken med en beskrivelse og evt. billeder." },
];

async function getFaqItems() {
  try {
    const base = "https://www.elite-vask.dk";
    const res = await fetch(`${base}/api/site-content`, { next: { revalidate: 60 } });
    if (!res.ok) return DEFAULT_FAQ;
    const data = await res.json();
    if (data.faq && data.faq.length >= 5) {
      return data.faq.map((f) => ({
        q: f.q?.da || f.q || "",
        a: f.a?.da || f.a || "",
      }));
    }
  } catch (e) {}
  return DEFAULT_FAQ;
}

export default async function FaqPage() {
  const faqItems = await getFaqItems();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main style={{ background: "var(--bg0,#0b1310)", color: "var(--txt,#e9f1ec)", minHeight: "100vh", fontFamily: "Manrope, system-ui, sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HEADER ── */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,.07)", position: "sticky", top: 0, zIndex: 100, background: "rgba(11,19,16,.92)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo.jpg" alt="Elite Vask" style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover" }} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>ELITE VASK</div>
              <div style={{ fontSize: 10, color: "#37d278", fontWeight: 600, letterSpacing: 0.5 }}>MOBIL BIL DAMPVASK</div>
            </div>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="tel:+4524440321" aria-label="Ring +45 24 44 03 21" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
              <span style={{ display: "none" }}>+45 24 44 03 21</span>
            </a>
            <a href="/#vaelg" style={{ background: "#37d278", color: "#062313", borderRadius: 8, padding: "9px 18px", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
              Book nu
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 16px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#37d278", marginBottom: 14 }}>
          Spørgsmål &amp; svar
        </p>
        <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, letterSpacing: -1, color: "#fff", lineHeight: 1.1, marginBottom: 18 }}>
          Ofte stillede spørgsmål
        </h1>
        <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "#94a89c", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 52px" }}>
          Her finder du svar på alt om Elite Vaskes mobile bil dampvask på Sjælland — priser, behandlingstid, sikkerhed og meget mere.
        </p>
      </div>

      {/* ── FAQ ACCORDION ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 20px" }}>
        {faqItems.map((f, i) => (
          <details key={i} className="faq-page-item">
            <summary>
              <span>{f.q}</span>
              <svg className="faq-page-icon" viewBox="0 0 24 24" fill="none" stroke="#37d278" strokeWidth="2.2" strokeLinecap="round" width="20" height="20">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </summary>
            <div className="faq-page-ans">
              <p>{f.a}</p>
            </div>
          </details>
        ))}
      </div>

      {/* ── CTA ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px", textAlign: "center" }}>
        <div style={{ background: "rgba(55,210,120,.06)", border: "1px solid rgba(55,210,120,.18)", borderRadius: 18, padding: "40px 28px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#37d278", marginBottom: 12 }}>Klar til en ren bil?</p>
          <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 800, color: "#fff", letterSpacing: -0.5, marginBottom: 10 }}>
            Book din dampvask i dag
          </h2>
          <p style={{ fontSize: 15, color: "#94a89c", lineHeight: 1.65, marginBottom: 28, maxWidth: 440, margin: "0 auto 28px" }}>
            Vi kører til dig — gratis kørsel i hele Sjælland. Betal først når bilen er ren.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/#vaelg" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#37d278", color: "#062313", borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              Se priser &amp; book
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="tel:+4524440321" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", borderRadius: 10, padding: "13px 24px", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
              Ring nu
            </a>
          </div>
        </div>

        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.45)", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Tilbage til forsiden
          </a>
        </div>
      </div>
    </main>
  );
}
