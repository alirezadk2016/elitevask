export const metadata = {
  title: "Mobil bilvask i Roskilde – Elite Vask dampvask til din dør",
  description: "Professionel mobil dampvask i Roskilde. Vi kører til din adresse – hjemme eller på arbejdet. Gratis kørsel, betal efter vask. Book online.",
  alternates: { canonical: "/bilvask/roskilde" },
  openGraph: {
    title: "Mobil bilvask i Roskilde – Elite Vask",
    description: "Professionel mobil dampvask i Roskilde. Vi kører direkte til dig.",
    type: "article",
    locale: "da_DK",
  },
};

export default function BilvaskRoskilde() {
  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <a href="/" className="legal-back">← Tilbage til forsiden</a>

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
          Vi betjener hele Roskilde by og kommunen, herunder Jyllinge, Gundsømagle, Viby og Gadstrup. Kørsel er altid <strong>gratis</strong>.
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
          <li><strong>Hel bil (ind & ud)</strong> – komplet rens indvendigt og udvendigt. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – motorrens, lakforsegling og fuld dybdebehandling. Fra 2.000 kr.</li>
        </ul>
        <p>Du betaler kun når du er tilfreds. Ingen forudbetaling.</p>

        <h2>Elbiler og leasingbiler i Roskilde</h2>
        <p>
          Mange i Roskilde kører i elbil eller leasingbil. Dampvask er den skånsomste metode til elbiler – vi undgår højtryk nær batteripakke og ladeporte. Til leasingbiler sikrer vi et professionelt resultat, der lever op til kravene ved aflevering.
        </p>

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Vasker I i hele Roskilde Kommune?</strong><br/>
        Ja, vi dækker hele kommunen inklusiv Jyllinge, Gundsømagle, Viby og Gadstrup.</p>
        <p><strong>Hvad koster kørsel til Roskilde?</strong><br/>
        Kørsel er gratis til alle adresser i Roskilde og omegn.</p>
        <p><strong>Kan I vaske min bil på weekenden?</strong><br/>
        Ja, vi arbejder lørdag og søndag 10–20.</p>

        <div style={{marginTop:'2rem',padding:'1.5rem',background:'#f0faf4',borderRadius:'12px',textAlign:'center'}}>
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem'}}>Book mobil bilvask i Roskilde i dag</p>
          <a href="/#vaelg" className="btn btn-green" style={{display:'inline-block',padding:'0.75rem 2rem',borderRadius:'8px',background:'#22c55e',color:'#fff',textDecoration:'none',fontWeight:700}}>Se priser og book nu</a>
        </div>
      </div>
    </div>
  );
}
