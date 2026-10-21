import Link from "next/link";
import DanishOnlyNotice from "@/components/DanishOnlyNotice";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, webPageLd, SITE } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";

export const metadata = {
  title: "Om Elite Vask – mobil bil dampvask i hele Sjælland",
  description: "Elite Vask er et lokalt firma med speciale i mobil dampvask. Vi kører ud i hele Sjælland med professionelt udstyr, og du betaler først, når bilen er ren.",
  alternates: { canonical: "/om-os" },
  openGraph: {
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: "Om Elite Vask",
    description: "Lokalt firma med speciale i mobil dampvask på Sjælland.",
    type: "website",
    locale: "da_DK",
    url: "/om-os",
  },
};

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Om Elite Vask",
  url: `${SITE}/om-os`,
  inLanguage: "da-DK",
  about: { "@id": `${SITE}/#business` },
  mainEntity: { "@id": `${SITE}/#business` },
};

const P = { color: "var(--muted)", fontSize: 15.5, lineHeight: 1.75, marginBottom: 14 };
const H2 = { fontSize: 22, fontWeight: 800, color: "#fff", margin: "36px 0 14px" };

/* Every statement here is one the site already makes elsewhere (homepage
   "Hvem er Elite Vask?", /kontakt, /handelsbetingelser, layout JSON-LD).
   Nothing about people or history is included until the owner supplies it. */
export default async function OmOs() {
  const hd = hoursDisplay(await getHours(), "da");
  return (
    <div className="legal-page">
      <JsonLd items={[
        breadcrumbLd([{ name: "Forside", path: "/" }, { name: "Om os", path: "/om-os" }]),
        aboutLd,
        webPageLd({ path: "/om-os", name: "Om Elite Vask", description: metadata.description }),
      ]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back">← Tilbage til forsiden</Link>
        <DanishOnlyNotice />

        <div className="guide-eyebrow">Om os</div>
        <h1 id="about">Om Elite Vask</h1>
        <p className="guide-lead">
          Elite Vask er et lokalt firma med speciale i mobil dampvask. Vi kører ud i hele Sjælland med
          professionelt udstyr, damprenser bilen der hvor den holder – og du betaler først, når bilen er ren.
        </p>

        <h2 style={H2}>Hvad vi laver</h2>
        <p style={P}>
          Vi vasker biler ind og ud med damp. Damp ved høj temperatur løsner snavs fra lak, fælge, sæder og
          måtter uden børster, højtryk eller skrappe kemikalier, og en vask bruger 1–3 liter vand. Derfor kan vi
          gøre det i en indkørsel, på en parkeringsplads eller foran kontoret – uden afløb og uden vandpyt.
        </p>
        <ul style={{ ...P, paddingLeft: 20 }}>
          <li>Udvendig vask, indvendig rens, hele bilen eller Guld pakke</li>
          <li>Tilvalg som motorrens, lak- og glansbeskyttelse og fjernelse af dyrehår</li>
          <li>Personbiler, SUV&apos;er og varebiler</li>
        </ul>

        <h2 style={H2}>Fakta om virksomheden</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="steam-table" style={{ minWidth: 0 }}>
            <tbody>
              <tr><th scope="row">Navn</th><td>Elite Vask</td></tr>
              <tr><th scope="row">CVR</th><td>46392264</td></tr>
              <tr><th scope="row">Område</th><td>Hele Sjælland (postnr. 1000–4799)</td></tr>
              <tr><th scope="row">Åbningstider</th><td>{hd.days} {hd.time}, eller efter aftale</td></tr>
              <tr><th scope="row">Udstyr</th><td>Optima Steamer XD2 – professionel damprenser med kontinuerlig damp</td></tr>
              <tr><th scope="row">Betaling</th><td>MobilePay, bankoverførsel eller kontant – efter vasken</td></tr>
              <tr><th scope="row">Kontakt</th><td><a href="tel:+4524440321" style={{ color: "var(--green)", display: "inline-flex", alignItems: "center", minHeight: 44 }}>+45 24 44 03 21</a> · <a href="mailto:info@elite-vask.dk" style={{ color: "var(--green)", display: "inline-flex", alignItems: "center", minHeight: 44 }}>info@elite-vask.dk</a></td></tr>
            </tbody>
          </table>
        </div>

        <h2 style={H2}>Sådan arbejder vi</h2>
        <ol style={{ ...P, paddingLeft: 20 }}>
          <li>Du vælger biltype og pakke og booker en tid online – du får bekræftelse på e-mail med det samme.</li>
          <li>Dagen før får du en påmindelse. Du behøver ikke være hjemme, så længe vi kan komme til bilen.</li>
          <li>Vi kører ud med alt udstyr, vand og strøm. En behandling tager typisk 1–3 timer.</li>
          <li>Du betaler, når bilen er færdig og du er tilfreds. Ingen forudbetaling.</li>
        </ol>

        <h2 style={H2}>Kontakt og vilkår</h2>
        <p style={P}>
          Har du spørgsmål, så <Link href="/kontakt" style={{ color: "var(--green)" }}>kontakt os</Link>.
          Læs også vores <Link href="/handelsbetingelser" rel="terms-of-service" style={{ color: "var(--green)" }}>handelsbetingelser</Link> og
          vores <Link href="/privatpolitik" rel="privacy-policy" style={{ color: "var(--green)" }}>privatlivspolitik</Link>.
        </p>

        <div className="guide-cta-box">
          <p style={{ margin: "0 0 1rem", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>Klar til en ren bil?</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book</Link>
        </div>
        <RelatedLinks />
      </div>
    </div>
  );
}
