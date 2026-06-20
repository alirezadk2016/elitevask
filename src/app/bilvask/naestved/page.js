export const metadata = {
  title: "Mobil bilvask i Næstved – Elite Vask dampvask til din dør",
  description: "Professionel mobil dampvask i Næstved og omegn. Vi kører til din adresse – gratis kørsel, betal efter vask. Book online eller ring til os.",
  alternates: { canonical: "https://elite-vask.dk/bilvask/naestved" },
  openGraph: {
    title: "Mobil bilvask i Næstved – Elite Vask",
    description: "Professionel mobil dampvask i Næstved. Vi kører direkte til dig.",
    type: "article",
    locale: "da_DK",
  },
};

export default function BilvaskNaestved() {
  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <a href="/" className="legal-back">← Tilbage til forsiden</a>

        <div className="guide-eyebrow">Serviceområde</div>
        <h1>Mobil bilvask i Næstved</h1>
        <p className="legal-updated">Elite Vask · Dampvask til din dør i Næstved og omegn</p>

        <p className="guide-lead">
          Elite Vask tilbyder mobil dampvask i Næstved og hele Næstved Kommune. Vi kører ud til dig med professionelt udstyr og vasker din bil på stedet – du behøver hverken køre nogen steder hen eller vente i kø.
        </p>

        <h2>Bilvask i Næstved – vi kommer til dig</h2>
        <p>
          Næstved er Sydsjællands største by, og mange bilister ønsker en professionel bilvask uden besværet med at finde et ledigt vaskested. Elite Vask tilbyder en nem løsning: vi aftaler et tidspunkt, kører ud til din adresse og leverer en grundig dampvask direkte på stedet.
        </p>
        <p>
          Vi betjener hele Næstved by og kommunen, herunder Fensmark, Glumsø, Rønnede, Holme-Olstrup og Toksværd. Kørsel er <strong>gratis</strong>.
        </p>

        <h2>Hvorfor dampvask er det rigtige valg</h2>
        <p>
          Traditionelle bilvaske i tunnelanlæg bruger roterende børster og store mængder vand med kemikalier. Over tid kan dette ridse lakken og nedbryde voksbehandlinger. Dampvask er en langt skånsomt metode:
        </p>
        <ul>
          <li>Ingen roterende børster – ingen ridser i lakken</li>
          <li>Op til 90% mindre vandforbrug end tunnelvask</li>
          <li>pH-neutrale, miljøvenlige produkter</li>
          <li>Desinficerer kabine og sæder effektivt</li>
          <li>Fjerner vejsalt, insekter og indgroet snavs</li>
        </ul>

        <h2>Pakker og priser</h2>
        <ul>
          <li><strong>Udvendig vask</strong> – karosseri, fælge, dæk og ruder. Fra 500 kr.</li>
          <li><strong>Hel bil (ind & ud)</strong> – komplet indvendig og udvendig behandling. Fra 800 kr.</li>
          <li><strong>Guld pakke</strong> – alt inklusiv: motorrens, lakforsegling og dybdebehandling. Fra 2.000 kr.</li>
        </ul>
        <p>
          Du betaler først, når du er tilfreds. Ingen forudbetaling. Gratis kørsel til Næstved og omegn.
        </p>

        <h2>Tilvalg og ekstraydelser</h2>
        <p>
          Du kan tilføje ekstraydelser til enhver pakke:
        </p>
        <ul>
          <li><strong>Motorrens</strong> – grundig afrensning af motorrum. 400 kr.</li>
          <li><strong>Lak- & glansbeskyttelse</strong> – langvarig ekstra glans. 300 kr.</li>
          <li><strong>Fjernelse af dyrehår</strong> – effektiv fjernelse af hår og fnug. 300 kr.</li>
          <li><strong>Sæderens (stof)</strong> – dybderens af stofsæder. 400 kr.</li>
        </ul>

        <h2>Elbiler i Næstved</h2>
        <p>
          Dampvask er den ideelle metode til elbiler. Vi bruger minimalt vand og undgår højtryk nær batteripakke og ladeporte. Mange ejere af Tesla, VW ID, Hyundai Ioniq og andre elbiler foretrækker netop dampvask for at beskytte elektronik og tætninger.
        </p>

        <h2>Ofte stillede spørgsmål</h2>
        <p><strong>Kører I til hele Næstved Kommune?</strong><br/>
        Ja, vi dækker alle postnumre i kommunen – 4700 og omliggende.</p>
        <p><strong>Skal jeg være hjemme under vasken?</strong><br/>
        Nej. Bilen skal blot være tilgængelig. Mange kunder er på arbejde under vasken.</p>
        <p><strong>Hvad hvis vejret er dårligt?</strong><br/>
        Vi kontakter dig, hvis vejret er uegnet, og ombooke gratis til nærmeste ledige tid.</p>

        <div style={{marginTop:'2rem',padding:'1.5rem',background:'#f0faf4',borderRadius:'12px',textAlign:'center'}}>
          <p style={{margin:'0 0 1rem',fontWeight:700,fontSize:'1.1rem'}}>Book mobil bilvask i Næstved i dag</p>
          <a href="/#vaelg" className="btn btn-green" style={{display:'inline-block',padding:'0.75rem 2rem',borderRadius:'8px',background:'#22c55e',color:'#fff',textDecoration:'none',fontWeight:700}}>Se priser og book nu</a>
        </div>
      </div>
    </div>
  );
}
