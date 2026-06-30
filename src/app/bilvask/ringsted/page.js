import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, cityServiceLd } from "@/lib/seo";
export const metadata = {
  title: "Mobil bilvask i Ringsted – Elite Vask dampvask til din dør",
  description: "Professionel mobil dampvask i Ringsted. Vi kører til din adresse – gratis kørsel, betal efter vask. Skånsom dampvask uden ridser. Book online.",
  alternates: { canonical: "/bilvask/ringsted" },
  openGraph: {
    title: "Mobil bilvask i Ringsted – Elite Vask",
    description: "Professionel mobil dampvask i Ringsted. Vi kører direkte til dig.",
    type: "article",
    locale: "da_DK",
  },
};

export default function BilvaskRingsted() {
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:"Mobil bilvask i Ringsted",path:"/bilvask/ringsted"}]),cityServiceLd({city:"Ringsted",path:"/bilvask/ringsted"})]} />
      <div className="legal-wrap">
        <a href="/" className="legal-back">← Tilbage til forsiden</a>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Ringsted</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør i Ringsted og omegn</p>

        <p className="guide-lead">
          Elite Vask tilbyder professionel mobil dampvask i Ringsted og Ringsted Kommune. Vi kører direkte til din adresse – hjemme, på arbejdet eller ved sommerhuset – og leverer en grundig, skånsom bilvask med professionelt udstyr.
        </p>

        <h2>Bilvask i Ringsted – uden at du behøver flytte dig</h2>
        <p>
          Ringsted ligger centralt på Sjælland og er et knudepunkt for pendlere og erhvervsdrivende. Mange ønsker en professionel bilvask, men har ikke tid til at stå i kø ved en tunnelvask. Med Elite Vask er det simpelt: vi aftaler tid, kører ud og vasker bilen på stedet.
        </p>
        <p>
          Vi dækker hele Ringsted by og kommunen, herunder Benløse, Gyrstinge, Kværkeby og Haraldsted. Kørsel er <strong>gratis</strong>.
        </p>

        <h2>Professionel dampvask – hvad det betyder for din bil</h2>
        <p>
          Dampvask er en avanceret rengøringsmetode, der bruger varm damp ved høj temperatur til mekanisk at løsne snavs, fedt, vejsalt og insekter – uden brug af store mængder vand og uden aggressive kemikalier.
        </p>
        <p>
          For din bil betyder det:
        </p>
        <ul>
          <li><strong>Ingen ridser</strong> – ingen roterende børster der kan beskadige lakken</li>
          <li><strong>Dybere rens</strong> – damp trænger ind i sprækker og hjulkasser</li>
          <li><strong>Hygiejnisk kabine</strong> – damp desinficerer sæder og overflader effektivt</li>
          <li><strong>Miljøvenligt</strong> – op til 90% mindre vandforbrug end tunnelvask</li>
        </ul>

        <h2>Vores pakker og priser i Ringsted</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – karosseri, fælge, dæk, ruder. Fra 500 kr.</li>
          <li><strong>Hel bil (ind & ud)</strong> – komplet behandling. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – inkl. motorrens og lakforsegling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Du betaler efter vasken. Gratis kørsel til Ringsted og omegn. <strong>Ingen forudbetaling.</strong>
        </p>

        <h2>Firmabiler og flådevask i Ringsted</h2>
        <p>
          Ringsted er hjemsted for mange virksomheder med firmabiler og varevogne. Elite Vask tilbyder erhvervsaftaler til virksomheder, der har behov for regelmæssig vask af én eller flere biler. Kontakt os på <a href="mailto:info@elite-vask.dk">info@elite-vask.dk</a> for et tilbud.
        </p>

        <h2>Varebiler og kassevogne</h2>
        <p>
          Vi vasker alle typer køretøjer, herunder varebiler, kassevogne og større erhvervskøretøjer. Varebil-pakken starter fra 1.400 kr. for hel bil og inkluderer grundig indvendig og udvendig rens.
        </p>

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Koster det noget at I kører til Ringsted?</strong><br/>
        Nej, kørsel til Ringsted og alle adresser i kommunen er gratis.</p>
        <p><strong>Kan I vaske varebiler?</strong><br/>
        Ja, vi har erfaring med alle typer køretøjer inkl. varebiler og kassevogne.</p>
        <p><strong>Tilbyder I erhvervsaftaler?</strong><br/>
        Ja, kontakt os på info@elite-vask.dk for et skræddersyet tilbud til din virksomhed.</p>

        <div style={{marginTop:'2rem',padding:'1.5rem',background:'#f0faf4',borderRadius:'12px',textAlign:'center'}}>
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem'}}>Book mobil bilvask i Ringsted i dag</p>
          <a href="/#vaelg" className="btn btn-green" style={{display:'inline-block',padding:'0.75rem 2rem',borderRadius:'8px',background:'#22c55e',color:'#fff',textDecoration:'none',fontWeight:700}}>Se priser og book nu</a>
        </div>
        <RelatedLinks />
      </div>
    </div>
  );
}
