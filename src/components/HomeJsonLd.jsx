import JsonLd from "@/components/JsonLd";

// Built-in price floor/ceiling, overridden by the admin-managed KV matrix so
// the structured data can never advertise prices the site no longer charges.
const DEFAULT_PRICES = {
  lille:   { hele: 800,  udv: 500, indv: 600, guld: 2000 },
  mellem:  { hele: 950,  udv: 550, indv: 700, guld: 2200 },
  stor:    { hele: 1100, udv: 650, indv: 850, guld: 2350 },
  varebil: { hele: 1400, udv: 750, indv: 750, guld: 2200 },
};

async function priceRange() {
  let m = DEFAULT_PRICES;
  try {
    const { kv } = await import("@vercel/kv");
    const raw = await kv.get("content:prices");
    const p = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (p && typeof p === "object") {
      m = {};
      for (const car of Object.keys(DEFAULT_PRICES)) {
        m[car] = { ...DEFAULT_PRICES[car] };
        for (const pk of Object.keys(DEFAULT_PRICES[car])) {
          const n = Number(p[car]?.[pk]);
          if (Number.isFinite(n) && n > 0) m[car][pk] = n;
        }
      }
    }
  } catch {}
  const all = Object.values(m).flatMap((r) => Object.values(r)).filter((n) => Number.isFinite(n) && n > 0);
  return { low: Math.min(...all), high: Math.max(...all) };
}

// Homepage-only structured data. These used to live in the root layout, which
// emitted them on EVERY route — /faq then carried two FAQPage entities (Google
// treats that as invalid and drops FAQ rich results) and /priser two Service
// entities. The business (AutoWash) + WebSite blocks stay global in layout.js.
const HOME_JSONLD = [
{
  "@context":"https://schema.org",
  "@type":"Service",
  "name":"Mobil bil dampvask",
  "serviceType":"Car Wash",
  "provider":{"@id":"https://www.elite-vask.dk/#business"},
  "areaServed":{"@type":"State","name":"Sjælland","addressCountry":"DK"},
  "description":"Professionel mobil bil dampvask på Sjælland. Vi kører til din adresse og vasker din bil med damp – skånsomt, effektivt og miljøvenligt.",
  "offers":{
    "@type":"AggregateOffer",
    "priceCurrency":"DKK",
    "lowPrice":"500",
    "highPrice":"2350",
    "offerCount":"16",
    "offers":[
      {"@type":"Offer","name":"Udvendig dampvask","description":"Skånsom udvendig dampvask – håndvask, fælge, voksfinish.","priceCurrency":"DKK","price":"500","priceSpecification":{"@type":"PriceSpecification","minPrice":"500","maxPrice":"750","priceCurrency":"DKK","valueAddedTaxIncluded":true}},
      {"@type":"Offer","name":"Indvendig dampvask","description":"Dybderens af kabinen – støvsugning, sæder, desinficering.","priceCurrency":"DKK","price":"600","priceSpecification":{"@type":"PriceSpecification","minPrice":"600","maxPrice":"850","priceCurrency":"DKK","valueAddedTaxIncluded":true}},
      {"@type":"Offer","name":"Hele bilen (ind & ud)","description":"Komplet behandling ind og ud – mest populære pakke.","priceCurrency":"DKK","price":"800","priceSpecification":{"@type":"PriceSpecification","minPrice":"800","maxPrice":"1400","priceCurrency":"DKK","valueAddedTaxIncluded":true}},
      {"@type":"Offer","name":"Guld pakke","description":"Premium: motorrens + lakforsegling + dybdebehandling inkl.","priceCurrency":"DKK","price":"2000","priceSpecification":{"@type":"PriceSpecification","minPrice":"2000","maxPrice":"2350","priceCurrency":"DKK","valueAddedTaxIncluded":true}}
    ]
  }
},
{
  "@context":"https://schema.org",
  "@type":"VideoObject",
  "name":"Elite Vask – professionel mobil dampvask i aktion",
  "description":"Se Elite Vask udføre professionel mobil dampvask på stedet – fra snavset til skinnende ren bil.",
  "thumbnailUrl":"https://www.elite-vask.dk/gallery/steam-bmw.jpg",
  "contentUrl":"https://www.elite-vask.dk/gallery/elite-vask-demo.mp4",
  "uploadDate":"2026-05-12",
  "publisher":{"@id":"https://www.elite-vask.dk/#business"}
}

];

export default async function HomeJsonLd() {
  const { low, high } = await priceRange();
  const items = HOME_JSONLD.map((o) =>
    o["@type"] === "Service" && o.offers
      ? { ...o, offers: { ...o.offers, lowPrice: String(low), highPrice: String(high) } }
      : o,
  );
  return <JsonLd items={items} />;
}
