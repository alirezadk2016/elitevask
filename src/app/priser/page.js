import Link from "next/link";

export const metadata = {
  title: "Elite Vask – Priser | Mobil bil dampvask på Sjælland",
  description: "Se priser på mobil bil dampvask fra Elite Vask. Udvendig vask fra 500 kr, hel bil fra 800 kr, Guld pakke fra 2.000 kr. Gratis kørsel på Sjælland.",
  alternates: { canonical: "/priser" },
  openGraph: {
    title: "Elite Vask – Priser | Mobil bil dampvask på Sjælland",
    description: "Se priser på mobil bil dampvask. Udvendig fra 500 kr, hel bil fra 800 kr, Guld pakke fra 2.000 kr. Gratis kørsel på Sjælland.",
    type: "website",
    locale: "da_DK",
  },
};

const PRICES = [
  { car: "Lille bil", ex: "Aygo, Up!, i10", udv: 500, indv: 600, hele: 800, guld: 2000 },
  { car: "Mellemstor bil", ex: "Golf, Focus, i20", udv: 550, indv: 700, hele: 950, guld: 2200 },
  { car: "Stor bil / SUV", ex: "Passat, SUV, stationcar", udv: 650, indv: 850, hele: 1100, guld: 2350 },
  { car: "Varebil", ex: "Transit, Caddy, Berlingo", udv: 750, indv: 750, hele: 1400, guld: 2200 },
];

function fmtKr(n) {
  return n.toLocaleString("da-DK") + " kr";
}

export default function PriserPage() {
  return (
    <main style={{ background: "#0b1310", color: "#e9f1ec", minHeight: "100vh", fontFamily: "Manrope, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 80px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#37d278", marginBottom: 12 }}>
          Priser
        </p>
        <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: -1, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
          Priser på mobil bilvask
        </h1>
        <p style={{ fontSize: 16, color: "#94a89c", maxWidth: 600, lineHeight: 1.65, marginBottom: 48 }}>
          Elite Vask tilbyder professionel mobil bil dampvask direkte til din adresse på Sjælland.
          Vælg den pakke der passer til din bil og dine behov. <strong style={{ color: "#fff" }}>Kørsel er gratis</strong> til hele Sjælland.
        </p>

        <div style={{ overflowX: "auto", marginBottom: 48 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(55,210,120,.25)" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", color: "#94a89c", fontWeight: 600 }}>Biltype</th>
                <th style={{ textAlign: "right", padding: "12px 16px", color: "#94a89c", fontWeight: 600 }}>Udvendig</th>
                <th style={{ textAlign: "right", padding: "12px 16px", color: "#94a89c", fontWeight: 600 }}>Indvendig</th>
                <th style={{ textAlign: "right", padding: "12px 16px", color: "#94a89c", fontWeight: 600 }}>Hele bilen</th>
                <th style={{ textAlign: "right", padding: "12px 16px", color: "#d4af37", fontWeight: 600 }}>Guld pakke</th>
              </tr>
            </thead>
            <tbody>
              {PRICES.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,.07)", background: i % 2 === 0 ? "rgba(255,255,255,.02)" : "transparent" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "block", fontWeight: 700, color: "#fff" }}>{row.car}</span>
                    <span style={{ fontSize: 12, color: "#6f857a" }}>{row.ex}</span>
                  </td>
                  <td style={{ textAlign: "right", padding: "14px 16px", color: "#37d278", fontWeight: 700 }}>{fmtKr(row.udv)}</td>
                  <td style={{ textAlign: "right", padding: "14px 16px", color: "#37d278", fontWeight: 700 }}>{fmtKr(row.indv)}</td>
                  <td style={{ textAlign: "right", padding: "14px 16px", color: "#37d278", fontWeight: 700 }}>{fmtKr(row.hele)}</td>
                  <td style={{ textAlign: "right", padding: "14px 16px", color: "#d4af37", fontWeight: 700 }}>{fmtKr(row.guld)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: "rgba(55,210,120,.06)", border: "1px solid rgba(55,210,120,.18)", borderRadius: 14, padding: "20px 24px", marginBottom: 48, fontSize: 13.5, color: "#94a89c", lineHeight: 1.65 }}>
          Alle priser er vejledende og inkl. moms. Gratis kørsel til alle adresser på Sjælland (postnr. 1000–4799).
          Endelig pris bekræftes ved booking.
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Hvad er inkluderet?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
            {[
              { name: "Udvendig", desc: "Karosseri, fælge, dæk, ruder udvendigt & voksfinish" },
              { name: "Indvendig", desc: "Støvsugning, måtter, sæder, instrumentbræt & ruder indvendigt" },
              { name: "Hele bilen", desc: "Komplet ind & ud-behandling i ét besøg" },
              { name: "Guld pakke", desc: "Alt inkl. motorrens, lakforsegling & interiørbeskyttelse" },
            ].map((pkg) => (
              <div key={pkg.name} style={{ background: "#15211b", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "18px 16px" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{pkg.name}</div>
                <div style={{ fontSize: 13, color: "#94a89c", lineHeight: 1.55 }}>{pkg.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link href="/#vaelg" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#37d278", color: "#062313", borderRadius: 10, padding: "13px 26px", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Se priser & book direkte →
          </Link>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", borderRadius: 10, padding: "13px 26px", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
            Tilbage til forsiden
          </Link>
        </div>
      </div>
    </main>
  );
}
