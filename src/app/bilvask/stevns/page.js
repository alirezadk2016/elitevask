import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import CityProcess from "@/components/CityProcess";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd, webPageLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: 'Bilvask i Stevns – mobil dampvask og bilpleje | Elite Vask',
  description: 'Professionel mobil dampvask i Stevns Kommune – Store Heddinge, Strøby Egede, Hårlev og Rødvig. Vi kører til dig, gratis kørsel, betal efter vask.',
  alternates: { canonical: "/bilvask/stevns" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: 'Mobil bilvask i Stevns – Elite Vask',
    description: 'Professionel mobil dampvask i Stevns. Vi kører direkte til dig.',
    type: "article",
    locale: "da_DK",
  },
};

export default async function BilvaskStevns() {
  const hours = await getHours();
  const hd = hoursDisplay(hours, "da");
  const hdEn = hoursDisplay(hours, "en");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:'Mobil bilvask i Stevns',path:"/bilvask/stevns"}]),cityServiceLd({city:'Stevns',path:"/bilvask/stevns"}),webPageLd({path:"/bilvask/stevns",name:"Mobil bilvask i Stevns – Elite Vask",description:"Mobil bil dampvask i Stevns. Vi kører til din adresse."})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Stevns Kommune</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør i hele Stevns Kommune</p>

        <p className="guide-lead">
          Bor du i Stevns Kommune og mangler en professionel bilvask, uden at skulle køre til en vaskehal? Elite Vask kommer til dig – i Store Heddinge, Strøby Egede, Hårlev, Rødvig og alle landsbyerne imellem – og dampvasker bilen direkte i din indkørsel.
        </p>

        <h2>Bilvask ved kysten – salt kræver noget ekstra</h2>
        <p>
          Stevns ligger ud til Østersøen, og biler tæt på kysten udsættes for saltholdig luft året rundt – ikke kun om vinteren. Salt sætter sig i lakporer, listekanter og hjulkasser og fremskynder rust, hvis det får lov at sidde.
        </p>
        <p>
          Dampvask er den mest effektive metode mod salt: den varme damp opløser saltrester i sprækker og skjulte samlinger, som en almindelig vask aldrig når. Ingen børster, ingen ridser – kun damp, mikrofiberklude og grundighed.
        </p>

        <h2>Vi dækker hele kommunen</h2>
        <p>
          Vi kører fast i hele Stevns Kommune: Store Heddinge, Strøby Egede, Hårlev, Rødvig, Klippinge og Valløby. Kørsel er altid <strong>gratis</strong> – prisen er den samme, uanset hvor i kommunen du bor.
        </p>


        <h2>Priser på bilvask i Stevns</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – komplet ydre dampvask inkl. fælge og dæk. Fra 500 kr.</li>
          <li><strong>Hele bilen (ind &amp; ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <CityProcess city="Stevns" />

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Kører I helt ud til Rødvig og Stevns Klint-området?</strong><br/>
        Ja, vi dækker hele kommunen – også Rødvig, Lund og området omkring Stevns Klint. Kørsel er gratis.</p>
        <p><strong>Kan I fjerne saltbelægninger fra kystluften?</strong><br/>
        Ja, netop det er dampvaskens styrke: varm damp opløser salt i porer og sprækker uden at slide på lakken.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")} – ring til os, så finder vi en tid.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book mobil bilvask i Stevns i dag</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book nu</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Service area</div>
        <h1>Mobile car wash in Stevns Municipality</h1>
        <p className="legal-updated">Elite Vask · Steam wash at your door throughout Stevns Municipality</p>

        <p className="guide-lead">
          Do you live in Stevns Municipality and need a professional car wash without having to drive to an automatic car wash? Elite Vask comes to you – in Store Heddinge, Strøby Egede, Hårlev, Rødvig and all the villages in between – and steam washes your car right on your driveway.
        </p>

        <h2>Car washing on the coast – salt needs extra care</h2>
        <p>
          Stevns faces the Baltic Sea, and cars close to the coast are exposed to salty air all year round – not just in winter. Salt settles in paint pores, trim edges and wheel arches and accelerates rust if it is left there.
        </p>
        <p>
          Steam washing is the most effective method against salt: the hot steam dissolves salt residue in gaps and hidden joints that an ordinary wash never reaches. No brushes, no scratches – just steam, microfibre cloths and thoroughness.
        </p>

        <h2>We cover the whole municipality</h2>
        <p>
          We regularly cover all of Stevns Municipality: Store Heddinge, Strøby Egede, Hårlev, Rødvig, Klippinge and Valløby. Travel is always <strong>free</strong> – the price is the same wherever in the municipality you live.
        </p>


        <h2>Car wash prices in Stevns</h2>
        <ul>
          <li><strong>Exterior wash</strong> – complete exterior steam wash incl. rims and tyres. From 500 kr.</li>
          <li><strong>Whole car (inside &amp; out)</strong> – exterior and interior cleaning in one visit. From 800 kr.</li>
          <li><strong>Gold package</strong> – complete treatment incl. engine cleaning and paint sealant. From 2,000 kr.</li>
        </ul>
        <p>
          All prices include free travel. You pay <strong>after</strong> the wash, once you are satisfied.
        </p>

        <CityProcess city="Stevns" />

        <h2>Frequently asked questions</h2>
        <p><strong>Do you drive all the way out to Rødvig and the Stevns Klint (Stevns Cliff) area?</strong><br/>
        Yes, we cover the whole municipality – including Rødvig, Lund and the area around Stevns Klint. Travel is free.</p>
        <p><strong>Can you remove salt deposits from the coastal air?</strong><br/>
        Yes, that is exactly where steam washing excels: hot steam dissolves salt in pores and gaps without wearing the paintwork.</p>
        <p><strong>Can you come at the weekend?</strong><br/>
        {hdEn.weekendOpen
          ? <>Yes, we work {hdEn.days.toLowerCase()}, {hdEn.time.replace(" – ", "–")}.</>
          : <>Unfortunately we are closed at weekends, but we work {hdEn.days.toLowerCase()}, {hdEn.time.replace(" – ", "–")} – call us and we will find a time.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book a mobile car wash in Stevns today</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book now</Link>
        </div>
          </>}
        />
        <RelatedLinks city="stevns" />
      </div>
    </div>
  );
}
