import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, webPageLd, SITE } from "@/lib/seo";

/* Service page for "klargøring af bil" (preparing a car for sale / return).
 * Search Console showed "klargøring af bil køge" with 69 impressions and no
 * page answering it; the owner confirmed Elite Vask does this work. Only
 * facts the rest of the site already states are used: the packages, their
 * "fra" prices, steam + microfibre, free driving, pay after the wash. */
export const metadata = {
  title: "Klargøring af bil til salg – mobil dampvask | Elite Vask",
  description: "Klargøring af bil til salg: vi damprenser bilen ind og ud hjemme hos dig, så den står skarpt til fremvisning og billeder. Fra 800 kr., gratis kørsel.",
  alternates: { canonical: "/klargoering-af-bil" },
  openGraph: {
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: "Klargøring af bil til salg – Elite Vask",
    description: "Vi damprenser bilen ind og ud hjemme hos dig, så den står skarpt til salg.",
    type: "article",
    locale: "da_DK",
  },
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Klargøring af bil til salg",
  serviceType: "Car detailing",
  provider: { "@id": `${SITE}/#business` },
  areaServed: "Sjælland",
  url: `${SITE}/klargoering-af-bil`,
  offers: { "@type": "AggregateOffer", priceCurrency: "DKK", lowPrice: 800 },
};

export default function KlargoeringAfBil() {
  return (
    <div className="legal-page">
      <JsonLd items={[
        breadcrumbLd([{ name: "Forside", path: "/" }, { name: "Klargøring af bil", path: "/klargoering-af-bil" }]),
        serviceLd,
        webPageLd({ path: "/klargoering-af-bil", name: "Klargøring af bil til salg – Elite Vask", description: "Klargøring af bil til salg med mobil dampvask på hele Sjælland." }),
      ]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>
            <div className="guide-eyebrow">Ydelse</div>
            <h1>Klargøring af bil til salg</h1>
            <p className="legal-updated">Elite Vask · Mobil dampvask på hele Sjælland</p>

            <p className="guide-lead">
              Klargøring af bil betyder, at bilen bliver gjort grundigt ren indvendigt og udvendigt, så den står skarpt, når den skal sælges, fotograferes eller afleveres. Elite Vask kommer til din adresse og damprenser bilen på stedet – fra 800 kr., med gratis kørsel, og du betaler først, når bilen er ren.
            </p>

            <h2>Hvad indgår i klargøringen?</h2>
            <ul>
              <li><strong>Udvendigt</strong> – dampvask af lak, fælge og dæk med bløde mikrofiberklude, uden børster der kan ridse.</li>
              <li><strong>Indvendigt</strong> – rengøring af kabine, sæder, gulve og overflader.</li>
              <li><strong>Tilvalg</strong> – sæderens, fjernelse af dyrehår og motorrens, når bilen skal stå helt skarpt.</li>
            </ul>

            <h2>Hvilken pakke skal jeg vælge?</h2>
            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead><tr><th>Behov</th><th>Pakke</th><th>Pris</th></tr></thead>
                <tbody>
                  <tr><td>Bilen skal se pæn ud til fremvisning</td><td>Hele bilen (ind &amp; ud)</td><td>Fra 800 kr.</td></tr>
                  <tr><td>Bilen skal stå helt skarpt til salg eller billeder</td><td>Guld pakke – inkl. motorrens og lakforsegling</td><td>Fra 2.000 kr.</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Prisen afhænger af biltypen. Se alle pakker og priser på siden med{" "}
              <a href="/priser">priser på mobil bilvask</a>.
            </p>

            <h2>Sådan foregår det</h2>
            <ol>
              <li><strong>Book online.</strong> Vælg biltype og pakke, og find en ledig tid.</li>
              <li><strong>Vi kommer til dig.</strong> Hjemme, på arbejdet eller hvor bilen holder – kørslen er gratis.</li>
              <li><strong>Bilen bliver klargjort.</strong> Med damp og mikrofiber, og med kun 1–3 liter vand.</li>
              <li><strong>Du betaler bagefter.</strong> Ingen forudbetaling.</li>
            </ol>

            <h2>Ofte stillede spørgsmål</h2>
            <h3>Klargør I også leasingbiler til aflevering?</h3>
            <p>Ja, vi klargør leasingbiler til aflevering, så bilen fremstår ren og velholdt.</p>
            <h3>Kommer I i hele Sjælland?</h3>
            <p>Ja, vi kører ud i hele Sjælland, fx <a href="/bilvask/koege">Køge</a>, <a href="/bilvask/roskilde">Roskilde</a> og <a href="/bilvask/koebenhavn">København</a>, og kørslen er altid gratis.</p>
            <h3>Kan I fjerne dyrehår før salget?</h3>
            <p>Ja, fjernelse af dyrehår kan lægges til enhver pakke.</p>

            <div className="guide-cta-box">
              <p style={{ margin: "0 0 1rem", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>Book klargøring af din bil</p>
              <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book nu</Link>
            </div>
          </>}
          en={<>
            <div className="guide-eyebrow">Service</div>
            <h1>Preparing a car for sale</h1>
            <p className="legal-updated">Elite Vask · Mobile steam washing across Zealand</p>

            <p className="guide-lead">
              Car preparation means the car is cleaned thoroughly inside and out, so it looks its best when it is sold, photographed or returned. Elite Vask comes to your address and steam-cleans the car on the spot – from 800 kr., with free travel, and you only pay once the car is clean.
            </p>

            <h2>What is included?</h2>
            <ul>
              <li><strong>Exterior</strong> – steam wash of paintwork, rims and tyres with soft microfibre cloths, no brushes that can scratch.</li>
              <li><strong>Interior</strong> – cleaning of the cabin, seats, floors and surfaces.</li>
              <li><strong>Add-ons</strong> – seat cleaning, pet hair removal and engine cleaning, when the car has to look perfect.</li>
            </ul>

            <h2>Which package should I choose?</h2>
            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead><tr><th>Need</th><th>Package</th><th>Price</th></tr></thead>
                <tbody>
                  <tr><td>The car should look tidy for viewings</td><td>Whole car (inside &amp; out)</td><td>From 800 kr.</td></tr>
                  <tr><td>The car should look perfect for sale or photos</td><td>Gold package – incl. engine cleaning and paint sealant</td><td>From 2,000 kr.</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              The price depends on the car type. See all packages and prices on the page with{" "}
              <a href="/priser">mobile car wash prices</a>.
            </p>

            <h2>How it works</h2>
            <ol>
              <li><strong>Book online.</strong> Choose car type and package, and pick an available time.</li>
              <li><strong>We come to you.</strong> At home, at work or wherever the car is parked – travel is free.</li>
              <li><strong>The car is prepared.</strong> With steam and microfibre, using only 1–3 litres of water.</li>
              <li><strong>You pay afterwards.</strong> No prepayment.</li>
            </ol>

            <h2>Frequently asked questions</h2>
            <h3>Do you also prepare lease cars for return?</h3>
            <p>Yes, we prepare lease cars for return, so the car looks clean and well kept.</p>
            <h3>Do you cover all of Zealand?</h3>
            <p>Yes, we drive out across Zealand, e.g. <a href="/bilvask/koege">Køge</a>, <a href="/bilvask/roskilde">Roskilde</a> and <a href="/bilvask/koebenhavn">Copenhagen</a>, and travel is always free.</p>
            <h3>Can you remove pet hair before the sale?</h3>
            <p>Yes, pet hair removal can be added to any package.</p>

            <div className="guide-cta-box">
              <p style={{ margin: "0 0 1rem", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>Book preparation of your car</p>
              <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book now</Link>
            </div>
          </>}
        />
        <RelatedLinks />
      </div>
    </div>
  );
}
