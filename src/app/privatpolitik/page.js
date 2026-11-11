import Link from "next/link";
import Bi from "@/components/Bi";
export const metadata = {
  title: "Privatlivspolitik – Elite Vask",
  description: "Læs Elite Vaskes privatlivspolitik og se, hvordan vi behandler dine personoplysninger.",
  alternates: { canonical: "/privatpolitik" },
};

export default function Privatpolitik() {
  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to home" /></Link>
        <Bi
          da={<>
        <h1 id="privacy-policy">Privatlivspolitik</h1>
        <p className="legal-updated">Senest opdateret: 19. juni 2026</p>

        <h2>1. Dataansvarlig</h2>
        <p>
          Elite Vask er dataansvarlig for behandlingen af dine personoplysninger.<br />
          CVR-nr.: 46392264<br />
          Sjælland, Danmark<br />
          Telefon: +45 24 44 03 21<br />
          E-mail: info@elite-vask.dk
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
          <li><strong>Sletning</strong> – få slettet dine oplysninger (&quot;retten til at blive glemt&quot;), medmindre vi har en lovmæssig pligt til opbevaring</li>
          <li><strong>Begrænsning</strong> – få begrænset behandlingen i visse situationer</li>
          <li><strong>Dataportabilitet</strong> – modtage dine data i et struktureret, maskinlæsbart format</li>
          <li><strong>Indsigelse</strong> – gøre indsigelse mod behandling baseret på legitim interesse</li>
        </ul>
        <p>
          Ønsker du at gøre brug af dine rettigheder, kontakt os på <a href="mailto:info@elite-vask.dk">info@elite-vask.dk</a>. Vi besvarer din henvendelse senest 30 dage.
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
          </>}
          en={<>
        <h1 id="privacy-policy">Privacy Policy</h1>
        <p className="legal-updated">Last updated: 19 June 2026</p>
        <p>This is an English translation for convenience; the Danish version is legally binding.</p>

        <h2>1. Data controller</h2>
        <p>
          Elite Vask is the data controller for the processing of your personal data.<br />
          CVR no.: 46392264<br />
          Zealand, Denmark<br />
          Phone: +45 24 44 03 21<br />
          Email: info@elite-vask.dk
        </p>

        <h2>2. What information do we collect?</h2>
        <p>When you book a wash or contact us, we may collect the following information:</p>
        <ul>
          <li>Name</li>
          <li>Address (for service delivery)</li>
          <li>Phone number</li>
          <li>Email address</li>
          <li>Car type and registration number (for correct treatment)</li>
          <li>Postcode (to confirm the service zone)</li>
          <li>Booking details and history</li>
        </ul>

        <h2>3. Purpose of the processing</h2>
        <p>We process your information for the following purposes:</p>
        <ul>
          <li>To confirm and carry out the booking</li>
          <li>To contact you about your appointment (confirmation, reminder, changes)</li>
          <li>To invoice for work performed</li>
          <li>To respond to your enquiries</li>
          <li>To comply with legal obligations (e.g. bookkeeping)</li>
        </ul>

        <h2>4. Legal basis</h2>
        <p>
          The processing is based on:
        </p>
        <ul>
          <li><strong>Performance of a contract</strong> (GDPR Art. 6(1)(b)) – when you book a wash</li>
          <li><strong>Legal obligation</strong> (GDPR Art. 6(1)(c)) – e.g. bookkeeping requirements</li>
          <li><strong>Legitimate interest</strong> (GDPR Art. 6(1)(f)) – e.g. when following up on previous customer relationships</li>
        </ul>

        <h2>5. Retention</h2>
        <p>
          We keep your information for as long as necessary to fulfil the purpose for which it was collected. Accounting data is kept for 5 years in accordance with the Danish Bookkeeping Act. Other information is deleted no later than 2 years after the last contact, unless you have asked us to delete it earlier.
        </p>

        <h2>6. Sharing with third parties</h2>
        <p>
          We do not sell your personal data. We may share information with:
        </p>
        <ul>
          <li><strong>Booking system / IT suppliers</strong> – to operate our website and booking platform</li>
          <li><strong>Payment providers</strong> – for digital payments</li>
          <li><strong>Public authorities</strong> – if we are legally required to do so</li>
        </ul>
        <p>All data processors are bound by data processing agreements and may not use your data for their own purposes.</p>

        <h2>7. Your rights</h2>
        <p>You have the right at any time to:</p>
        <ul>
          <li><strong>Access</strong> – be informed of what data we hold about you</li>
          <li><strong>Rectification</strong> – have incorrect information corrected</li>
          <li><strong>Erasure</strong> – have your information deleted (&quot;the right to be forgotten&quot;), unless we are legally required to retain it</li>
          <li><strong>Restriction</strong> – have the processing restricted in certain situations</li>
          <li><strong>Data portability</strong> – receive your data in a structured, machine-readable format</li>
          <li><strong>Objection</strong> – object to processing based on legitimate interest</li>
        </ul>
        <p>
          If you wish to exercise your rights, contact us at <a href="mailto:info@elite-vask.dk">info@elite-vask.dk</a>. We will respond to your enquiry within 30 days.
        </p>

        <h2>8. Complaints</h2>
        <p>
          If you object to our processing of your personal data, you can file a complaint with:
        </p>
        <p>
          <strong>Datatilsynet</strong> (the Danish Data Protection Agency)<br />
          Carl Jacobsens Vej 35, 2500 Valby<br />
          Phone: 33 19 32 00<br />
          <a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer">datatilsynet.dk</a>
        </p>

        <h2>9. Cookies</h2>
        <p>
          Our website uses cookies. Read more in our <a href="/cookies">Cookie Policy</a>.
        </p>

        <h2>10. Changes to the privacy policy</h2>
        <p>
          We reserve the right to update this policy. The current version is always available on our website with the date of the latest update.
        </p>
          </>}
        />
      </div>
    </div>
  );
}
