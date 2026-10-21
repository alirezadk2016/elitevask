import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import CityProcess from "@/components/CityProcess";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd, webPageLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: "Bilvask i Køge – mobil dampvask og bilpleje | Elite Vask",
  description: "Mobil dampvask i Køge og omegn. Vi kører til dig – gratis kørsel, betal efter vask. Skånsom dampvask uden ridser og med minimal miljøpåvirkning.",
  alternates: { canonical: "/bilvask/koege" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: "Mobil bilvask i Køge – Elite Vask",
    description: "Professionel mobil dampvask i Køge. Vi kører direkte til dig.",
    type: "article",
    locale: "da_DK",
  },
};

export default async function BilvaskKoege() {
  const hours = await getHours();
  const hd = hoursDisplay(hours, "da");
  const hdEn = hoursDisplay(hours, "en");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:"Mobil bilvask i Køge",path:"/bilvask/koege"}]),cityServiceLd({city:"Køge",path:"/bilvask/koege"}),webPageLd({path:"/bilvask/koege",name:"Mobil bilvask i Køge – Elite Vask",description:"Mobil bil dampvask i Køge. Vi kører til din adresse."})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Køge</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør i Køge og Køge Kommune</p>

        <p className="guide-lead">
          Leder du efter en professionel bilvask i Køge, der kommer til dig? Elite Vask tilbyder mobil dampvask i hele Køge Kommune – vi kører ud til din adresse og vasker bilen på stedet med professionelt udstyr.
        </p>

        <h2>Mobil bilvask i Køge – praktisk og professionelt</h2>
        <p>
          I Køge og omegn er der mange bilister, der ønsker en grundig bilvask uden besværet med at finde et ledigtvaskested og vente i kø. Elite Vask løser det problem: vi aftaler et tidspunkt med dig, kører ud og leverer en professionel dampvask direkte på stedet.
        </p>
        <p>
          Vi betjener hele Køge by og kommunen, herunder Ølsemagle, Bjæverskov, Ll. Skensved, Borup og Herfølge. Kørsel er altid <strong>gratis</strong>.
        </p>

        <h2>Dampvask – den bedste metode til biler i Køge</h2>
        <p>
          Mange biler i Køge-området er udsatte for vejsalt om vinteren og insekter om sommeren. Dampvask er særlig effektiv til begge: den varme damp opløser vejsalt i skjulte sprækker og hjulkasser og løsner fastsiddende insekter fra front og ruder – uden aggressive kemikalier.
        </p>
        <p>
          Vi bruger professionel damp ved høj temperatur og bløde mikrofiberklude – ingen roterende børster, der kan ridse lakken. Resultatet er en ren, skinnende bil og en beskyttet lak.
        </p>

        <h2>Priser på bilvask i Køge</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – komplet ydre dampvask inkl. fælge og dæk. Fra 500 kr.</li>
          <li><strong>Hele bilen (ind & ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel til Køge. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <h2>Vinter og saltskader – beskyt bilen i Køge</h2>
        <p>
          Vejsalt er en af de største trusler mod bilens karosseri og undervogn. Efter vintermånederne er det vigtigt at få fjernet salt fra skjulte steder under bilen, i hjulkasser og i sprækker. Vores dampvask inkluderer i Hel Bil og Guld pakken en grundig undervognsbehandling, der fjerner salt og forhindrer rust.
        </p>

        <CityProcess city="Køge" />

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Koster det noget at I kører til Køge?</strong><br/>
        Nej, kørsel til Køge og hele kommunen er gratis.</p>
        <p><strong>Vasker I leasingbiler inden aflevering?</strong><br/>
        Ja, vi klargør leasingbiler til aflevering med et professionelt resultat.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.text}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.text} – ring til os, så finder vi en tid.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book mobil bilvask i Køge i dag</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book nu</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Service area</div>
        <h1>Mobile car wash in Køge</h1>
        <p className="legal-updated">Elite Vask · Steam wash at your door in Køge and Køge Municipality</p>

        <p className="guide-lead">
          Looking for a professional car wash in Køge that comes to you? Elite Vask offers mobile steam washing across Køge Municipality – we drive to your address and wash the car on the spot with professional equipment.
        </p>

        <h2>Mobile car wash in Køge – practical and professional</h2>
        <p>
          Many drivers in and around Køge want a thorough car wash without the hassle of finding a free wash bay and waiting in line. Elite Vask solves that: we agree a time with you, drive out and deliver a professional steam wash right where the car is.
        </p>
        <p>
          We cover all of Køge town and the municipality, including Ølsemagle, Bjæverskov, Ll. Skensved, Borup and Herfølge. Travel is always <strong>free</strong>.
        </p>

        <h2>Steam washing – the best method for cars in Køge</h2>
        <p>
          Many cars in the Køge area are exposed to road salt in winter and insects in summer. Steam washing is especially effective against both: the hot steam dissolves road salt in hidden gaps and wheel arches and loosens stuck-on insects from the front and windows – without aggressive chemicals.
        </p>
        <p>
          We use professional high-temperature steam and soft microfibre cloths – no rotating brushes that can scratch the paint. The result is a clean, shiny car and protected paintwork.
        </p>

        <h2>Car wash prices in Køge</h2>
        <ul>
          <li><strong>Exterior wash</strong> – complete exterior steam wash incl. rims and tyres. From 500 kr.</li>
          <li><strong>Whole car (inside & out)</strong> – exterior and interior cleaning in one visit. From 800 kr.</li>
          <li><strong>Gold package</strong> – complete treatment incl. engine cleaning and paint sealant. From 2,000 kr.</li>
        </ul>
        <p>
          All prices include free travel to Køge. You pay <strong>after</strong> the wash, once you are satisfied.
        </p>

        <h2>Winter and salt damage – protect your car in Køge</h2>
        <p>
          Road salt is one of the biggest threats to a car's body and underside. After the winter months it is important to remove salt from hidden places under the car, in the wheel arches and in gaps. In the Whole car and Gold packages, our steam wash includes a thorough underbody treatment that removes salt and helps prevent rust.
        </p>

        <CityProcess city="Køge" />

        <h2>Frequently asked questions</h2>
        <p><strong>Does it cost anything for you to drive to Køge?</strong><br/>
        No, travel to Køge and the whole municipality is free.</p>
        <p><strong>Do you wash lease cars before they are returned?</strong><br/>
        Yes, we prepare lease cars for return with a professional result.</p>
        <p><strong>Can you come at the weekend?</strong><br/>
        {hdEn.weekendOpen
          ? <>Yes, we work {hdEn.text}.</>
          : <>Unfortunately we are closed at weekends, but we work {hdEn.text} – call us and we will find a time.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book a mobile car wash in Køge today</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book now</Link>
        </div>
          </>}
        />
        <RelatedLinks city="koege" />
      </div>
    </div>
  );
}
