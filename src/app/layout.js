import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400","500","600","700","800"],
  display: "swap",
  variable: "--font-manrope",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL("https://www.elite-vask.dk"),
  title: "Elite Vask | Mobil Bil Dampvask på Sjælland",
  description: "Elite Vask – mobil bil dampvask på Sjælland. Rent, effektivt og miljøvenligt. Vælg biltype, se pris og book tid online. Vi kører til dig.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Elite Vask | Mobil Bil Dampvask på Sjælland",
    description: "Vi kører til dig og vasker din bil. Rent, effektivt og miljøvenligt.",
    type: "website",
    locale: "da_DK",
    url: "https://www.elite-vask.dk",
    siteName: "Elite Vask",
    images: [{ url: "/hero.jpg.png", width: 1672, height: 941, alt: "Elite Vask – mobil bil dampvask" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Vask | Mobil Bil Dampvask på Sjælland",
    description: "Vi kører til dig og vasker din bil. Rent, effektivt og miljøvenligt.",
    images: ["/hero.jpg.png"],
  },
};

const JSONLD = [
{
  "@context":"https://schema.org",
  "@type":"AutoWash",
  "@id":"https://www.elite-vask.dk/#business",
  "name":"Elite Vask",
  "url":"https://www.elite-vask.dk",
  "image":"https://www.elite-vask.dk/hero.jpg.png",
  "logo":"https://www.elite-vask.dk/logo.jpg",
  "description":"Mobil bil dampvask på Sjælland. Rent, effektivt og miljøvenligt – vi kører til dig.",
  "telephone":"+4524440321",
  "email":"info@elite-vask.dk",
  "currenciesAccepted":"DKK",
  "paymentAccepted":"MobilePay, Bankoverførsel, Kontant",
  "areaServed":["Næstved","Roskilde","Køge","Ringsted","København","Stevns Kommune","Faxe Kommune","Helsingør","Hillerød","Frederikssund","Sjælland"],
  "priceRange":"500–2350 kr","vatID":"DK46392264",
  "address":{"@type":"PostalAddress","streetAddress":"Vangeledet 21","postalCode":"2830","addressLocality":"Virum","addressRegion":"Sjælland","addressCountry":"DK"},
  "openingHoursSpecification":[
    {"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"08:00","closes":"20:00"},
    {"@type":"OpeningHoursSpecification","dayOfWeek":["Saturday","Sunday"],"opens":"10:00","closes":"20:00"}
  ],
  "sameAs":["https://instagram.com/elitevasksjaelland"]
},
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
},
{
  "@context":"https://schema.org",
  "@type":"WebSite",
  "@id":"https://www.elite-vask.dk/#website",
  "url":"https://www.elite-vask.dk",
  "name":"Elite Vask",
  "inLanguage":"da-DK",
  "publisher":{"@id":"https://www.elite-vask.dk/#business"}
}
];

export default function RootLayout({ children }) {
  return (
    <html lang="da" className={manrope.variable}>
      <head>
        <meta name="trustpilot-one-time-domain-verification-id" content="3c40dbdd-ba69-4e5f-94e9-55aa98bd97b7" />
        {JSONLD.map((obj, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
          />
        ))}
      </head>
      <body>
        {children}
        <CookieConsent />
        <Analytics />
        <GoogleAnalytics />
        <script
          dangerouslySetInnerHTML={{ __html: `(function(w,d,s,r,n){w.TrustpilotObject=n;w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};a=d.createElement(s);a.async=1;a.src=r;a.type='text/java'+s;f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(a,f)})(window,document,'script','https://invitejs.trustpilot.com/tp.min.js','tp');tp('register','alMjUlvV9s57mEha');` }}
        />
        <script async src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" charSet="UTF-8" />
      </body>
    </html>
  );
}
