import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import GuideMore from "@/components/GuideMore";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, articleLd } from "@/lib/seo";
export const metadata = {
  title: "Hvor ofte bør man vaske bilen? Råd efter årstid | Elite Vask",
  description: "Hvor tit skal bilen vaskes? Svaret afhænger af årstid, brug og parkeringsforhold. Her er en konkret guide til, hvornår det er nødvendigt.",
  alternates: { canonical: "/guide/hvor-ofte" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
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
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

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

        <GuideMore current="/guide/hvor-ofte" />

        <div className="guide-cta-box">
          <p><strong>Mobil dampvask på hele Sjælland</strong><br />Elite Vask kører ud til dig, uanset om du er hjemme eller på arbejdet. Book en tid direkte her på siden.</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book tid</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Car Care Guide</div>
        <h1>How often should you wash your car?</h1>
        <p className="legal-updated">Updated: June 2026 · Reading time: approx. 3 min</p>

        <p className="guide-lead">
          There is no single answer that suits everyone. How often your car needs washing depends on the season, how much you drive and what your car is exposed to. But there are clear guidelines that help you make the right decision.
        </p>

        <h2>In winter: wash more often than you think</h2>
        <p>
          From November to March the car should be washed more frequently than the rest of the year. Road salt from the municipalities&apos; gritting sticks to the paintwork, the underbody and the wheel arches. Salt is not visible, but it works constantly against the metal parts beneath the paint.
        </p>
        <p>
          <strong>Recommendation:</strong> Wash the car roughly every 1–2 weeks during the winter period, and always within 48 hours of driving on heavily salted roads.
        </p>

        <h2>In spring and autumn: wash as needed</h2>
        <p>
          In these periods the roads are often wet and dirty, but there is less salt. The car collects road grime, leaves and pollen, which can stick to the paintwork and filters.
        </p>
        <ul>
          <li><strong>Spring:</strong> A thorough wash in April is important – this is when you remove the last traces of the winter months&apos; salt and road grime. The interior also typically needs attention after the winter.</li>
          <li><strong>Autumn:</strong> Leaves and tree sap on cars parked under trees can discolour the paint. Wash the car before the salt season begins and apply wax as protection.</li>
        </ul>
        <p>
          <strong>Recommendation:</strong> Wash the car roughly every 2–4 weeks in the spring and autumn seasons.
        </p>

        <h2>In summer: watch out for pollen, insects and bird droppings</h2>
        <p>
          In summer the risk from salt is at its lowest, but other factors affect the paintwork:
        </p>
        <ul>
          <li><strong>Insects:</strong> Insect remains contain acids that can etch into the paint if they are left for days in the heat. Remove them quickly.</li>
          <li><strong>Bird droppings:</strong> Bird droppings are alkaline and contain uric acid, which can damage the paint. They should be removed the same day, especially in direct sunlight, where the heat speeds up the process.</li>
          <li><strong>Tree sap and pollen:</strong> Can stick and need more than a superficial rinse to remove.</li>
        </ul>
        <p>
          <strong>Recommendation:</strong> Wash the car roughly every 3–4 weeks in summer, and remove insects and bird droppings as they appear.
        </p>

        <h2>Other factors that affect the need</h2>

        <h3>Daily driving vs. weekend car</h3>
        <p>
          A car used daily on the motorway collects far more dirt and road salt than a car mainly used at weekends for shorter trips. A company car or commuter car needs washing more often than a city runabout.
        </p>

        <h3>Parking in the open vs. a garage</h3>
        <p>
          Cars parked outside are exposed to rain, bird droppings, tree sap and pollen. Cars in a garage are better protected. However, garages with condensation problems can actually contribute to moisture under the car during the winter period.
        </p>

        <h3>Coastal areas</h3>
        <p>
          If you live close to the coast, your car is exposed to salt from the sea air all year round. It is not visible, but it accelerates rust. In these cases more frequent washing than usual is recommended.
        </p>

        <h2>When should the interior be cleaned?</h2>
        <p>
          The interior needs a thorough clean at least twice a year – typically in spring and autumn. Signs that it is time:
        </p>
        <ul>
          <li>Visible dirt on upholstery and mats</li>
          <li>Bad smells in the cabin (cigarette smoke, food smells, pets, damp)</li>
          <li>Dusty surfaces on the dashboard and door panels</li>
          <li>Windows that steam up more than normal (a sign of moisture in the cabin)</li>
        </ul>

        <h2>Summary: washing frequency by season</h2>
        <div className="guide-table-wrap">
          <table className="guide-table">
            <thead>
              <tr><th>Period</th><th>Recommended frequency</th><th>Main threat</th></tr>
            </thead>
            <tbody>
              <tr><td>Winter (Nov–Mar)</td><td>Every 1–2 weeks</td><td>Road salt, rust</td></tr>
              <tr><td>Spring (Apr–May)</td><td>Every 2–3 weeks</td><td>Pollen, old salt</td></tr>
              <tr><td>Summer (Jun–Aug)</td><td>Every 3–4 weeks</td><td>Insects, bird droppings</td></tr>
              <tr><td>Autumn (Sep–Oct)</td><td>Every 2–3 weeks</td><td>Leaves, tree sap</td></tr>
            </tbody>
          </table>
        </div>

        <GuideMore current="/guide/hvor-ofte" />

        <div className="guide-cta-box">
          <p><strong>Mobile steam wash across Zealand</strong><br />Elite Vask comes to you, whether you are at home or at work. Book a time directly here on the site.</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book a time</Link>
        </div>
          </>}
        />
        <RelatedLinks />
      </div>
    </div>
  );
}
