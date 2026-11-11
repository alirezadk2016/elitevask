import Link from "next/link";
import Bi from "@/components/Bi";
export const metadata = {
  title: "Cookiepolitik – Elite Vask",
  description: "Læs Elite Vaskes cookiepolitik og se, hvilke cookies vi bruger på vores hjemmeside.",
  alternates: { canonical: "/cookies" },
};

export default function Cookies() {
  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to home" /></Link>
        <Bi
          da={<>
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
          </>}
          en={<>
        <h1>Cookie Policy</h1>
        <p className="legal-updated">Last updated: 19 June 2026</p>
        <p>This is an English translation for convenience; the Danish version is legally binding.</p>

        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files that are stored on your computer, tablet or mobile phone when you visit a website. They help the website remember your settings and improve your experience.
        </p>

        <h2>Which cookies do we use?</h2>

        <h3>Necessary cookies</h3>
        <p>
          These cookies are necessary for the website to function properly. They cannot be switched off. They do not collect any personally identifiable information.
        </p>
        <table className="cookie-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Purpose</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>session</td>
              <td>Keeps your session and booking status</td>
              <td>Session</td>
            </tr>
            <tr>
              <td>lang</td>
              <td>Remembers your language choice (Danish/English)</td>
              <td>1 year</td>
            </tr>
          </tbody>
        </table>

        <h3>Functional cookies</h3>
        <p>
          These cookies allow the website to remember choices you have made (e.g. car type or package choice) and provide a more personal experience.
        </p>
        <table className="cookie-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Purpose</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>wiz_state</td>
              <td>Temporarily stores your choices in the booking guide</td>
              <td>Session</td>
            </tr>
          </tbody>
        </table>

        <h3>Analytical cookies (third party)</h3>
        <p>
          We may use analytical cookies to understand how visitors use our website. The information is anonymised and used solely to improve the website.
        </p>
        <table className="cookie-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Purpose</th>
              <th>More info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel Analytics</td>
              <td>Anonymous traffic analysis – number of visits, pages, devices</td>
              <td><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com</a></td>
            </tr>
          </tbody>
        </table>

        <h3>Marketing cookies (third party)</h3>
        <p>
          The following third-party widgets may set cookies when they are enabled on the page:
        </p>
        <table className="cookie-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Purpose</th>
              <th>More info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Trustpilot</td>
              <td>Displays the review widget</td>
              <td><a href="https://legal.trustpilot.com/end-user-privacy-terms" target="_blank" rel="noopener noreferrer">trustpilot.com</a></td>
            </tr>
          </tbody>
        </table>

        <h2>How to manage cookies</h2>
        <p>
          You can delete or block cookies at any time in your browser&apos;s settings. Please note that disabling certain cookies may affect the website&apos;s functionality.
        </p>
        <p>Guides for the most widely used browsers:</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/da/kb/slette-cookies-fjerne-oplysninger-fra-websteder" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/da-dk/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
          <li><a href="https://support.microsoft.com/da-dk/topic/slette-og-administrere-cookies" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        </ul>
        <p>
          You can also opt out of cookies for analytical purposes via <a href="https://www.youronlinechoices.com/dk/" target="_blank" rel="noopener noreferrer">youronlinechoices.com</a>.
        </p>

        <h2>Changes to the cookie policy</h2>
        <p>
          We reserve the right to update this cookie policy. The current version is always available on our website.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about our use of cookies, you are welcome to contact us:<br />
          <a href="mailto:info@elite-vask.dk">info@elite-vask.dk</a> · +45 24 44 03 21
        </p>
          </>}
        />
      </div>
    </div>
  );
}
