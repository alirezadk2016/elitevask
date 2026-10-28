import Link from "next/link";
import Bi from "@/components/Bi";
import RelatedLinks from "@/components/RelatedLinks";
import GuideMore from "@/components/GuideMore";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, articleLd } from "@/lib/seo";
export const metadata = {
  title: "Vejsalt og bilens lak: sådan beskytter du bilen | Elite Vask",
  description: "Vejsalt er den største trussel mod bilens lak og undervogn i den danske vinter. Læs hvad salt gør ved din bil, og hvordan du beskytter den effektivt.",
  alternates: { canonical: "/guide/salt-og-lak" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: "Beskyt bilens lak mod vejsalt i Danmark",
    description: "Vejsalt er den største trussel mod bilens lak og undervogn i den danske vinter. Læs hvad salt gør ved din bil.",
    type: "article",
    locale: "da_DK",
  },
};

export default function SaltOgLak() {
  return (
    <div className="legal-page">
      <JsonLd items={[breadcrumbLd([{name:"Forside",path:"/"},{name:"Guide",path:"/guide"},{name:"Beskyt bilens lak mod vejsalt i Danmark",path:"/guide/salt-og-lak"}]),articleLd({title:"Beskyt bilens lak mod vejsalt i Danmark",description:"Vejsalt er den største trussel mod bilens lak og undervogn i den danske vinter. Læs hvad salt gør ved din bil, og hvordan du beskytter den effektivt.",path:"/guide/salt-og-lak",datePublished:"2026-06-01"})]} />
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to the home page" /></Link>
        <Bi
          da={<>

        <div className="guide-eyebrow">Bilpleje Guide</div>
        <h1>Hvordan beskytter du bilens lak mod salt i Danmark?</h1>
        <p className="legal-updated">Opdateret: juni 2026 · Læsetid: ca. 4 min</p>

        <p className="guide-lead">
          Hvert år fra november til marts strøes de danske veje med vejsalt. Det er nødvendigt for trafiksikkerheden, men det er bilens største fjende. Salt angriber lak, undervogn og metaldele – og skaderne sker langsomt og umærkeligt, helt til de bliver synlige som rust.
        </p>

        <h2>Hvad gør vejsalt ved din bil?</h2>
        <p>
          Vejsalt (natriumchlorid) opløses i vand og trænger ned i selv meget fine ridser og skader i lakken. Når saltvand kommer i kontakt med metal, starter en elektrokemisk reaktion – det vi kalder rust eller oxidation. Det sker i skjulte områder som:
        </p>
        <ul>
          <li>Undervognen og hjulkasserne, hvor snavs og salt samler sig</li>
          <li>Dørbunner og tærskler, som sjældent renses grundigt</li>
          <li>Kofangere og nummerpladebeslag</li>
          <li>Revner og stenslag i lakken, som ikke er synlige</li>
        </ul>
        <p>
          Rust, der starter indefra, er særlig farlig fordi den er usynlig i lang tid. Når den endelig viser sig som bobler under lakken eller som orange misfarvning, er skaden allerede alvorlig og dyr at udbedre.
        </p>

        <h2>Hvornår er saltperioden i Danmark?</h2>
        <p>
          Kommunerne strøer typisk fra midten af oktober til slutningen af marts, afhængigt af vejret. I milde vintre kan perioden være kortere, men selv én tur på saltet vej er nok til at sætte processen i gang, hvis bilen ikke vaskes bagefter.
        </p>
        <p>
          Et almindeligt misforståelse er, at det kun er nødvendigt at vaske bilen efter synlig vinterslud. Men salt kan sidde i skjulte kroge i dagevis, også selv om vejret er tørt og bilen ser ren ud.
        </p>

        <h2>Sådan beskytter du bilen mod vejsalt – trin for trin</h2>

        <h3>1. Vask bilen inden for 48 timer efter kørsel på saltet vej</h3>
        <p>
          Det er det vigtigste råd. Jo længere saltet sidder på bilen, desto mere tid har det til at arbejde sig ind under lakken. En grundig vask, der fjerner salt fra undervogn, hjulkasser og alle sprækker, er langt mere effektiv end at vente til weekenden.
        </p>

        <h3>2. Vær særlig opmærksom på undervognen</h3>
        <p>
          De fleste automatbilvaske vasker ikke undervognen ordentligt. Saltet samler sig i hjulkasser og underside, og det er her rusten starter. En professionel dampvask kan nå ind i smalle områder og fjerne salt, vejsnavs og gammel fedt fra undervognen.
        </p>

        <h3>3. Kontrollér og reparer stenslag hurtigt</h3>
        <p>
          Selv et lille stenslag, der blotter metallet under lakken, er nok til at rust kan starte. Stenslag bør repareres inden vinterperioden begynder – enten med retoucheringslak fra bilforhandleren eller hos en lakerer.
        </p>

        <h3>4. Påfør voksbeskyttelse inden vinteren</h3>
        <p>
          Voks skaber en hydrofob overflade, som gør det sværere for salt at hæfte sig til lakken. Påfør en god voksbehandling sidst i oktober, inden saltperioden starter, og gentag det om foråret efter en grundig vask.
        </p>

        <h3>5. Undgå at køre i sneskyl med stenhård frost</h3>
        <p>
          Når temperaturen er langt under nul, er traditionel bilvask ineffektiv – vandet fryser, inden det kan skylle salt væk. I stedet kan dampvask bruges, da den varme damp (over 100°C) opløser is og salt selv ved minusgrader.
        </p>

        <h2>Hvad er dampvask bedre til end traditionel bilvask om vinteren?</h2>
        <p>
          Varm damp trænger ind i sprækker og svært tilgængelige steder, hvor salt ofte gemmer sig. Den opløser salt og vejsnavs uden brug af aggressive kemikalier, som selv kan skade lakken. Dampvask er desuden skånsom mod lakoverfladen og efterlader ikke de mikroridser, som roterende børster fra automatvaske kan forårsage over tid.
        </p>

        <h2>Kort opsummering</h2>
        <ul>
          <li>Vejsalt starter rustprocessen i revner og skader på lakken</li>
          <li>Vask bilen inden for 48 timer efter kørsel på saltet vej</li>
          <li>Undervognen er det mest udsatte sted – vask den grundigt</li>
          <li>Reparer stenslag inden vinteren begynder</li>
          <li>Påfør voks inden saltperioden for at beskytte lakken</li>
          <li>Dampvask er særlig effektiv til at fjerne salt fra svært tilgængelige områder</li>
        </ul>

        <GuideMore current="/guide/salt-og-lak" />

        <div className="guide-cta-box">
          <p><strong>Har du brug for en grundig vintervask?</strong><br />Elite Vask tilbyder mobil dampvask på hele Sjælland – vi kører til dig og renser bilen grundigt for vejsalt, også undervognen.</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book tid</Link>
        </div>
          </>}
          en={<>
        <div className="guide-eyebrow">Car Care Guide</div>
        <h1>How do you protect your car&apos;s paint from salt in Denmark?</h1>
        <p className="legal-updated">Updated: June 2026 · Reading time: approx. 4 min</p>

        <p className="guide-lead">
          Every year from November to March, Danish roads are gritted with road salt. It is necessary for road safety, but it is your car&apos;s worst enemy. Salt attacks the paintwork, the underbody and metal parts – and the damage happens slowly and unnoticed, until it becomes visible as rust.
        </p>

        <h2>What does road salt do to your car?</h2>
        <p>
          Road salt (sodium chloride) dissolves in water and penetrates even very fine scratches and damage in the paint. When salt water comes into contact with metal, an electrochemical reaction starts – what we call rust or oxidation. It happens in hidden areas such as:
        </p>
        <ul>
          <li>The underbody and wheel arches, where dirt and salt collect</li>
          <li>Door bottoms and sills, which are rarely cleaned thoroughly</li>
          <li>Bumpers and number plate brackets</li>
          <li>Cracks and stone chips in the paint that are not visible</li>
        </ul>
        <p>
          Rust that starts from the inside is particularly dangerous because it stays invisible for a long time. When it finally shows as bubbles under the paint or as orange discolouration, the damage is already serious and expensive to repair.
        </p>

        <h2>When is the salt season in Denmark?</h2>
        <p>
          The municipalities typically grit from mid-October to the end of March, depending on the weather. In mild winters the period can be shorter, but even a single trip on a salted road is enough to start the process if the car is not washed afterwards.
        </p>
        <p>
          A common misconception is that you only need to wash the car after visible winter slush. But salt can sit in hidden crevices for days, even when the weather is dry and the car looks clean.
        </p>

        <h2>How to protect your car from road salt – step by step</h2>

        <h3>1. Wash the car within 48 hours of driving on a salted road</h3>
        <p>
          This is the most important advice. The longer the salt stays on the car, the more time it has to work its way under the paint. A thorough wash that removes salt from the underbody, wheel arches and every crevice is far more effective than waiting until the weekend.
        </p>

        <h3>2. Pay particular attention to the underbody</h3>
        <p>
          Most automatic car washes do not wash the underbody properly. Salt collects in the wheel arches and underside, and this is where rust starts. A professional steam wash can reach into narrow areas and remove salt, road grime and old grease from the underbody.
        </p>

        <h3>3. Check and repair stone chips quickly</h3>
        <p>
          Even a small stone chip that exposes the metal beneath the paint is enough for rust to start. Stone chips should be repaired before the winter period begins – either with touch-up paint from the car dealer or at a paint shop.
        </p>

        <h3>4. Apply wax protection before winter</h3>
        <p>
          Wax creates a hydrophobic surface that makes it harder for salt to stick to the paint. Apply a good wax treatment at the end of October, before the salt season starts, and repeat it in spring after a thorough wash.
        </p>

        <h3>5. Avoid washing in slush during hard frost</h3>
        <p>
          When the temperature is well below zero, a traditional car wash is ineffective – the water freezes before it can rinse the salt away. Instead, a steam wash can be used, as the hot steam (over 100°C) dissolves ice and salt even at sub-zero temperatures.
        </p>

        <h2>What is a steam wash better at than a traditional car wash in winter?</h2>
        <p>
          Hot steam penetrates crevices and hard-to-reach places where salt often hides. It dissolves salt and road grime without aggressive chemicals, which can themselves damage the paint. A steam wash is also gentle on the paint surface and does not leave the micro-scratches that rotating brushes in automatic car washes can cause over time.
        </p>

        <h2>Quick summary</h2>
        <ul>
          <li>Road salt starts the rusting process in cracks and damage in the paint</li>
          <li>Wash the car within 48 hours of driving on a salted road</li>
          <li>The underbody is the most exposed area – wash it thoroughly</li>
          <li>Repair stone chips before winter begins</li>
          <li>Apply wax before the salt season to protect the paint</li>
          <li>A steam wash is particularly effective at removing salt from hard-to-reach areas</li>
        </ul>

        <GuideMore current="/guide/salt-og-lak" />

        <div className="guide-cta-box">
          <p><strong>Need a thorough winter wash?</strong><br />Elite Vask offers mobile steam washing across Zealand – we come to you and thoroughly clean road salt off the car, including the underbody.</p>
          <Link href="/#vaelg" className="btn btn-green guide-cta-btn">See prices and book a time</Link>
        </div>
          </>}
        />
        <RelatedLinks />
      </div>
    </div>
  );
}
