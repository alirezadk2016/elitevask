import Link from "next/link";
import DanishOnlyNotice from "@/components/DanishOnlyNotice";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: 'Mobil bilvask i Frederikssund – Elite Vask dampvask til din dør',
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
  const hd = hoursDisplay(await getHours(), "da");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:'Mobil bilvask i Frederikssund',path:"/bilvask/frederikssund"}]),cityServiceLd({city:'Frederikssund',path:"/bilvask/frederikssund"})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back">← Tilbage til forsiden</Link>
        <DanishOnlyNotice />

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
          <li><strong>Hel bil (ind &amp; ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Kører I over broen til Hornsherred?</strong><br/>
        Ja, Skibby, Jægerspris og hele Hornsherred er en del af vores faste område. Kørsel er gratis.</p>
        <p><strong>Hvor lang tid tager en vask?</strong><br/>
        Fra ca. 2 timer for en lille bil (udvendig) til 4 timer for en stor bil med Guld pakken. Du får et præcist estimat, når du booker.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")} – ring til os, så finder vi en tid.</>}</p>

        <div style={{marginTop:'2rem',padding:'1.5rem',background:'#f0faf4',borderRadius:'12px',textAlign:'center'}}>
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem'}}>Book mobil bilvask i Frederikssund i dag</p>
          <Link href="/#vaelg" className="btn btn-green" style={{display:'inline-block',padding:'0.75rem 2rem',borderRadius:'8px',background:'#22c55e',color:'#fff',textDecoration:'none',fontWeight:700}}>Se priser og book nu</Link>
        </div>
        <RelatedLinks />
      </div>
    </div>
  );
}
