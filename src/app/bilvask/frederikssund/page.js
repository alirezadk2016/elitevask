import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import CityProcess from "@/components/CityProcess";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd, webPageLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: 'Bilvask i Frederikssund – mobil dampvask | Elite Vask',
  description: 'Professionel mobil dampvask i Frederikssund, Slangerup, Skibby og Jægerspris. Vi kører til dig – gratis kørsel, dampvask uden ridser.',
  alternates: { canonical: "/bilvask/frederikssund" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: 'Mobil bilvask i Frederikssund – Elite Vask',
    description: 'Professionel mobil dampvask i Frederikssund. Vi kører direkte til dig.',
    type: "article",
    locale: "da_DK",
  },
};

export default async function BilvaskFrederikssund() {
  const hours = await getHours();
  const hd = hoursDisplay(hours, "da");
  const hdEn = hoursDisplay(hours, "en");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:'Mobil bilvask i Frederikssund',path:"/bilvask/frederikssund"}]),cityServiceLd({city:'Frederikssund',path:"/bilvask/frederikssund"}),webPageLd({path:"/bilvask/frederikssund",name:"Mobil bilvask i Frederikssund – Elite Vask",description:"Mobil bil dampvask i Frederikssund. Vi kører til din adresse."})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Frederikssund</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør ved Roskilde Fjord</p>

        <p className="guide-lead">
          Elite Vask kører i hele Frederikssund Kommune – Frederikssund by, Slangerup, Skibby og Jægerspris. Vi dampvasker bilen på din adresse med professionelt udstyr, og du betaler først, når du har set resultatet.
        </p>

        <h2>Fjordluft og efterårsføre</h2>
        <p>
          Tæt på Roskilde Fjord får bilerne både fugtig, saltholdig luft og – i efterårsmånederne – våde, bladfyldte veje. Kombinationen sætter sig som en grålig vejfilm, alger på listerne og salt i hjulkasserne.
        </p>
        <p>
          Dampvasken fjerner alle tre dele i én behandling: varm damp i hjulkasser og sprækker, skånsom aftørring af lakken og rens af lister og kanter.
        </p>

        <h2>Hornsherred er også med</h2>
        <p>
          Vi dækker begge sider af fjorden – også Skibby, Jægerspris og resten af Hornsherred. Kørsel er <strong>gratis</strong> i hele kommunen.
        </p>


        <h2>Priser på bilvask i Frederikssund</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – komplet ydre dampvask inkl. fælge og dæk. Fra 500 kr.</li>
          <li><strong>Hele bilen (ind &amp; ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <CityProcess city="Frederikssund" />

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Kører I over broen til Hornsherred?</strong><br/>
        Ja, Skibby, Jægerspris og hele Hornsherred er en del af vores faste område. Kørsel er gratis.</p>
        <p><strong>Hvor lang tid tager en vask?</strong><br/>
        Fra ca. 2 timer for en lille bil (udvendig) til 4 timer for en stor bil med Guld pakken. Du får et præcist estimat, når du booker.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.text}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.text} – ring til os, så finder vi en tid.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book mobil bilvask i Frederikssund i dag</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book nu</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Service area</div>
        <h1>Mobile car wash in Frederikssund</h1>
        <p className="legal-updated">Elite Vask · Steam wash at your door by Roskilde Fjord</p>

        <p className="guide-lead">
          Elite Vask covers all of Frederikssund Municipality – Frederikssund town, Slangerup, Skibby and Jægerspris. We steam wash your car at your address with professional equipment, and you only pay once you have seen the result.
        </p>

        <h2>Fjord air and autumn roads</h2>
        <p>
          Close to Roskilde Fjord, cars are exposed both to damp, salty air and – in the autumn months – to wet, leaf-covered roads. The combination settles as a greyish road film, algae on the trim and salt in the wheel arches.
        </p>
        <p>
          Our steam wash removes all three in a single treatment: hot steam in the wheel arches and gaps, gentle drying of the paintwork and cleaning of trim and edges.
        </p>

        <h2>Hornsherred is included too</h2>
        <p>
          We cover both sides of the fjord – including Skibby, Jægerspris and the rest of Hornsherred. Travel is <strong>free</strong> throughout the municipality.
        </p>


        <h2>Car wash prices in Frederikssund</h2>
        <ul>
          <li><strong>Exterior wash</strong> – complete exterior steam wash incl. rims and tyres. From 500 kr.</li>
          <li><strong>Whole car (inside &amp; out)</strong> – exterior and interior cleaning in one visit. From 800 kr.</li>
          <li><strong>Gold package</strong> – complete treatment incl. engine cleaning and paint sealant. From 2,000 kr.</li>
        </ul>
        <p>
          All prices include free travel. You pay <strong>after</strong> the wash, once you are satisfied.
        </p>

        <CityProcess city="Frederikssund" />

        <h2>Frequently asked questions</h2>
        <p><strong>Do you drive over the bridge to Hornsherred?</strong><br/>
        Yes, Skibby, Jægerspris and all of Hornsherred are part of our regular area. Travel is free.</p>
        <p><strong>How long does a wash take?</strong><br/>
        From approx. 2 hours for a small car (exterior) to 4 hours for a large car with the Gold package. You get a precise estimate when you book.</p>
        <p><strong>Can you come at the weekend?</strong><br/>
        {hdEn.weekendOpen
          ? <>Yes, we work {hdEn.text}.</>
          : <>Unfortunately we are closed at weekends, but we work {hdEn.text} – call us and we will find a time.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book a mobile car wash in Frederikssund today</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book now</Link>
        </div>
          </>}
        />
        <RelatedLinks city="frederikssund" />
      </div>
    </div>
  );
}
