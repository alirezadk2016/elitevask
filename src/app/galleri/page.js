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
  return (
    <>
      <GalleryClient />
      {/* Server-rendered, below the gallery. The page was 91 words: the photos
          are the content for a human, but a crawler sees almost nothing, and
          the before/after shots need a caption explaining what is actually
          being looked at. */}
      <section className="gal-section" style={{ maxWidth: 780, margin: "0 auto", padding: "8px 20px 56px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 14px" }}>
          Hvad er det, du kigger på?
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.75, marginBottom: 14 }}>
          Alle billederne på denne side er fra rigtige opgaver hjemme hos kunder på
          Sjælland – ikke showroom-biler og ikke lånte pressefotos. Før-billedet er
          taget da vi kom, efter-billedet samme dag inden vi kørte igen. Det er
          derfor lyset og vinklen ikke altid er perfekt: de er taget i en indkørsel,
          ikke i et studie.
        </p>
        <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.75, marginBottom: 14 }}>
          De fleste af de indvendige billeder er sæder, måtter og loft behandlet med
          damp ved omkring 145 °C. Damp løsner snavs og fedt uden skrappe kemikalier,
          og fordi der bruges 1–3 liter vand mod cirka 200 liter ved en almindelig
          vask, kan det gøres hvor bilen holder – uden afløb og uden vandpyt.
        </p>
        <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.75, margin: 0 }}>
          Udvendigt handler det mest om at fjerne vejsalt, insekter og trafikfilm
          uden at trække ridser i lakken. Vil du vide hvorfor den forskel betyder
          noget, forklarer vi det i{" "}
          <a href="/guide/dampvask-vs-traditionel" style={{ color: "var(--green)" }}>
            dampvask vs. traditionel bilvask
          </a>.
        </p>
      </section>
    </>
  );
}
