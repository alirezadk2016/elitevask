import Link from "next/link";

export const metadata = {
  title: "Elite Vask – FAQ | Ofte stillede spørgsmål om mobil bilvask",
  description: "Svar på de mest stillede spørgsmål om Elite Vaskes mobile bil dampvask på Sjælland. Priser, tider, sikkerhed, elbiler og meget mere.",
  alternates: { canonical: "https://elite-vask.dk/faq" },
  openGraph: {
    title: "Elite Vask – FAQ | Ofte stillede spørgsmål om mobil bilvask",
    description: "Svar på de mest stillede spørgsmål om Elite Vaskes mobile bil dampvask på Sjælland.",
    type: "website",
    locale: "da_DK",
  },
};

const FAQ = [
  {
    q: "Kan dampvask skade lakken?",
    a: "Nej – dampvask er faktisk skånsom for lakken end traditionel højtryk- eller tunnelvask. Vi bruger professionel damp ved kontrolleret temperatur og bløde mikrofiberklude. Der bruges ingen roterende børster, der kan ridse, og ingen aggressive kemikalier, der kan angribe lakken. Metoden er anbefalet til biler med keramisk coating, poleret lak og sarte overflader.",
  },
  {
    q: "Hvor lang tid tager det?",
    a: "Det afhænger af bilstørrelse og pakke: Lille bil: 100–120 min. Mellemstor bil: 120–180 min. Stor bil / SUV: 150–200 min. Varebil: 90–180 min. Vi er altid præcise med vores tidsestimater og holder dig opdateret undervejs.",
  },
  {
    q: "Skal jeg være hjemme?",
    a: "Ikke nødvendigvis. Mange kunder er på arbejde, mens vi vasker bilen. Det eneste krav er, at bilen er tilgængelig og at der er fri adgang rundt om den. Ring eller skriv til os, så finder vi en løsning der passer dig.",
  },
  {
    q: "Vasker I elbiler?",
    a: "Ja, vi vasker alle typer elbiler – Tesla, Polestar, VW ID, Hyundai Ioniq og alle andre mærker. Dampvask er ideelt til elbiler: vi bruger minimalt vand, ingen aggressive kemikalier der kan påvirke tætninger og elektronik, og vi undgår højtryk tæt på batteripakke og ladeporte.",
  },
  {
    q: "Hvad hvis det regner?",
    a: "Let regn er sjældent et problem – vi kan vaske under overdækning, i carporte eller i garager. Ved kraftigt regn kontakter vi dig dagen inden og tilbyder at ombooke til nærmeste ledige tid helt uden gebyr.",
  },
  {
    q: "Hvad koster mobil bilvask?",
    a: "Prisen afhænger af biltype og pakke: Udvendig vask fra 500 kr. Hel bil (ind & ud) fra 800 kr. Guld pakke (inkl. motorrens + lakforsegling) fra 2.000 kr. Kørsel til din adresse på Sjælland er gratis.",
  },
  {
    q: "Kommer I til min adresse?",
    a: "Ja – det er hele idéen! Vi er 100% mobile og kører ud til dig, uanset om du er hjemme, på arbejdet eller i sommerhuset. Du behøver slet ikke flytte dig. Vi medbringer alt udstyr.",
  },
  {
    q: "Arbejder I i hele Sjælland?",
    a: "Ja! Vi dækker hele Sjælland – postnumre 1000–4799 – inkl. Storkøbenhavn, Nordsjælland, Køge, Roskilde, Næstved, Ringsted og omegn. Kørsel er gratis til alle adresser inden for serviceområdet.",
  },
  {
    q: "Hvad er inkluderet i Guld pakken?",
    a: "Guld pakken er vores mest komplette behandling og inkluderer alt: Komplet udvendig dampvask, grundig indvendig rens, professionel motorrens, lak- & glansbeskyttelse (lakforsegling), interiørbeskyttelse og dybderens ved uheld.",
  },
  {
    q: "Kan I vaske leasingbiler?",
    a: "Ja, vi klargør leasingbiler til aflevering. Vi sørger for at bilen fremstår ren og velholdt – både udvendigt og indvendigt – så du undgår ekstraomkostninger ved aflevering.",
  },
  {
    q: "Hvad er forskellen på dampvask og almindelig bilvask?",
    a: "Traditionel bilvask ridser lakken over tid med børster og aggressive kemikalier. Dampvask bruger varme og tryk til at løsne snavs skånsomt – uden børster, uden aggressive kemikalier og med op til 90% mindre vandforbrug. Resultatet er en dybere rens, bedre glans og ingen mikroridser.",
  },
  {
    q: "Hvad er jeres aflysningspolitik?",
    a: "Du kan aflyse eller ombooke gratis op til 24 timer inden din booking. Ved aflysning kortere end 24 timer forbeholder vi os retten til at opkræve et aflysningsgebyr på 150 kr. for at dække den reserverede kørselstid.",
  },
];

const FAQJSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <main style={{ background: "#0b1310", color: "#e9f1ec", minHeight: "100vh", fontFamily: "Manrope, system-ui, sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQJSONLD) }}
      />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#37d278", marginBottom: 12 }}>
          Spørgsmål & svar
        </p>
        <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: -1, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
          Ofte stillede spørgsmål
        </h1>
        <p style={{ fontSize: 16, color: "#94a89c", lineHeight: 1.65, marginBottom: 48 }}>
          Her finder du svar på de mest stillede spørgsmål om Elite Vaskes mobile bil dampvask på Sjælland.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {FAQ.map((f, i) => (
            <details
              key={i}
              style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}
            >
              <summary style={{
                listStyle: "none",
                cursor: "pointer",
                fontSize: 15.5,
                fontWeight: 600,
                color: "#e9f1ec",
                padding: "20px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}>
                {f.q}
                <svg viewBox="0 0 24 24" fill="none" stroke="#37d278" strokeWidth="2" strokeLinecap="round" width="20" height="20" style={{ flexShrink: 0 }}>
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </summary>
              <p style={{ fontSize: 14.5, color: "#94a89c", padding: "0 0 20px", lineHeight: 1.65, margin: 0 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>

        <div style={{ marginTop: 48, display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link href="/#vaelg" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#37d278", color: "#062313", borderRadius: 10, padding: "13px 26px", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Se priser & book nu →
          </Link>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", borderRadius: 10, padding: "13px 26px", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
            Tilbage til forsiden
          </Link>
        </div>
      </div>
    </main>
  );
}
