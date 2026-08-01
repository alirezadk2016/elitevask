import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { breadcrumbLd, SITE } from "@/lib/seo";

export const metadata = {
  title: "Priser – Elite Vask | Mobil bil dampvask på Sjælland",
  description: "Se priser på mobil bil dampvask fra Elite Vask. Udvendig vask fra 500 kr, hel bil fra 800 kr, Guld pakke fra 2.000 kr. Gratis kørsel på Sjælland.",
  alternates: { canonical: "/priser" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/hero.jpg.png", width: 1672, height: 941, alt: "Elite Vask – mobil bil dampvask" }],
    title: "Priser – Elite Vask | Mobil bil dampvask på Sjælland",
    description: "Se priser på mobil bil dampvask. Udvendig fra 500 kr, hel bil fra 800 kr, Guld pakke fra 2.000 kr. Gratis kørsel på Sjælland.",
    type: "website",
    locale: "da_DK",
    url: "/priser",
  },
};

const PRICES = [
  { id: "lille",   car: "Lille bil", ex: "Aygo, Up!, i10", udv: 500, indv: 600, hele: 800, guld: 2000 },
  { id: "mellem",  car: "Mellemstor bil", ex: "Golf, Focus, i20", udv: 550, indv: 700, hele: 950, guld: 2200 },
  { id: "stor",    car: "Stor bil / SUV", ex: "Passat, SUV, stationcar", udv: 650, indv: 850, hele: 1100, guld: 2350 },
  { id: "varebil", car: "Varebil", ex: "Transit, Caddy, Berlingo", udv: 750, indv: 750, hele: 1400, guld: 2200 },
];

const EXTRAS = [
  { id: "motor",      name: "Motorrens", desc: "Grundig afrensning af motorrum", price: 400 },
  { id: "lak",        name: "Lak- & glansbeskyttelse", desc: "Udvendig – langvarig ekstra glans", price: 300 },
  { id: "pleje",      name: "Indvendig pleje & beskyttelse", desc: "Beskytter og fornyer interiøret", price: 200 },
  { id: "haar",       name: "Fjernelse af dyrehår", desc: "Effektiv fjernelse af hår og fnug", price: 300 },
  { id: "saede",      name: "Sæderens (stof)", desc: "Dybderens af stofsæder", price: 400 },
  { id: "barnesaede", name: "Barnesæde rens", desc: "Grundig og sikker rengøring", price: 100 },
];

function fmtKr(n) {
  return n.toLocaleString("da-DK") + " kr";
}

export const revalidate = 60;

// Merge admin-edited prices (KV content:prices) over the code defaults so this
// page never diverges from the homepage calculator.
async function getPrices() {
  try {
    const { kv } = await import("@vercel/kv");
    const raw = await kv.get("content:prices");
    const kvp = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (kvp && typeof kvp === "object") {
      return PRICES.map((row) => {
        const o = kvp[row.id] || {};
        const num = (v, fb) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : fb);
        return {
          ...row,
          udv: num(o.udv, row.udv), indv: num(o.indv, row.indv),
          hele: num(o.hele, row.hele), guld: num(o.guld, row.guld),
        };
      });
    }
  } catch (e) {}
  return PRICES;
}

// Admin-managed add-ons (KV content:extras) with the code defaults as fallback.
async function getExtras() {
  try {
    const { kv } = await import("@vercel/kv");
    const raw = await kv.get("content:extras");
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(arr) && arr.length) {
      // Force strings: an admin-saved item like {da:"", en:"..."} must never
      // leak an object into JSX (that crashes the whole page render).
      const str = (v) => {
        if (typeof v === "string") return v;
        if (v && typeof v === "object") return v.da || v.en || "";
        return "";
      };
      return arr
        .map((e) => ({
          name: str(e.name),
          desc: str(e.desc),
          price: Number(e.price) || 0,
        }))
        .filter((e) => e.name);
    }
  } catch (e) {}
  return EXTRAS;
}

export default async function PriserPage() {
  const [prices, extras] = await Promise.all([getPrices(), getExtras()]);

  // Structured data: price list as a Service with an OfferCatalog — helps
  // search engines show pricing and improves the page's SEO footprint.
  const offersLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mobil bil dampvask",
    serviceType: "Car wash",
    provider: { "@id": `${SITE}/#business` },
    areaServed: "Sjælland",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Priser på mobil bilvask",
      itemListElement: prices.map((row) => ({
        "@type": "Offer",
        name: `Hele bilen – ${row.car}`,
        priceCurrency: "DKK",
        price: row.hele,
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "DKK",
          minPrice: Math.min(row.udv, row.indv, row.hele, row.guld),
        },
      })),
    },
  };

  return (
    <main style={{ background: "#0b1310", color: "#e9f1ec", minHeight: "100dvh", fontFamily: "Manrope, system-ui, sans-serif" }}>
      <JsonLd
        items={[
          breadcrumbLd([
            { name: "Forside", path: "/" },
            { name: "Priser", path: "/priser" },
          ]),
          offersLd,
        ]}
      />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#37d278", fontSize: 14, fontWeight: 600, textDecoration: "none", marginBottom: 32, opacity: 0.9 }}>
          ← Tilbage til forsiden
        </a>

        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#37d278", marginBottom: 12 }}>
          Priser
        </p>
        <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: -1, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
          Priser på mobil bilvask
        </h1>
        <p style={{ fontSize: 16, color: "#94a89c", maxWidth: 600, lineHeight: 1.65, marginBottom: 40 }}>
          Elite Vask tilbyder professionel mobil bil dampvask direkte til din adresse på Sjælland.
          Vælg den pakke der passer til din bil og dine behov. <strong style={{ color: "#fff" }}>Kørsel er gratis</strong> til hele Sjælland.
        </p>

        <div style={{ overflowX: "auto", marginBottom: 40, borderRadius: 14, border: "1px solid rgba(255,255,255,.07)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(55,210,120,.25)" }}>
                <th style={{ textAlign: "left", padding: "13px 16px", color: "#94a89c", fontWeight: 600 }}>Biltype</th>
                <th style={{ textAlign: "right", padding: "13px 16px", color: "#94a89c", fontWeight: 600 }}>Udvendig</th>
                <th style={{ textAlign: "right", padding: "13px 16px", color: "#94a89c", fontWeight: 600 }}>Indvendig</th>
                <th style={{ textAlign: "right", padding: "13px 16px", color: "#94a89c", fontWeight: 600 }}>Hele bilen</th>
                <th style={{ textAlign: "right", padding: "13px 16px", color: "#d4af37", fontWeight: 600 }}>Guld pakke</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((row, i) => (
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

        {extras.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Ekstra ydelser</h2>
            <p style={{ fontSize: 14, color: "#94a89c", lineHeight: 1.6, marginBottom: 18 }}>
              Tilvalg du kan lægge til din pakke – vælges nemt under booking.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
              {extras.map((ex, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, background: "#15211b", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "16px 16px" }}>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{ex.name}</div>
                    <div style={{ fontSize: 12.5, color: "#94a89c", lineHeight: 1.5 }}>{ex.desc}</div>
                  </div>
                  {ex.price > 0 && (
                    <span style={{ flexShrink: 0, fontSize: 14, fontWeight: 800, color: "#37d278", whiteSpace: "nowrap" }}>+{fmtKr(ex.price)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 56 }}>
          <Link href="/#vaelg" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#37d278", color: "#062313", borderRadius: 10, padding: "13px 26px", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Beregn din pris & book →
          </Link>
          <Link href="/kontakt" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", borderRadius: 10, padding: "13px 26px", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
            Kontakt os
          </Link>
        </div>

        <RelatedLinks />
      </div>
    </main>
  );
}
