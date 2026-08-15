import Link from "next/link";
import DanishOnlyNotice from "@/components/DanishOnlyNotice";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: 'Mobil bilvask i Hillerød – Elite Vask dampvask til din dør',
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
  const hd = hoursDisplay(await getHours(), "da");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:'Mobil bilvask i Hillerød',path:"/bilvask/hilleroed"}]),cityServiceLd({city:'Hillerød',path:"/bilvask/hilleroed"})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back">← Tilbage til forsiden</Link>
        <DanishOnlyNotice />

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
          <li><strong>Hel bil (ind &amp; ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Kan I vaske bilen ved min arbejdsplads?</strong><br/>
        Ja, det er en af vores mest bookede løsninger i Hillerød – vi skal blot bruge fri adgang til bilen og plads omkring den.</p>
        <p><strong>Fjerner I harpiks og fuglespots?</strong><br/>
        Ja, varm damp opløser harpiks og indtørrede spots skånsomt, uden aggressive midler eller skrubning.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")} – ring til os, så finder vi en tid.</>}</p>

        <div style={{marginTop:'2rem',padding:'1.5rem',background:'#f0faf4',borderRadius:'12px',textAlign:'center'}}>
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem'}}>Book mobil bilvask i Hillerød i dag</p>
          <Link href="/#vaelg" className="btn btn-green" style={{display:'inline-block',padding:'0.75rem 2rem',borderRadius:'8px',background:'#22c55e',color:'#fff',textDecoration:'none',fontWeight:700}}>Se priser og book nu</Link>
        </div>
        <RelatedLinks />
      </div>
    </div>
  );
}
