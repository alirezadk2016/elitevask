import JsonLd from "@/components/JsonLd";

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
},
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
    {"@type":"Question","name":"Hvad koster mobil bilvask?","acceptedAnswer":{"@type":"Answer","text":"Prisen afhænger af biltype og pakke. Udvendig vask starter fra 500 kr. Hel bil (ind & ud) fra 800 kr. Guld pakke fra 2.000 kr. Kørsel til din adresse på Sjælland er gratis."}},
    {"@type":"Question","name":"Hvor lang tid tager det?","acceptedAnswer":{"@type":"Answer","text":"Typisk mellem 1 og 4 timer afhængigt af pakke og bilens størrelse."}},
    {"@type":"Question","name":"Dækker I hele Sjælland?","acceptedAnswer":{"@type":"Answer","text":"Ja, vi dækker store dele af Sjælland, herunder Storkøbenhavn og Nordsjælland."}},
    {"@type":"Question","name":"Kan I vaske leasingbiler?","acceptedAnswer":{"@type":"Answer","text":"Ja, vi klargør leasingbiler til aflevering. Vi sørger for at bilen fremstår ren og velholdt – både udvendigt og indvendigt – så du undgår ekstraomkostninger ved aflevering. Vi anbefaler Guld pakken til leasingbiler."}},
    {"@type":"Question","name":"Kommer I hjem til mig?","acceptedAnswer":{"@type":"Answer","text":"Ja, vi er mobile og kører ud til din adresse – hjemme eller på arbejde."}},
    {"@type":"Question","name":"Hvad er forskellen på dampvask og almindelig bilvask?","acceptedAnswer":{"@type":"Answer","text":"Dampvask bruger varm damp med minimalt vandforbrug, renser mere skånsomt og desinficerer overflader uden aggressive kemikalier."}}
  ]
}
];

export default function HomeJsonLd() {
  return <JsonLd items={HOME_JSONLD} />;
}
