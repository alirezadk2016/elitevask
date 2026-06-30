export const metadata = {
  title: "Beskyt bilens lak mod vejsalt i Danmark – Elite Vask Guide",
  description: "Vejsalt er den største trussel mod bilens lak og undervogn i den danske vinter. Læs hvad salt gør ved din bil, og hvordan du beskytter den effektivt.",
  alternates: { canonical: "/guide/salt-og-lak" },
  openGraph: {
    title: "Beskyt bilens lak mod vejsalt i Danmark",
    description: "Vejsalt er den største trussel mod bilens lak og undervogn i den danske vinter. Læs hvad salt gør ved din bil.",
    type: "article",
    locale: "da_DK",
  },
};

export default function SaltOgLak() {
  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <a href="/" className="legal-back">← Tilbage til forsiden</a>

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

        <div className="guide-cta-box">
          <p><strong>Har du brug for en grundig vintervask?</strong><br />Elite Vask tilbyder mobil dampvask på hele Sjælland – vi kører til dig og renser bilen grundigt for vejsalt, også undervognen.</p>
          <a href="/#vaelg" className="btn btn-green guide-cta-btn">Se priser og book tid</a>
        </div>
      </div>
    </div>
  );
}
