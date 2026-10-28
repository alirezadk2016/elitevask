import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, webPageLd, SITE } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
import { getSettings } from "@/lib/getSettings";
import { phoneTel } from "@/lib/settings";

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
  const st = await getSettings();
  const tel = phoneTel(st.phone);
  const hours = await getHours();
  const hd = hoursDisplay(hours, "da");
  const hdEn = hoursDisplay(hours, "en");
  return (
    <div className="legal-page">
      <JsonLd items={[
        breadcrumbLd([{ name: "Forside", path: "/" }, { name: "Om os", path: "/om-os" }]),
        aboutLd,
        webPageLd({ path: "/om-os", name: "Om Elite Vask", description: metadata.description }),
      ]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>

        <Bi da={<>
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
              <tr><th scope="row">Åbningstider</th><td>{hd.text.charAt(0).toUpperCase() + hd.text.slice(1)}, eller efter aftale</td></tr>
              <tr><th scope="row">Udstyr</th><td>Optima Steamer XD2 – professionel damprenser med kontinuerlig damp</td></tr>
              <tr><th scope="row">Betaling</th><td>MobilePay, bankoverførsel eller kontant – efter vasken</td></tr>
              <tr><th scope="row">Kontakt</th><td><a href={`tel:${tel}`} style={{ color: "var(--green)", display: "inline-flex", alignItems: "center", minHeight: 44 }}>{st.phone}</a> · <a href={`mailto:${st.email}`} style={{ color: "var(--green)", display: "inline-flex", alignItems: "center", minHeight: 44 }}>{st.email}</a></td></tr>
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
        </>} en={<>
<div className="guide-eyebrow">About us</div>
        <h1 id="about">About Elite Vask</h1>
        <p className="guide-lead">
          Elite Vask is a local company specialising in mobile steam washing. We drive out across all of Zealand with
          professional equipment, steam-clean the car wherever it is parked – and you only pay once the car is clean.
        </p>

        <h2 style={H2}>What we do</h2>
        <p style={P}>
          We wash cars inside and out with steam. High-temperature steam loosens dirt from paintwork, wheels, seats and
          mats without brushes, pressure washers or harsh chemicals, and a wash uses 1–3 litres of water. That is why we can
          do it on a driveway, in a car park or outside the office – with no drain and no puddles.
        </p>
        <ul style={{ ...P, paddingLeft: 20 }}>
          <li>Exterior wash, interior clean, whole car or Gold package</li>
          <li>Extras such as engine cleaning, paint and gloss protection and pet hair removal</li>
          <li>Cars, SUVs and vans</li>
        </ul>

        <h2 style={H2}>Company facts</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="steam-table" style={{ minWidth: 0 }}>
            <tbody>
              <tr><th scope="row">Name</th><td>Elite Vask</td></tr>
              <tr><th scope="row">CVR (company no.)</th><td>46392264</td></tr>
              <tr><th scope="row">Area</th><td>All of Zealand (postcodes 1000–4799)</td></tr>
              <tr><th scope="row">Opening hours</th><td>{hdEn.text.charAt(0).toUpperCase() + hdEn.text.slice(1)}, or by appointment</td></tr>
              <tr><th scope="row">Equipment</th><td>Optima Steamer XD2 – professional steam cleaner with continuous steam</td></tr>
              <tr><th scope="row">Payment</th><td>MobilePay, bank transfer or cash – after the wash</td></tr>
              <tr><th scope="row">Contact</th><td><a href={`tel:${tel}`} style={{ color: "var(--green)", display: "inline-flex", alignItems: "center", minHeight: 44 }}>{st.phone}</a> · <a href={`mailto:${st.email}`} style={{ color: "var(--green)", display: "inline-flex", alignItems: "center", minHeight: 44 }}>{st.email}</a></td></tr>
            </tbody>
          </table>
        </div>

        <h2 style={H2}>How we work</h2>
        <ol style={{ ...P, paddingLeft: 20 }}>
          <li>You choose your car type and package and book a time online – you get a confirmation by e-mail straight away.</li>
          <li>You get a reminder the day before. You do not need to be at home, as long as we can get to the car.</li>
          <li>We bring all the equipment, water and power. A treatment typically takes 1–3 hours.</li>
          <li>You pay when the car is finished and you are happy. No prepayment.</li>
        </ol>

        <h2 style={H2}>Contact and terms</h2>
        <p style={P}>
          If you have any questions, please <Link href="/kontakt" style={{ color: "var(--green)" }}>contact us</Link>.
          Please also read our <Link href="/handelsbetingelser" rel="terms-of-service" style={{ color: "var(--green)" }}>terms and conditions</Link> and
          our <Link href="/privatpolitik" rel="privacy-policy" style={{ color: "var(--green)" }}>privacy policy</Link>.
        </p>

        <div className="guide-cta-box">
          <p style={{ margin: "0 0 1rem", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>Ready for a clean car?</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book</Link>
        </div>
        </>} />

        <RelatedLinks />
      </div>
    </div>
  );
}
