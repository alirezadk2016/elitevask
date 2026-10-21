import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import CityProcess from "@/components/CityProcess";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd, webPageLd } from "@/lib/seo";
export const metadata = {
  title: "Bilvask i Ringsted – mobil dampvask og bilpleje | Elite Vask",
  description: "Professionel mobil dampvask i Ringsted. Vi kører til din adresse – gratis kørsel, betal efter vask. Skånsom dampvask uden ridser. Book online.",
  alternates: { canonical: "/bilvask/ringsted" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: "Mobil bilvask i Ringsted – Elite Vask",
    description: "Professionel mobil dampvask i Ringsted. Vi kører direkte til dig.",
    type: "article",
    locale: "da_DK",
  },
};

export default function BilvaskRingsted() {
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:"Mobil bilvask i Ringsted",path:"/bilvask/ringsted"}]),cityServiceLd({city:"Ringsted",path:"/bilvask/ringsted"}),webPageLd({path:"/bilvask/ringsted",name:"Mobil bilvask i Ringsted – Elite Vask",description:"Mobil bil dampvask i Ringsted. Vi kører til din adresse."})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Ringsted</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør i Ringsted og omegn</p>

        <p className="guide-lead">
          Elite Vask tilbyder professionel mobil dampvask i Ringsted og Ringsted Kommune. Vi kører direkte til din adresse – hjemme, på arbejdet eller ved sommerhuset – og leverer en grundig, skånsom bilvask med professionelt udstyr.
        </p>

        <h2>Bilvask i Ringsted – uden at du behøver flytte dig</h2>
        <p>
          Ringsted ligger centralt på Sjælland og er et knudepunkt for pendlere og erhvervsdrivende. Mange ønsker en professionel bilvask, men har ikke tid til at stå i kø ved en tunnelvask. Med Elite Vask er det simpelt: vi aftaler tid, kører ud og vasker bilen på stedet.
        </p>
        <p>
          Vi dækker hele Ringsted by og kommunen, herunder Benløse, Gyrstinge, Kværkeby og Haraldsted. Kørsel er <strong>gratis</strong>.
        </p>

        <h2>Professionel dampvask – hvad det betyder for din bil</h2>
        <p>
          Dampvask er en avanceret rengøringsmetode, der bruger varm damp ved høj temperatur til mekanisk at løsne snavs, fedt, vejsalt og insekter – uden brug af store mængder vand og uden aggressive kemikalier.
        </p>
        <p>
          For din bil betyder det:
        </p>
        <ul>
          <li><strong>Ingen ridser</strong> – ingen roterende børster der kan beskadige lakken</li>
          <li><strong>Dybere rens</strong> – damp trænger ind i sprækker og hjulkasser</li>
          <li><strong>Hygiejnisk kabine</strong> – damp desinficerer sæder og overflader effektivt</li>
          <li><strong>Miljøvenligt</strong> – op til 90% mindre vandforbrug end tunnelvask</li>
        </ul>

        <h2>Vores pakker og priser i Ringsted</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – karosseri, fælge, dæk, ruder. Fra 500 kr.</li>
          <li><strong>Hele bilen (ind & ud)</strong> – komplet behandling. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Du betaler efter vasken. Gratis kørsel til Ringsted og omegn. <strong>Ingen forudbetaling.</strong>
        </p>

        <h2>Firmabiler og flådevask i Ringsted</h2>
        <p>
          Ringsted er hjemsted for mange virksomheder med firmabiler og varevogne. Elite Vask tilbyder erhvervsaftaler til virksomheder, der har behov for regelmæssig vask af én eller flere biler. Kontakt os på <a href="mailto:info@elite-vask.dk">info@elite-vask.dk</a> for et tilbud.
        </p>

        <h2>Varebiler og kassevogne</h2>
        <p>
          Vi vasker alle typer køretøjer, herunder varebiler, kassevogne og større erhvervskøretøjer. Varebil-pakken starter fra 1.400 kr. for hel bil og inkluderer grundig indvendig og udvendig rens.
        </p>

        <CityProcess city="Ringsted" />

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Koster det noget at I kører til Ringsted?</strong><br/>
        Nej, kørsel til Ringsted og alle adresser i kommunen er gratis.</p>
        <p><strong>Kan I vaske varebiler?</strong><br/>
        Ja, vi har erfaring med alle typer køretøjer inkl. varebiler og kassevogne.</p>
        <p><strong>Tilbyder I erhvervsaftaler?</strong><br/>
        Ja, kontakt os på info@elite-vask.dk for et skræddersyet tilbud til din virksomhed.</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book mobil bilvask i Ringsted i dag</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book nu</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Service area</div>
        <h1>Mobile car wash in Ringsted</h1>
        <p className="legal-updated">Elite Vask · Steam wash at your door in Ringsted and the surrounding area</p>

        <p className="guide-lead">
          Elite Vask offers professional mobile steam washing in Ringsted and Ringsted Municipality. We drive straight to your address – at home, at work or at the summer house – and deliver a thorough, gentle car wash with professional equipment.
        </p>

        <h2>Car wash in Ringsted – without you having to move</h2>
        <p>
          Ringsted is centrally located on Zealand and is a hub for commuters and businesses. Many people want a professional car wash but do not have time to queue at a tunnel wash. With Elite Vask it is simple: we agree a time, drive out and wash the car on the spot.
        </p>
        <p>
          We cover all of Ringsted town and the municipality, including Benløse, Gyrstinge, Kværkeby and Haraldsted. Travel is <strong>free</strong>.
        </p>

        <h2>Professional steam washing – what it means for your car</h2>
        <p>
          Steam washing is an advanced cleaning method that uses hot, high-temperature steam to mechanically loosen dirt, grease, road salt and insects – without large amounts of water and without aggressive chemicals.
        </p>
        <p>
          For your car, this means:
        </p>
        <ul>
          <li><strong>No scratches</strong> – no rotating brushes that can damage the paint</li>
          <li><strong>Deeper cleaning</strong> – steam penetrates gaps and wheel arches</li>
          <li><strong>Hygienic cabin</strong> – steam effectively disinfects seats and surfaces</li>
          <li><strong>Eco-friendly</strong> – up to 90% less water than a tunnel wash</li>
        </ul>

        <h2>Our packages and prices in Ringsted</h2>
        <ul>
          <li><strong>Exterior wash</strong> – bodywork, rims, tyres, windows. From 500 kr.</li>
          <li><strong>Whole car (inside & out)</strong> – complete treatment. From 800 kr.</li>
          <li><strong>Gold package</strong> – incl. engine cleaning and paint sealant. From 2,000 kr.</li>
        </ul>
        <p>
          You pay after the wash. Free travel to Ringsted and the surrounding area. <strong>No prepayment.</strong>
        </p>

        <h2>Company cars and fleet washing in Ringsted</h2>
        <p>
          Ringsted is home to many businesses with company cars and vans. Elite Vask offers business agreements to companies that need regular washing of one or more vehicles. Contact us at <a href="mailto:info@elite-vask.dk">info@elite-vask.dk</a> for a quote.
        </p>

        <h2>Vans and panel vans</h2>
        <p>
          We wash all types of vehicles, including vans, panel vans and larger commercial vehicles. The van package starts from 1,400 kr. for the whole vehicle and includes thorough interior and exterior cleaning.
        </p>

        <CityProcess city="Ringsted" />

        <h2>Frequently asked questions</h2>
        <p><strong>Does it cost anything for you to drive to Ringsted?</strong><br/>
        No, travel to Ringsted and all addresses in the municipality is free.</p>
        <p><strong>Can you wash vans?</strong><br/>
        Yes, we have experience with all types of vehicles, including vans and panel vans.</p>
        <p><strong>Do you offer business agreements?</strong><br/>
        Yes, contact us at info@elite-vask.dk for a tailored quote for your business.</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book a mobile car wash in Ringsted today</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book now</Link>
        </div>
          </>}
        />
        <RelatedLinks city="ringsted" />
      </div>
    </div>
  );
}
