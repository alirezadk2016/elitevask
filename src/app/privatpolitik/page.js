export const metadata = {
  title: "Privatlivspolitik – Elite Vask",
  description: "Læs Elite Vaskes privatlivspolitik og se, hvordan vi behandler dine personoplysninger.",
};

export default function Privatpolitik() {
  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <a href="/" className="legal-back">← Tilbage til forsiden</a>
        <h1>Privatlivspolitik</h1>
        <p className="legal-updated">Senest opdateret: 19. juni 2026</p>

        <h2>1. Dataansvarlig</h2>
        <p>
          Elite Vask er dataansvarlig for behandlingen af dine personoplysninger.<br />
          CVR-nr.: 46392264<br />
          Sjælland, Danmark<br />
          Telefon: +45 24 44 03 21<br />
          E-mail: elitevask01@gmail.com
        </p>

        <h2>2. Hvilke oplysninger indsamler vi?</h2>
        <p>Når du booker en vask eller kontakter os, kan vi indsamle følgende oplysninger:</p>
        <ul>
          <li>Navn</li>
          <li>Adresse (til serviceleverance)</li>
          <li>Telefonnummer</li>
          <li>E-mailadresse</li>
          <li>Biltype og registreringsnummer (til korrekt behandling)</li>
          <li>Postnummer (til servicezonebekræftelse)</li>
          <li>Bookingoplysninger og historik</li>
        </ul>

        <h2>3. Formål med behandlingen</h2>
        <p>Vi behandler dine oplysninger til følgende formål:</p>
        <ul>
          <li>At bekræfte og gennemføre bookingen</li>
          <li>At kontakte dig om din aftale (bekræftelse, påminding, ændringer)</li>
          <li>At fakturere for udført arbejde</li>
          <li>At besvare dine henvendelser</li>
          <li>At overholde lovmæssige forpligtelser (f.eks. bogføring)</li>
        </ul>

        <h2>4. Retsgrundlag</h2>
        <p>
          Behandlingen sker på baggrund af:
        </p>
        <ul>
          <li><strong>Opfyldelse af aftale</strong> (GDPR art. 6, stk. 1, litra b) – når du booker en vask</li>
          <li><strong>Retlig forpligtelse</strong> (GDPR art. 6, stk. 1, litra c) – f.eks. bogføringskrav</li>
          <li><strong>Berettiget interesse</strong> (GDPR art. 6, stk. 1, litra f) – f.eks. ved opfølgning på tidligere kundeforhold</li>
        </ul>

        <h2>5. Opbevaring</h2>
        <p>
          Vi opbevarer dine oplysninger så længe, det er nødvendigt for at opfylde formålet med indsamlingen. Regnskabsdata opbevares i 5 år i henhold til bogføringsloven. Øvrige oplysninger slettes senest 2 år efter sidste kontakt, medmindre du har bedt os om at slette dem tidligere.
        </p>

        <h2>6. Deling med tredjeparter</h2>
        <p>
          Vi sælger ikke dine personoplysninger. Vi kan dele oplysninger med:
        </p>
        <ul>
          <li><strong>Bookingsystem / IT-leverandører</strong> – til drift af vores hjemmeside og bookingplatform</li>
          <li><strong>Betalingsudbydere</strong> – ved digital betaling</li>
          <li><strong>Offentlige myndigheder</strong> – hvis vi er lovmæssigt forpligtet hertil</li>
        </ul>
        <p>Alle databehandlere er underlagt databehandleraftaler og må ikke anvende dine data til egne formål.</p>

        <h2>7. Dine rettigheder</h2>
        <p>Du har til enhver tid ret til at:</p>
        <ul>
          <li><strong>Indsigt</strong> – få oplyst, hvilke data vi har om dig</li>
          <li><strong>Berigtigelse</strong> – få rettet ukorrekte oplysninger</li>
          <li><strong>Sletning</strong> – få slettet dine oplysninger ("retten til at blive glemt"), medmindre vi har en lovmæssig pligt til opbevaring</li>
          <li><strong>Begrænsning</strong> – få begrænset behandlingen i visse situationer</li>
          <li><strong>Dataportabilitet</strong> – modtage dine data i et struktureret, maskinlæsbart format</li>
          <li><strong>Indsigelse</strong> – gøre indsigelse mod behandling baseret på legitim interesse</li>
        </ul>
        <p>
          Ønsker du at gøre brug af dine rettigheder, kontakt os på <a href="mailto:elitevask01@gmail.com">elitevask01@gmail.com</a>. Vi besvarer din henvendelse senest 30 dage.
        </p>

        <h2>8. Klage</h2>
        <p>
          Har du indsigelser mod vores behandling af dine personoplysninger, kan du klage til:
        </p>
        <p>
          <strong>Datatilsynet</strong><br />
          Carl Jacobsens Vej 35, 2500 Valby<br />
          Telefon: 33 19 32 00<br />
          <a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer">datatilsynet.dk</a>
        </p>

        <h2>9. Cookies</h2>
        <p>
          Vores hjemmeside anvender cookies. Læs mere i vores <a href="/cookies">Cookiepolitik</a>.
        </p>

        <h2>10. Ændringer i privatlivspolitikken</h2>
        <p>
          Vi forbeholder os retten til at opdatere denne politik. Den aktuelle version er altid tilgængelig på vores hjemmeside med angivelse af opdateringsdato.
        </p>
      </div>
    </div>
  );
}
