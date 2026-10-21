import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import CityProcess from "@/components/CityProcess";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd, webPageLd } from "@/lib/seo";
export const metadata = {
  title: "Bilvask i Næstved – mobil dampvask og bilpleje | Elite Vask",
  description: "Professionel mobil dampvask i Næstved og omegn. Vi kører til din adresse – gratis kørsel, betal efter vask. Book online eller ring til os.",
  alternates: { canonical: "/bilvask/naestved" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: "Mobil bilvask i Næstved – Elite Vask",
    description: "Professionel mobil dampvask i Næstved. Vi kører direkte til dig.",
    type: "article",
    locale: "da_DK",
  },
};

export default function BilvaskNaestved() {
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:"Mobil bilvask i Næstved",path:"/bilvask/naestved"}]),cityServiceLd({city:"Næstved",path:"/bilvask/naestved"}),webPageLd({path:"/bilvask/naestved",name:"Mobil bilvask i Næstved – Elite Vask",description:"Mobil bil dampvask i Næstved. Vi kører til din adresse."})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Næstved</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør i Næstved og omegn</p>

        <p className="guide-lead">
          Elite Vask tilbyder mobil dampvask i Næstved og hele Næstved Kommune. Vi kører ud til dig med professionelt udstyr og vasker din bil på stedet – du behøver hverken køre nogen steder hen eller vente i kø.
        </p>

        <h2>Bilvask i Næstved – vi kommer til dig</h2>
        <p>
          Næstved er Sydsjællands største by, og mange bilister ønsker en professionel bilvask uden besværet med at finde et ledigt vaskested. Elite Vask tilbyder en nem løsning: vi aftaler et tidspunkt, kører ud til din adresse og leverer en grundig dampvask direkte på stedet.
        </p>
        <p>
          Vi betjener hele Næstved by og kommunen, herunder Fensmark, Glumsø, Rønnede, Holme-Olstrup og Toksværd. Kørsel er <strong>gratis</strong>.
        </p>

        <h2>Hvorfor dampvask er det rigtige valg</h2>
        <p>
          Traditionelle bilvaske i tunnelanlæg bruger roterende børster og store mængder vand med kemikalier. Over tid kan dette ridse lakken og nedbryde voksbehandlinger. Dampvask er en langt skånsomt metode:
        </p>
        <ul>
          <li>Ingen roterende børster – ingen ridser i lakken</li>
          <li>Op til 90% mindre vandforbrug end tunnelvask</li>
          <li>pH-neutrale, miljøvenlige produkter</li>
          <li>Desinficerer kabine og sæder effektivt</li>
          <li>Fjerner vejsalt, insekter og indgroet snavs</li>
        </ul>

        <h2>Pakker og priser</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – karosseri, fælge, dæk og ruder. Fra 500 kr.</li>
          <li><strong>Hele bilen (ind & ud)</strong> – komplet indvendig og udvendig behandling. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – alt inklusiv: motorrens, lakforsegling og dybdebehandling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Du betaler først, når du er tilfreds. Ingen forudbetaling. Gratis kørsel til Næstved og omegn.
        </p>

        <h2>Tilvalg og ekstraydelser</h2>
        <p>
          Du kan tilføje ekstraydelser til enhver pakke:
        </p>
        <ul>
          <li><strong>Motorrens</strong> – grundig afrensning af motorrum. 400 kr.</li>
          <li><strong>Lak- & glansbeskyttelse</strong> – langvarig ekstra glans. 300 kr.</li>
          <li><strong>Fjernelse af dyrehår</strong> – effektiv fjernelse af hår og fnug. 300 kr.</li>
          <li><strong>Sæderens (stof)</strong> – dybderens af stofsæder. 400 kr.</li>
        </ul>

        <h2>Elbiler i Næstved</h2>
        <p>
          Dampvask er den ideelle metode til elbiler. Vi bruger minimalt vand og undgår højtryk nær batteripakke og ladeporte. Mange ejere af Tesla, VW ID, Hyundai Ioniq og andre elbiler foretrækker netop dampvask for at beskytte elektronik og tætninger.
        </p>

        <CityProcess city="Næstved" />

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Kører I til hele Næstved Kommune?</strong><br/>
        Ja, vi dækker alle postnumre i kommunen – 4700 og omliggende.</p>
        <p><strong>Skal jeg være hjemme under vasken?</strong><br/>
        Nej. Bilen skal blot være tilgængelig. Mange kunder er på arbejde under vasken.</p>
        <p><strong>Hvad hvis vejret er dårligt?</strong><br/>
        Vi kontakter dig, hvis vejret er uegnet, og ombooke gratis til nærmeste ledige tid.</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book mobil bilvask i Næstved i dag</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book nu</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Service area</div>
        <h1>Mobile car wash in Næstved</h1>
        <p className="legal-updated">Elite Vask · Steam wash at your door in and around Næstved</p>

        <p className="guide-lead">
          Elite Vask offers mobile steam washing in Næstved and across Næstved Municipality. We come to you with professional equipment and wash your car on the spot – you don&apos;t need to drive anywhere or wait in a queue.
        </p>

        <h2>Car wash in Næstved – we come to you</h2>
        <p>
          Næstved is the largest town in South Zealand, and many drivers want a professional car wash without the hassle of finding a free wash bay. Elite Vask offers an easy solution: we agree a time, drive to your address and deliver a thorough steam wash right on the spot.
        </p>
        <p>
          We cover all of Næstved town and the municipality, including Fensmark, Glumsø, Rønnede, Holme-Olstrup and Toksværd. Travel is <strong>free</strong>.
        </p>

        <h2>Why steam washing is the right choice</h2>
        <p>
          Traditional tunnel car washes use rotating brushes and large amounts of water with chemicals. Over time this can scratch the paint and break down wax treatments. Steam washing is a far gentler method:
        </p>
        <ul>
          <li>No rotating brushes – no scratches in the paint</li>
          <li>Up to 90% less water use than a tunnel wash</li>
          <li>pH-neutral, eco-friendly products</li>
          <li>Effectively disinfects the cabin and seats</li>
          <li>Removes road salt, insects and ingrained dirt</li>
        </ul>

        <h2>Packages and prices</h2>
        <ul>
          <li><strong>Exterior wash</strong> – bodywork, rims, tyres and windows. From 500 kr.</li>
          <li><strong>Whole car (inside & out)</strong> – complete interior and exterior treatment. From 800 kr.</li>
          <li><strong>Gold package</strong> – all-inclusive: engine cleaning, paint sealant and deep treatment. From 2,000 kr.</li>
        </ul>
        <p>
          You only pay once you are satisfied. No prepayment. Free travel to Næstved and the surrounding area.
        </p>

        <h2>Add-ons and extra services</h2>
        <p>
          You can add extra services to any package:
        </p>
        <ul>
          <li><strong>Engine cleaning</strong> – thorough cleaning of the engine bay. 400 kr.</li>
          <li><strong>Paint & gloss protection</strong> – long-lasting extra shine. 300 kr.</li>
          <li><strong>Pet hair removal</strong> – effective removal of hair and lint. 300 kr.</li>
          <li><strong>Seat cleaning (fabric)</strong> – deep cleaning of fabric seats. 400 kr.</li>
        </ul>

        <h2>Electric cars in Næstved</h2>
        <p>
          Steam washing is the ideal method for electric cars. We use minimal water and avoid high pressure near the battery pack and charging ports. Many owners of Tesla, VW ID, Hyundai Ioniq and other electric cars prefer steam washing precisely to protect electronics and seals.
        </p>

        <CityProcess city="Næstved" />

        <h2>Frequently asked questions</h2>
        <p><strong>Do you travel to the whole of Næstved Municipality?</strong><br/>
        Yes, we cover all postcodes in the municipality – 4700 and the surrounding area.</p>
        <p><strong>Do I need to be at home during the wash?</strong><br/>
        No. The car just needs to be accessible. Many customers are at work during the wash.</p>
        <p><strong>What if the weather is bad?</strong><br/>
        We will contact you if the weather is unsuitable and rebook you free of charge for the nearest available time.</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book a mobile car wash in Næstved today</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book now</Link>
        </div>
          </>}
        />
        <RelatedLinks city="naestved" />
      </div>
    </div>
  );
}
