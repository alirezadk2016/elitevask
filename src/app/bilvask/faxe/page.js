import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import CityProcess from "@/components/CityProcess";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd, webPageLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: 'Bilvask i Faxe – mobil dampvask og bilpleje | Elite Vask',
  description: 'Professionel mobil dampvask i Faxe og Haslev. Vi kører til din adresse i hele Faxe Kommune – gratis kørsel, ingen forudbetaling, betal efter vask.',
  alternates: { canonical: "/bilvask/faxe" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: 'Mobil bilvask i Faxe – Elite Vask',
    description: 'Professionel mobil dampvask i Faxe. Vi kører direkte til dig.',
    type: "article",
    locale: "da_DK",
  },
};

export default async function BilvaskFaxe() {
  const hours = await getHours();
  const hd = hoursDisplay(hours, "da");
  const hdEn = hoursDisplay(hours, "en");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:'Mobil bilvask i Faxe',path:"/bilvask/faxe"}]),cityServiceLd({city:'Faxe',path:"/bilvask/faxe"}),webPageLd({path:"/bilvask/faxe",name:"Mobil bilvask i Faxe – Elite Vask",description:"Mobil bil dampvask i Faxe. Vi kører til din adresse."})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Faxe Kommune</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør i Faxe, Haslev og omegn</p>

        <p className="guide-lead">
          I Faxe Kommune er afstanden til nærmeste kvalitetsvaskehal ofte lang. Elite Vask vender det om: Vi kører til dig – i Faxe, Haslev, Faxe Ladeplads, Karise og Rønnede – og leverer en professionel dampvask på din adresse, mens du laver noget andet.
        </p>

        <h2>Landevej, grus og landbrugsstøv</h2>
        <p>
          Mange biler i Faxe-området kører dagligt på landeveje og forbi marker. Det giver en særlig type snavs: fastbrændte insekter, vejfilm, støv og organisk materiale, der sætter sig i fronten og langs panelerne.
        </p>
        <p>
          Vores damp løsner den slags belægninger termisk, så de kan tørres af uden at gnide snavset rundt i lakken. Resultatet holder længere, fordi overfladen efterlades helt ren – ikke bare skyllet.
        </p>

        <h2>Fra Haslev til Faxe Ladeplads</h2>
        <p>
          Vi dækker hele kommunen: Faxe, Haslev, Faxe Ladeplads, Karise, Rønnede og Dalby. Kørsel er <strong>gratis</strong>, og du betaler først, når bilen er ren.
        </p>


        <h2>Priser på bilvask i Faxe</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – komplet ydre dampvask inkl. fælge og dæk. Fra 500 kr.</li>
          <li><strong>Hele bilen (ind &amp; ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <CityProcess city="Faxe" />

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Kommer I også til Haslev?</strong><br/>
        Ja, Haslev er en fast del af vores rute – ligesom resten af kommunen. Gratis kørsel.</p>
        <p><strong>Kan I tage en meget beskidt bil, der har kørt på grusvej?</strong><br/>
        Ja. Kraftig tilsmudsning kan kræve lidt ekstra tid, som vi aftaler på forhånd – men det er præcis den slags opgaver, dampen er bedst til.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.text}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.text} – ring til os, så finder vi en tid.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book mobil bilvask i Faxe i dag</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book nu</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Service area</div>
        <h1>Mobile car wash in Faxe Municipality</h1>
        <p className="legal-updated">Elite Vask · Steam wash at your door in Faxe, Haslev and the surrounding area</p>

        <p className="guide-lead">
          In Faxe Municipality, the nearest quality car wash is often a long way off. Elite Vask turns that around: we drive to you – in Faxe, Haslev, Faxe Ladeplads, Karise and Rønnede – and deliver a professional steam wash at your address while you get on with something else.
        </p>

        <h2>Country roads, gravel and farm dust</h2>
        <p>
          Many cars in the Faxe area drive daily on country roads and past fields. That creates a particular kind of dirt: baked-on insects, road film, dust and organic matter that settles on the front and along the panels.
        </p>
        <p>
          Our steam loosens these deposits thermally, so they can be wiped off without rubbing the dirt around in the paint. The result lasts longer because the surface is left completely clean – not just rinsed.
        </p>

        <h2>From Haslev to Faxe Ladeplads</h2>
        <p>
          We cover the whole municipality: Faxe, Haslev, Faxe Ladeplads, Karise, Rønnede and Dalby. Travel is <strong>free</strong>, and you only pay once the car is clean.
        </p>


        <h2>Car wash prices in Faxe</h2>
        <ul>
          <li><strong>Exterior wash</strong> – complete exterior steam wash incl. rims and tyres. From 500 kr.</li>
          <li><strong>Whole car (inside &amp; out)</strong> – exterior and interior cleaning in one visit. From 800 kr.</li>
          <li><strong>Gold package</strong> – complete treatment incl. engine cleaning and paint sealant. From 2,000 kr.</li>
        </ul>
        <p>
          All prices include free travel. You pay <strong>after</strong> the wash, once you are satisfied.
        </p>

        <CityProcess city="Faxe" />

        <h2>Frequently asked questions</h2>
        <p><strong>Do you also come to Haslev?</strong><br/>
        Yes, Haslev is a regular part of our route – just like the rest of the municipality. Free travel.</p>
        <p><strong>Can you take a very dirty car that has been driven on gravel roads?</strong><br/>
        Yes. Heavy soiling may require a little extra time, which we agree in advance – but this is exactly the kind of job steam is best at.</p>
        <p><strong>Can you come at the weekend?</strong><br/>
        {hdEn.weekendOpen
          ? <>Yes, we work {hdEn.text}.</>
          : <>Unfortunately we are closed at weekends, but we work {hdEn.text} – call us and we will find a time.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book a mobile car wash in Faxe today</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book now</Link>
        </div>
          </>}
        />
        <RelatedLinks city="faxe" />
      </div>
    </div>
  );
}
