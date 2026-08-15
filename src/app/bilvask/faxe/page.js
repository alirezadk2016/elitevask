import Link from "next/link";
import DanishOnlyNotice from "@/components/DanishOnlyNotice";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: 'Mobil bilvask i Faxe Kommune – Elite Vask dampvask til din dør',
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
  const hd = hoursDisplay(await getHours(), "da");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:'Mobil bilvask i Faxe',path:"/bilvask/faxe"}]),cityServiceLd({city:'Faxe',path:"/bilvask/faxe"})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back">← Tilbage til forsiden</Link>
        <DanishOnlyNotice />

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
          <li><strong>Hel bil (ind &amp; ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Kommer I også til Haslev?</strong><br/>
        Ja, Haslev er en fast del af vores rute – ligesom resten af kommunen. Gratis kørsel.</p>
        <p><strong>Kan I tage en meget beskidt bil, der har kørt på grusvej?</strong><br/>
        Ja. Kraftig tilsmudsning kan kræve lidt ekstra tid, som vi aftaler på forhånd – men det er præcis den slags opgaver, dampen er bedst til.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")} – ring til os, så finder vi en tid.</>}</p>

        <div style={{marginTop:'2rem',padding:'1.5rem',background:'#f0faf4',borderRadius:'12px',textAlign:'center'}}>
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem'}}>Book mobil bilvask i Faxe i dag</p>
          <Link href="/#vaelg" className="btn btn-green" style={{display:'inline-block',padding:'0.75rem 2rem',borderRadius:'8px',background:'#22c55e',color:'#fff',textDecoration:'none',fontWeight:700}}>Se priser og book nu</Link>
        </div>
        <RelatedLinks />
      </div>
    </div>
  );
}
