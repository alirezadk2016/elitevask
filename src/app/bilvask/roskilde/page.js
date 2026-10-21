import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import CityProcess from "@/components/CityProcess";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd, webPageLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: "Bilvask i Roskilde – mobil dampvask og bilpleje | Elite Vask",
  description: "Professionel mobil dampvask i Roskilde. Vi kører til din adresse – hjemme eller på arbejdet. Gratis kørsel, betal efter vask. Book online.",
  alternates: { canonical: "/bilvask/roskilde" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: "Mobil bilvask i Roskilde – Elite Vask",
    description: "Professionel mobil dampvask i Roskilde. Vi kører direkte til dig.",
    type: "article",
    locale: "da_DK",
  },
};

export default async function BilvaskRoskilde() {
  const hours = await getHours();
  const hd = hoursDisplay(hours, "da");
  const hdEn = hoursDisplay(hours, "en");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:"Mobil bilvask i Roskilde",path:"/bilvask/roskilde"}]),cityServiceLd({city:"Roskilde",path:"/bilvask/roskilde"}),webPageLd({path:"/bilvask/roskilde",name:"Mobil bilvask i Roskilde – Elite Vask",description:"Mobil bil dampvask i Roskilde. Vi kører til din adresse."})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Roskilde</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør i Roskilde og omegn</p>

        <p className="guide-lead">
          Elite Vask tilbyder professionel mobil dampvask i Roskilde og hele Roskilde Kommune. Vi kører direkte til din adresse med alt udstyr og leverer en grundig bilvask – uden at du behøver flytte dig.
        </p>

        <h2>Bilvask i Roskilde – vi kører til dig</h2>
        <p>
          Roskilde er en af Sjællands travleste byer, og de fleste bilvaskanlæg kræver at du selv kører derhen og venter. Med Elite Vask er det anderledes: vi aftaler et tidspunkt der passer dig, møder op til din adresse og vasker bilen, mens du er hjemme, på arbejdet eller passer dit.
        </p>
        <p>
          Vi betjener hele Roskilde by og kommunen, herunder Jyllinge, Gundsømagle, Viby Sjælland og Gadstrup. Kørsel er altid <strong>gratis</strong>.
        </p>

        <h2>Professionel dampvask – skånsom og effektiv</h2>
        <p>
          Vores mobile dampvask bruger varm damp til at løsne snavs, vejsalt, insekter og fedt fra karosseri, fælge og kabine. I modsætning til automatvask med roterende børster efterlader dampvask ingen ridser i lakken og kræver minimalt vandforbrug – <strong>op til 90% mindre vand</strong> end en traditionel bilvask.
        </p>
        <p>
          Til kabinen bruger vi dampbehandling, der desinficerer sæder, måtter og overflader og fjerner dårlig lugt – uden at mætte stoffet med vand.
        </p>

        <h2>Pakker og priser i Roskilde</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – karosseri, fælge, dæk og ruder. Fra 500 kr.</li>
          <li><strong>Hele bilen (ind & ud)</strong> – komplet rens indvendigt og udvendigt. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – motorrens, lakforsegling og fuld dybdebehandling. Fra 2.000 kr.</li>
        </ul>
        <p>Du betaler kun når du er tilfreds. Ingen forudbetaling.</p>

        <h2>Elbiler og leasingbiler i Roskilde</h2>
        <p>
          Mange i Roskilde kører i elbil eller leasingbil. Dampvask er den skånsomste metode til elbiler – vi undgår højtryk nær batteripakke og ladeporte. Til leasingbiler sikrer vi et professionelt resultat, der lever op til kravene ved aflevering.
        </p>

        <CityProcess city="Roskilde" />

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Vasker I i hele Roskilde Kommune?</strong><br/>
        Ja, vi dækker hele kommunen inklusiv Jyllinge, Gundsømagle, Viby Sjælland og Gadstrup.</p>
        <p><strong>Hvad koster kørsel til Roskilde?</strong><br/>
        Kørsel er gratis til alle adresser i Roskilde og omegn.</p>
        <p><strong>Kan I vaske min bil på weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")} – ring til os, så finder vi en tid.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book mobil bilvask i Roskilde i dag</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book nu</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Service area</div>
        <h1>Mobile car wash in Roskilde</h1>
        <p className="legal-updated">Elite Vask · Steam wash at your door in and around Roskilde</p>

        <p className="guide-lead">
          Elite Vask offers professional mobile steam washing in Roskilde and across Roskilde Municipality. We drive straight to your address with all the equipment and deliver a thorough car wash – without you having to go anywhere.
        </p>

        <h2>Car wash in Roskilde – we come to you</h2>
        <p>
          Roskilde is one of Zealand's busiest towns, and most car wash facilities require you to drive there yourself and wait. With Elite Vask it is different: we agree a time that suits you, turn up at your address and wash the car while you are at home, at work or getting on with your day.
        </p>
        <p>
          We cover all of Roskilde town and the municipality, including Jyllinge, Gundsømagle, Viby Sjælland and Gadstrup. Travel is always <strong>free</strong>.
        </p>

        <h2>Professional steam washing – gentle and effective</h2>
        <p>
          Our mobile steam wash uses hot steam to loosen dirt, road salt, insects and grease from the bodywork, rims and cabin. Unlike an automatic car wash with rotating brushes, steam washing leaves no scratches in the paint and uses minimal water – <strong>up to 90% less water</strong> than a traditional car wash.
        </p>
        <p>
          For the cabin we use steam treatment that disinfects seats, mats and surfaces and removes bad odours – without soaking the fabric with water.
        </p>

        <h2>Packages and prices in Roskilde</h2>
        <ul>
          <li><strong>Exterior wash</strong> – bodywork, rims, tyres and windows. From 500 kr.</li>
          <li><strong>Whole car (inside & out)</strong> – complete cleaning inside and out. From 800 kr.</li>
          <li><strong>Gold package</strong> – engine cleaning, paint sealant and full deep treatment. From 2,000 kr.</li>
        </ul>
        <p>You only pay once you are satisfied. No prepayment.</p>

        <h2>Electric cars and lease cars in Roskilde</h2>
        <p>
          Many people in Roskilde drive an electric car or a lease car. Steam washing is the gentlest method for electric cars – we avoid high pressure near the battery pack and charging ports. For lease cars we ensure a professional result that meets the requirements on return.
        </p>

        <CityProcess city="Roskilde" />

        <h2>Frequently asked questions</h2>
        <p><strong>Do you wash cars throughout Roskilde Municipality?</strong><br/>
        Yes, we cover the whole municipality, including Jyllinge, Gundsømagle, Viby Sjælland and Gadstrup.</p>
        <p><strong>How much does travel to Roskilde cost?</strong><br/>
        Travel is free to all addresses in and around Roskilde.</p>
        <p><strong>Can you wash my car at the weekend?</strong><br/>
        {hdEn.weekendOpen
          ? <>Yes, we work {hdEn.days.toLowerCase()}, {hdEn.time.replace(" – ", "–")}.</>
          : <>Unfortunately we are closed at weekends, but we work {hdEn.days.toLowerCase()}, {hdEn.time.replace(" – ", "–")} – call us and we will find a time.</>}</p>

        <div className="guide-cta-box">
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem',color:'#fff'}}>Book a mobile car wash in Roskilde today</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book now</Link>
        </div>
          </>}
        />
        <RelatedLinks city="roskilde" />
      </div>
    </div>
  );
}
