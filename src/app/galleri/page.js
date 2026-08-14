import GalleryClient from "@/components/GalleryClient";

export const metadata = {
  title: "Galleri – før & efter | Elite Vask mobil bilpleje",
  description: "Se vores arbejde: før & efter af professionel mobil bilvask og bilpleje på Sjælland. Ægte resultater fra bilvask hjemme hos kunden.",
  alternates: { canonical: "/galleri" },
  openGraph: {
    title: "Galleri – før & efter | Elite Vask",
    description: "Før & efter af professionel mobil bilpleje på Sjælland.",
    url: "https://www.elite-vask.dk/galleri",
    type: "website",
    locale: "da_DK",
    // Landscape hero: correct 1.91:1 card ratio. (steam-bmw.jpg is 1200x1600
    // portrait — declaring it as 1200x630 made previews render distorted.)
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
  },
};

export default function GalleriPage() {
  return <GalleryClient />;
}
