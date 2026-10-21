import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import CityProcess from "@/components/CityProcess";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd, webPageLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: 'Bilvask i Helsingør – mobil dampvask og bilpleje | Elite Vask',
  description: 'Professionel mobil dampvask i Helsingør, Espergærde, Snekkersten og Hornbæk. Vi kører til dig – gratis kørsel, skånsom dampvask uden ridser.',
  alternates: { canonical: "/bilvask/helsingoer" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: 'Mobil bilvask i Helsingør – Elite Vask',
    description: 'Professionel mobil dampvask i Helsingør. Vi kører direkte til dig.',
    type: "article",
    locale: "da_DK",
  },
};

export default async function BilvaskHelsingoer() {
  const hours = await getHours();
  const hd = hoursDisplay(hours, "da");
  const hdEn = hoursDisplay(hours, "en");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:'Mobil bilvask i Helsingør',path:"/bilvask/helsingoer"}]),cityServiceLd({city:'Helsingør',path:"/bilvask/helsingoer"}),webPageLd({path:"/bilvask/helsingoer",name:"Mobil bilvask i Helsingør – Elite Vask",description:"Mobil bil dampvask i Helsingør. Vi kører til din adresse."})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Helsingør</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør i Helsingør og Nordkysten</p>

        <p className="guide-lead">
          Elite Vask tilbyder mobil dampvask i hele Helsingør Kommune – fra Espergærde og Snekkersten i syd til Hornbæk og Ålsgårde på Nordkysten. Vi kommer til din adresse med alt udstyr og efterlader bilen skinnende ren.
        </p>

        <h2>Havluft og sund-salt slider på lakken</h2>
        <p>
          Biler i Helsingør står tættere på saltvand end de fleste i landet – Øresund på den ene side, Nordkysten på den anden. Saltholdig luft lægger en tynd film på lak og krom, som langsomt matterer overfladen og angriber udsatte kanter.
        </p>
        <p>
          Regelmæssig dampvask fjerner saltfilmen skånsomt og holder lakken tæt. Kombinér med lakforsegling (indgår i Guld pakken), så overfladen afviser salt og snavs i månedsvis.
        </p>

        <h2>Hele kommunen – uden beregning for kørsel</h2>
        <p>
          Vi kører i Helsingør by, Espergærde, Snekkersten, Ålsgårde, Hellebæk og Hornbæk. Kørsel er <strong>gratis</strong> i hele kommunen.
        </p>


        <h2>Priser på bilvask i Helsingør</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – komplet ydre dampvask inkl. fælge og dæk. Fra 500 kr.</li>
          <li><strong>Hele bilen (ind &amp; ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <CityProcess city="Helsingør" />

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Dækker I også Hornbæk og Nordkysten?</strong><br/>
        Ja, hele kommunen inklusive Hornbæk, Ålsgårde og Hellebæk. Kørsel er gratis.</p>
        <p><strong>Hvad gør salt fra Øresund ved bilen?</strong><br/>
        Saltfilmen matterer lak og krom over tid og fremskynder rust ved kanter og samlinger. Dampvask opløser og fjerner filmen uden at slide på overfladen.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.text}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.text} – ring til os, så finder vi en tid.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book mobil bilvask i Helsingør i dag</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book nu</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Service area</div>
        <h1>Mobile car wash in Helsingør (Elsinore)</h1>
        <p className="legal-updated">Elite Vask · Steam wash at your door in Helsingør and on the North Coast</p>

        <p className="guide-lead">
          Elite Vask offers mobile steam washing throughout Helsingør Municipality – from Espergærde and Snekkersten in the south to Hornbæk and Ålsgårde on the North Coast. We come to your address with all the equipment and leave the car sparkling clean.
        </p>

        <h2>Sea air and salt from the Øresund wear down the paint</h2>
        <p>
          Cars in Helsingør are parked closer to salt water than most in the country – the Øresund on one side, the North Coast on the other. Salty air leaves a thin film on paint and chrome that slowly dulls the surface and attacks exposed edges.
        </p>
        <p>
          Regular steam washing gently removes the salt film and keeps the paint sealed. Combine it with paint sealant (included in the Gold package) so the surface repels salt and dirt for months.
        </p>

        <h2>The whole municipality – no charge for travel</h2>
        <p>
          We drive to Helsingør town, Espergærde, Snekkersten, Ålsgårde, Hellebæk and Hornbæk. Travel is <strong>free</strong> throughout the municipality.
        </p>


        <h2>Car wash prices in Helsingør</h2>
        <ul>
          <li><strong>Exterior wash</strong> – complete exterior steam wash incl. rims and tyres. From 500 kr.</li>
          <li><strong>Whole car (inside &amp; out)</strong> – exterior and interior cleaning in one visit. From 800 kr.</li>
          <li><strong>Gold package</strong> – complete treatment incl. engine cleaning and paint sealant. From 2,000 kr.</li>
        </ul>
        <p>
          All prices include free travel. You pay <strong>after</strong> the wash, once you are satisfied.
        </p>

        <CityProcess city="Helsingør" cityEn="Helsingør (Elsinore)" />

        <h2>Frequently asked questions</h2>
        <p><strong>Do you also cover Hornbæk and the North Coast?</strong><br/>
        Yes, the whole municipality, including Hornbæk, Ålsgårde and Hellebæk. Travel is free.</p>
        <p><strong>What does salt from the Øresund do to the car?</strong><br/>
        Over time the salt film dulls paint and chrome and accelerates rust at edges and joints. Steam washing dissolves and removes the film without wearing the surface.</p>
        <p><strong>Can you come at the weekend?</strong><br/>
        {hdEn.weekendOpen
          ? <>Yes, we work {hdEn.text}.</>
          : <>Unfortunately we are closed at weekends, but we work {hdEn.text} – call us and we will find a time.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book a mobile car wash in Helsingør today</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book now</Link>
        </div>
          </>}
        />
        <RelatedLinks city="helsingoer" />
      </div>
    </div>
  );
}
