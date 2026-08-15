import Link from "next/link";
import DanishOnlyNotice from "@/components/DanishOnlyNotice";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd } from "@/lib/seo";
import { getHours, hoursDisplay } from "@/lib/getHours";
export const metadata = {
  title: 'Mobil bilvask i Helsingør – Elite Vask dampvask til din dør',
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
  const hd = hoursDisplay(await getHours(), "da");
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:'Mobil bilvask i Helsingør',path:"/bilvask/helsingoer"}]),cityServiceLd({city:'Helsingør',path:"/bilvask/helsingoer"})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back">← Tilbage til forsiden</Link>
        <DanishOnlyNotice />

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
          <li><strong>Hel bil (ind &amp; ud)</strong> – udvendig og indvendig rens i ét besøg. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – komplet behandling inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Alle priser er inkl. gratis kørsel. Du betaler <strong>efter</strong> vasken, når du er tilfreds.
        </p>

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Dækker I også Hornbæk og Nordkysten?</strong><br/>
        Ja, hele kommunen inklusive Hornbæk, Ålsgårde og Hellebæk. Kørsel er gratis.</p>
        <p><strong>Hvad gør salt fra Øresund ved bilen?</strong><br/>
        Saltfilmen matterer lak og krom over tid og fremskynder rust ved kanter og samlinger. Dampvask opløser og fjerner filmen uden at slide på overfladen.</p>
        <p><strong>Kan I komme i weekenden?</strong><br/>
        {hd.weekendOpen
          ? <>Ja, vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")}.</>
          : <>Vi har desværre lukket i weekenden, men vi arbejder {hd.days.toLowerCase()} kl. {hd.time.replace(" – ", "–")} – ring til os, så finder vi en tid.</>}</p>

        <div style={{marginTop:'2rem',padding:'1.5rem',background:'#f0faf4',borderRadius:'12px',textAlign:'center'}}>
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem'}}>Book mobil bilvask i Helsingør i dag</p>
          <Link href="/#vaelg" className="btn btn-green" style={{display:'inline-block',padding:'0.75rem 2rem',borderRadius:'8px',background:'#22c55e',color:'#fff',textDecoration:'none',fontWeight:700}}>Se priser og book nu</Link>
        </div>
        <RelatedLinks />
      </div>
    </div>
  );
}
