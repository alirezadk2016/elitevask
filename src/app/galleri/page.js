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
    images: [{ url: "/gallery/steam-bmw.jpg", width: 1200, height: 630 }],
  },
};

export default function GalleriPage() {
  return <GalleryClient />;
}
