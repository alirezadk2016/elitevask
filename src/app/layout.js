import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400","500","600","700","800"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata = {
  title: "Elite Vask – Mobil bil dampvask på Sjælland | Vi kører til dig",
  description: "Elite Vask – mobil bil dampvask på Sjælland. Rent, effektivt og miljøvenligt. Vælg biltype, se pris og book tid online. Vi kører til dig.",
  openGraph: {
    title: "Elite Vask – Mobil bil dampvask på Sjælland",
    description: "Vi kører til dig og vasker din bil. Rent, effektivt og miljøvenligt.",
    type: "website",
    locale: "da_DK",
  },
  twitter: { card: "summary_large_image" },
};

const JSONLD = [
{
  "@context":"https://schema.org",
  "@type":"LocalBusiness",
  "name":"Elite Vask",
  "image":"",
  "description":"Mobil bil dampvask på Sjælland. Rent, effektivt og miljøvenligt.",
  "telephone":"+4524440321",
  "email":"elitevask01@gmail.com",
  "areaServed":"Sjælland, Danmark",
  "priceRange":"kr","vatID":"DK46392264",
  "address":{"@type":"PostalAddress","addressRegion":"Sjælland","addressCountry":"DK"},
  "sameAs":["https://instagram.com/elitevasksjaelland"]
},
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
    {"@type":"Question","name":"Hvad koster mobil bilvask?","acceptedAnswer":{"@type":"Answer","text":"Prisen afhænger af biltype og pakke. En komplet vask starter fra 799 kr. Vælg din biltype på siden for at se den præcise pris."}},
    {"@type":"Question","name":"Hvor lang tid tager det?","acceptedAnswer":{"@type":"Answer","text":"Typisk mellem 1 og 4 timer afhængigt af pakke og bilens størrelse."}},
    {"@type":"Question","name":"Dækker I hele Sjælland?","acceptedAnswer":{"@type":"Answer","text":"Ja, vi dækker store dele af Sjælland, herunder Storkøbenhavn og Nordsjælland."}},
    {"@type":"Question","name":"Kan I vaske leasingbiler?","acceptedAnswer":{"@type":"Answer","text":"Ja, vores Returklargøring-pakke er lavet specielt til aflevering af leasingbiler."}},
    {"@type":"Question","name":"Kommer I hjem til mig?","acceptedAnswer":{"@type":"Answer","text":"Ja, vi er mobile og kører ud til din adresse – hjemme eller på arbejde."}},
    {"@type":"Question","name":"Hvad er forskellen på dampvask og almindelig bilvask?","acceptedAnswer":{"@type":"Answer","text":"Dampvask bruger varm damp med minimalt vandforbrug, renser mere skånsomt og desinficerer overflader uden aggressive kemikalier."}}
  ]
}
];

export default function RootLayout({ children }) {
  return (
    <html lang="da" className={manrope.variable}>
      <head>
        {JSONLD.map((obj, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
          />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
