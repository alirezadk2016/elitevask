import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, articleLd } from "@/lib/seo";
export const metadata = {
  title: "Hvor ofte bør man vaske sin bil? – Elite Vask Guide",
  description: "Hvor tit skal bilen vaskes? Svaret afhænger af årstid, brug og parkeringsforhold. Her er en konkret guide til, hvornår det er nødvendigt.",
  alternates: { canonical: "/guide/hvor-ofte" },
  openGraph: {
    title: "Hvor ofte bør man vaske sin bil?",
    description: "Svaret afhænger af årstid, brug og parkeringsforhold. Her er en konkret guide til, hvornår det er nødvendigt.",
    type: "article",
    locale: "da_DK",
  },
};

export default function HvorOfte() {
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:"Guide",path:"/guide"},{name:"Hvor ofte bør man vaske sin bil?",path:"/guide/hvor-ofte"}]),articleLd({title:"Hvor ofte bør man vaske sin bil?",description:"Hvor tit skal bilen vaskes? Svaret afhænger af årstid, brug og parkeringsforhold. Her er en konkret guide til, hvornår det er nødvendigt.",path:"/guide/hvor-ofte",datePublished:"2026-06-01"})]} />
      <div className="legal-wrap">
        <a href="/" className="legal-back">← Tilbage til forsiden</a>

        <div className="guide-eyebrow">Bilpleje Guide</div>
        <h1>Hvor ofte bør man vaske sin bil?</h1>
        <p className="legal-updated">Opdateret: juni 2026 · Læsetid: ca. 3 min</p>

        <p className="guide-lead">
          Der er ikke et enkelt svar, der passer til alle. Behovet for bilvask afhænger af årstid, hvor meget du kører, og hvad din bil udsættes for. Men der er klare retningslinjer, der hjælper dig med at træffe den rigtige beslutning.
        </p>

        <h2>Om vinteren: vask oftere end du tror</h2>
        <p>
          Fra november til marts bør bilen vaskes hyppigere end resten af året. Vejsalt fra kommunernes glatførebekæmpelse sætter sig fast på lak, undervogn og i hjulkasser. Salt er ikke synligt, men det arbejder konstant mod metaldelene under lakken.
        </p>
        <p>
          <strong>Anbefaling:</strong> Vask bilen ca. hver 1–2 uge i vinterperioden, og altid inden for 48 timer efter kørsel på kraftigt saltede veje.
        </p>

        <h2>Om foråret og efteråret: vask efter behov</h2>
        <p>
          I disse perioder er vejene ofte fugtige og beskidte, men saltmængden er lavere. Bilen samler vejsnavs, blade og pollen, som kan sætte sig fast i lak og filtre.
        </p>
        <ul>
          <li><strong>Forår:</strong> En grundig vask i april er vigtig – det er her du fjerner de sidste rester af vintermånedernes salt og vejsnavs. Interiøret trænger typisk til en gennemgang efter vinteren.</li>
          <li><strong>Efterår:</strong> Blade og træsaft fra parkerede biler under træer kan misfarve lakken. Vask bilen inden salt-sæsonen begynder og påfør voks som beskyttelse.</li>
        </ul>
        <p>
          <strong>Anbefaling:</strong> Vask bilen ca. hver 2–4 uge i forårs- og efterårssæsonen.
        </p>

        <h2>Om sommeren: pas på pollen, insekter og fugleklatter</h2>
        <p>
          Om sommeren er saltrisikoen lavest, men andre faktorer påvirker lakken:
        </p>
        <ul>
          <li><strong>Insekter:</strong> Insektrester indeholder syrer, der kan ætse sig ned i lakken, hvis de sidder i dagevis i varmen. Fjern dem hurtigt.</li>
          <li><strong>Fugleklatter:</strong> Fugleklatter er basiske og indeholder urinsyre, som kan skade lakken. De bør fjernes samme dag, særligt i direkte sollys, hvor varmen fremskynder processen.</li>
          <li><strong>Træsaft og pollen:</strong> Kan sætte sig fast og kræve mere end en overfladisk skylning for at fjerne.</li>
        </ul>
        <p>
          <strong>Anbefaling:</strong> Vask bilen ca. hver 3–4 uge om sommeren, og fjern insekter og fugleklatter løbende.
        </p>

        <h2>Andre faktorer der påvirker behovet</h2>

        <h3>Daglig kørsel vs. weekendbil</h3>
        <p>
          En bil, der bruges dagligt på motorvejen, samler langt mere snavs og vejsalt end en bil, der primært bruges i weekenden til kortere ture. En firmabil eller pendlerbil har behov for hyppigere vask end en byvogn.
        </p>

        <h3>Parkering under åben himmel vs. garage</h3>
        <p>
          Biler, der parkeres udenfor, udsættes for nedbør, fugleklatter, træsaft og pollen. Biler i garage er bedre beskyttet. Dog kan garager med kondensproblemer faktisk bidrage til fugt under bilen i vinterperioden.
        </p>

        <h3>Kystområder</h3>
        <p>
          Bor du tæt på kysten, udsættes din bil for salt fra havluften året rundt. Det er ikke synligt, men det fremskynder rust. I disse tilfælde anbefales hyppigere vask end ellers.
        </p>

        <h2>Hvornår skal interiøret vaskes?</h2>
        <p>
          Interiøret trænger til en grundig rengøring mindst to gange om året – typisk forår og efterår. Tegn på, at det er på tide:
        </p>
        <ul>
          <li>Synligt snavs på polstring og måtter</li>
          <li>Dårlig lugt i kabinen (cigaretrøg, madlugt, kæledyr, fugt)</li>
          <li>Støvede overflader på instrumentbræt og dørpaneler</li>
          <li>Vinduer, der dugger kraftigere end normalt (tegn på fugt i kabinen)</li>
        </ul>

        <h2>Sammenfatning: vaskehyppighed efter årstid</h2>
        <div className="guide-table-wrap">
          <table className="guide-table">
            <thead>
              <tr><th>Periode</th><th>Anbefalet hyppighed</th><th>Primær trussel</th></tr>
            </thead>
            <tbody>
              <tr><td>Vinter (nov–mar)</td><td>Hver 1–2 uge</td><td>Vejsalt, rust</td></tr>
              <tr><td>Forår (apr–maj)</td><td>Hver 2–3 uge</td><td>Pollen, gammelt salt</td></tr>
              <tr><td>Sommer (jun–aug)</td><td>Hver 3–4 uger</td><td>Insekter, fugleklatter</td></tr>
              <tr><td>Efterår (sep–okt)</td><td>Hver 2–3 uger</td><td>Blade, træsaft</td></tr>
            </tbody>
          </table>
        </div>

        <div className="guide-cta-box">
          <p><strong>Mobil dampvask på hele Sjælland</strong><br />Elite Vask kører ud til dig, uanset om du er hjemme eller på arbejdet. Book en tid direkte her på siden.</p>
          <a href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book tid</a>
        </div>
        <RelatedLinks />
      </div>
    </div>
  );
}
