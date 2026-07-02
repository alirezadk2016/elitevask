import GameClient from "./GameClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, SITE } from "@/lib/seo";

export const metadata = {
  title: "Car Wash Game – vask bilen online | Elite Vask",
  description:
    "Spil Elite Vask Car Wash Game: styr højtryksrenseren, fjern snavs og gør bilen skinnende ren i 3D. Gratis minispil – og book bagefter en rigtig mobil dampvask på Sjælland.",
  alternates: { canonical: "/game" },
  openGraph: {
    title: "Elite Vask Car Wash Game",
    description: "Rens bilen i 3D med højtryksrenseren – gratis minispil fra Elite Vask.",
    type: "website",
    locale: "da_DK",
    url: "/game",
    images: [{ url: "/hero.jpg.png", width: 1672, height: 941, alt: "Elite Vask Car Wash Game" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Vask Car Wash Game",
    description: "Rens bilen i 3D med højtryksrenseren – gratis minispil fra Elite Vask.",
  },
};

const gameLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Elite Vask Car Wash Game",
  url: `${SITE}/game`,
  inLanguage: "da-DK",
  gamePlatform: "Web browser",
  genre: "Casual",
  playMode: "SinglePlayer",
  isAccessibleForFree: true,
  applicationCategory: "Game",
  publisher: { "@id": `${SITE}/#business` },
  description:
    "Interaktivt 3D-minispil: styr højtryksrenseren og vask bilen ren – fra Elite Vask, mobil bil dampvask på Sjælland.",
};

export default function GamePage() {
  return (
    <>
      <JsonLd
        items={[
          breadcrumbLd([
            { name: "Forside", path: "/" },
            { name: "Car Wash Game", path: "/game" },
          ]),
          gameLd,
        ]}
      />
      <GameClient />
    </>
  );
}
