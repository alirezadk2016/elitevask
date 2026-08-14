import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { getHours, openingHoursSpec } from "@/lib/getHours";
import TrustpilotInvite from "@/components/TrustpilotInvite";

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
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Vask | Mobil Bil Dampvask på Sjælland",
    description: "Vi kører til dig og vasker din bil. Rent, effektivt og miljøvenligt.",
    images: ["/og-cover.jpg"],
  },
};

const JSONLD = [
{
  "@context":"https://schema.org",
  "@type":"AutoWash",
  "@id":"https://www.elite-vask.dk/#business",
  "name":"Elite Vask",
  "url":"https://www.elite-vask.dk",
  "image":"https://www.elite-vask.dk/og-cover.jpg",
  "logo":"https://www.elite-vask.dk/logo-192.png",
  "description":"Mobil bil dampvask på Sjælland. Rent, effektivt og miljøvenligt – vi kører til dig.",
  "telephone":"+4524440321",
  "email":"info@elite-vask.dk",
  "currenciesAccepted":"DKK",
  "paymentAccepted":"MobilePay, Bankoverførsel, Kontant",
  "areaServed":["Næstved","Roskilde","Køge","Ringsted","København","Stevns Kommune","Faxe Kommune","Helsingør","Hillerød","Frederikssund","Sjælland"],
  "priceRange":"500–2350 kr","vatID":"DK46392264",
  "address":{"@type":"PostalAddress","addressLocality":"København","addressRegion":"Sjælland","addressCountry":"DK"},
  "openingHoursSpecification":[],
  "sameAs":["https://instagram.com/elitevasksjaelland"]
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

export default async function RootLayout({ children }) {
  // Reflect the manager-configured opening hours in the business JSON-LD so
  // Google never advertises stale hours after an admin change.
  const hours = await getHours();
  const jsonLd = JSONLD.map((obj) =>
    obj["@id"] === "https://www.elite-vask.dk/#business"
      ? { ...obj, openingHoursSpecification: openingHoursSpec(hours) }
      : obj,
  );
  return (
    <html lang="da" className={manrope.variable}>
      <head>
        <meta name="trustpilot-one-time-domain-verification-id" content="3c40dbdd-ba69-4e5f-94e9-55aa98bd97b7" />
        {jsonLd.map((obj, i) => (
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
        <TrustpilotInvite />
        {/* Trustpilot widget bootstrap intentionally NOT loaded — no TrustBox
            widget exists on the site (we use plain links), so it was dead
            weight on every page. Re-add it if a TrustBox is ever embedded. */}
      </body>
    </html>
  );
}
