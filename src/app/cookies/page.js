export const metadata = {
  title: "Cookiepolitik – Elite Vask",
  description: "Læs Elite Vaskes cookiepolitik og se, hvilke cookies vi bruger på vores hjemmeside.",
  alternates: { canonical: "/cookies" },
};

export default function Cookies() {
  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <a href="/" className="legal-back">← Tilbage til forsiden</a>
        <h1>Cookiepolitik</h1>
        <p className="legal-updated">Senest opdateret: 19. juni 2026</p>

        <h2>Hvad er cookies?</h2>
        <p>
          Cookies er små tekstfiler, som gemmes på din computer, tablet eller mobiltelefon, når du besøger en hjemmeside. De hjælper hjemmesiden med at huske dine indstillinger og forbedre din oplevelse.
        </p>

        <h2>Hvilke cookies bruger vi?</h2>

        <h3>Nødvendige cookies</h3>
        <p>
          Disse cookies er nødvendige for, at hjemmesiden fungerer korrekt. De kan ikke slås fra. De indsamler ingen personhenførbare oplysninger.
        </p>
        <table className="cookie-table">
          <thead>
            <tr>
              <th>Navn</th>
              <th>Formål</th>
              <th>Udløb</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>session</td>
              <td>Bevarer din session og bookingstatus</td>
              <td>Session</td>
            </tr>
            <tr>
              <td>lang</td>
              <td>Husker dit sprogvalg (dansk/engelsk)</td>
              <td>1 år</td>
            </tr>
          </tbody>
        </table>

        <h3>Funktionelle cookies</h3>
        <p>
          Disse cookies giver hjemmesiden mulighed for at huske valg, du har foretaget (f.eks. biltype eller pakkevalg), og giver en mere personlig oplevelse.
        </p>
        <table className="cookie-table">
          <thead>
            <tr>
              <th>Navn</th>
              <th>Formål</th>
              <th>Udløb</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>wiz_state</td>
              <td>Gemmer midlertidigt dine valg i booking-guiden</td>
              <td>Session</td>
            </tr>
          </tbody>
        </table>

        <h3>Analytiske cookies (tredjepart)</h3>
        <p>
          Vi kan anvende analytiske cookies til at forstå, hvordan besøgende bruger vores hjemmeside. Oplysningerne er anonymiserede og bruges udelukkende til at forbedre hjemmesiden.
        </p>
        <table className="cookie-table">
          <thead>
            <tr>
              <th>Udbyder</th>
              <th>Formål</th>
              <th>Mere info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel Analytics</td>
              <td>Anonym trafikanalyse – antal besøg, sider, enheder</td>
              <td><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com</a></td>
            </tr>
          </tbody>
        </table>

        <h3>Markedsføringscookies (tredjepart)</h3>
        <p>
          Følgende tredjepartswidgets kan sætte cookies, når de er aktiveret på siden:
        </p>
        <table className="cookie-table">
          <thead>
            <tr>
              <th>Udbyder</th>
              <th>Formål</th>
              <th>Mere info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Trustpilot</td>
              <td>Viser anmeldelseswidget</td>
              <td><a href="https://legal.trustpilot.com/end-user-privacy-terms" target="_blank" rel="noopener noreferrer">trustpilot.com</a></td>
            </tr>
          </tbody>
        </table>

        <h2>Sådan administrerer du cookies</h2>
        <p>
          Du kan til enhver tid slette eller blokere cookies i din browsers indstillinger. Vær opmærksom på, at deaktivering af visse cookies kan påvirke hjemmesidens funktionalitet.
        </p>
        <p>Vejledning til de mest anvendte browsere:</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/da/kb/slette-cookies-fjerne-oplysninger-fra-websteder" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/da-dk/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
          <li><a href="https://support.microsoft.com/da-dk/topic/slette-og-administrere-cookies" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        </ul>
        <p>
          Du kan også fravælge cookies til analyseformål via <a href="https://www.youronlinechoices.com/dk/" target="_blank" rel="noopener noreferrer">youronlinechoices.com</a>.
        </p>

        <h2>Ændringer i cookiepolitikken</h2>
        <p>
          Vi forbeholder os retten til at opdatere denne cookiepolitik. Den aktuelle version er altid tilgængelig på vores hjemmeside.
        </p>

        <h2>Kontakt</h2>
        <p>
          Har du spørgsmål til vores brug af cookies, er du velkommen til at kontakte os:<br />
          <a href="mailto:info@elite-vask.dk">info@elite-vask.dk</a> · +45 24 44 03 21
        </p>
      </div>
    </div>
  );
}
