import Link from "next/link";
import DanishOnlyNotice from "@/components/DanishOnlyNotice";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: 'Mobil bilvask i Stevns Kommune – Elite Vask dampvask til din dør',
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
  const hd = hoursDisplay(await getHours(), "da");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:'Mobil bilvask i Stevns',path:"/bilvask/stevns"}]),cityServiceLd({city:'Stevns',path:"/bilvask/stevns"})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back">← Tilbage til forsiden</Link>
        <DanishOnlyNotice />

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
          <li><strong>Hel bil (ind &amp; ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Kører I helt ud til Rødvig og Stevns Klint-området?</strong><br/>
        Ja, vi dækker hele kommunen – også Rødvig, Lund og området omkring Stevns Klint. Kørsel er gratis.</p>
        <p><strong>Kan I fjerne saltbelægninger fra kystluften?</strong><br/>
        Ja, netop det er dampvaskens styrke: varm damp opløser salt i porer og sprækker uden at slide på lakken.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")} – ring til os, så finder vi en tid.</>}</p>

        <div style={{marginTop:'2rem',padding:'1.5rem',background:'#f0faf4',borderRadius:'12px',textAlign:'center'}}>
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem'}}>Book mobil bilvask i Stevns i dag</p>
          <Link href="/#vaelg" className="btn btn-green" style={{display:'inline-block',padding:'0.75rem 2rem',borderRadius:'8px',background:'#22c55e',color:'#fff',textDecoration:'none',fontWeight:700}}>Se priser og book nu</Link>
        </div>
        <RelatedLinks />
      </div>
    </div>
  );
}
