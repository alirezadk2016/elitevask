import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import CityProcess from "@/components/CityProcess";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd, webPageLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: 'Bilvask i Hillerød – mobil dampvask og bilpleje | Elite Vask',
  description: 'Professionel mobil dampvask i Hillerød og omegn. Vi kører til din adresse eller arbejdsplads – gratis kørsel, betal først når bilen er ren.',
  alternates: { canonical: "/bilvask/hilleroed" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: 'Mobil bilvask i Hillerød – Elite Vask',
    description: 'Professionel mobil dampvask i Hillerød. Vi kører direkte til dig.',
    type: "article",
    locale: "da_DK",
  },
};

export default async function BilvaskHilleroed() {
  const hours = await getHours();
  const hd = hoursDisplay(hours, "da");
  const hdEn = hoursDisplay(hours, "en");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:'Mobil bilvask i Hillerød',path:"/bilvask/hilleroed"}]),cityServiceLd({city:'Hillerød',path:"/bilvask/hilleroed"}),webPageLd({path:"/bilvask/hilleroed",name:"Mobil bilvask i Hillerød – Elite Vask",description:"Mobil bil dampvask i Hillerød. Vi kører til din adresse."})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Hillerød</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør i Hillerød og Nordsjælland</p>

        <p className="guide-lead">
          Pendler du fra Hillerød, eller har du bare bedre ting at bruge lørdagen på end en vaskehal? Elite Vask dampvasker din bil, mens den holder i indkørslen eller på parkeringspladsen ved arbejdet – i Hillerød by, Skævinge, Gørløse og Nødebo.
        </p>

        <h2>Vask bilen, mens du er på arbejde</h2>
        <p>
          Hillerød er en pendlerby, og mange af vores kunder her booker vasken til dagtimerne på deres arbejdsplads’ parkering – bilen er ren, når fyraften ringer. Det eneste, vi behøver, er en aftale og fri plads omkring bilen.
        </p>
        <p>
          Vi arbejder diskret og medbringer alt selv: strøm, vand og professionelt dampudstyr.
        </p>

        <h2>Skov, fugt og grønne belægninger</h2>
        <p>
          Området omkring Gribskov og Store Dyrehave betyder, at mange biler i Hillerød står under træer: harpiks, fuglespots og grønne algebelægninger på tagkant og lister er typiske. Dampen løsner alle tre uden at gnide dem ned i lakken.
        </p>


        <h2>Priser på bilvask i Hillerød</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – komplet ydre dampvask inkl. fælge og dæk. Fra 500 kr.</li>
          <li><strong>Hele bilen (ind &amp; ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <CityProcess city="Hillerød" />

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Kan I vaske bilen ved min arbejdsplads?</strong><br/>
        Ja, det er en af vores mest bookede løsninger i Hillerød – vi skal blot bruge fri adgang til bilen og plads omkring den.</p>
        <p><strong>Fjerner I harpiks og fuglespots?</strong><br/>
        Ja, varm damp opløser harpiks og indtørrede spots skånsomt, uden aggressive midler eller skrubning.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")} – ring til os, så finder vi en tid.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book mobil bilvask i Hillerød i dag</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book nu</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Service area</div>
        <h1>Mobile car wash in Hillerød</h1>
        <p className="legal-updated">Elite Vask · Steam wash at your door in Hillerød and North Zealand</p>

        <p className="guide-lead">
          Do you commute from Hillerød, or do you simply have better things to do with your Saturday than visit an automatic car wash? Elite Vask steam washes your car while it is parked in the driveway or in the car park at work – in Hillerød town, Skævinge, Gørløse and Nødebo.
        </p>

        <h2>Get the car washed while you are at work</h2>
        <p>
          Hillerød is a commuter town, and many of our customers here book the wash during the day in their workplace car park – the car is clean when it is time to go home. All we need is an appointment and free space around the car.
        </p>
        <p>
          We work discreetly and bring everything ourselves: power, water and professional steam equipment.
        </p>

        <h2>Forest, damp and green deposits</h2>
        <p>
          The area around Gribskov and Store Dyrehave means that many cars in Hillerød are parked under trees: resin, bird droppings and green algae deposits on the roof edge and trim are typical. The steam loosens all three without rubbing them into the paint.
        </p>


        <h2>Car wash prices in Hillerød</h2>
        <ul>
          <li><strong>Exterior wash</strong> – complete exterior steam wash incl. rims and tyres. From 500 kr.</li>
          <li><strong>Whole car (inside &amp; out)</strong> – exterior and interior cleaning in one visit. From 800 kr.</li>
          <li><strong>Gold package</strong> – complete treatment incl. engine cleaning and paint sealant. From 2,000 kr.</li>
        </ul>
        <p>
          All prices include free travel. You pay <strong>after</strong> the wash, once you are satisfied.
        </p>

        <CityProcess city="Hillerød" />

        <h2>Frequently asked questions</h2>
        <p><strong>Can you wash the car at my workplace?</strong><br/>
        Yes, it is one of our most booked options in Hillerød – we just need free access to the car and space around it.</p>
        <p><strong>Do you remove resin and bird droppings?</strong><br/>
        Yes, hot steam gently dissolves resin and dried-on droppings, without aggressive products or scrubbing.</p>
        <p><strong>Can you come at the weekend?</strong><br/>
        {hdEn.weekendOpen
          ? <>Yes, we work {hdEn.days.toLowerCase()}, {hdEn.time.replace(" – ", "–")}.</>
          : <>Unfortunately we are closed at weekends, but we work {hdEn.days.toLowerCase()}, {hdEn.time.replace(" – ", "–")} – call us and we will find a time.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book a mobile car wash in Hillerød today</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book now</Link>
        </div>
          </>}
        />
        <RelatedLinks city="hilleroed" />
      </div>
    </div>
  );
}
