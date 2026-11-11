import Link from "next/link";
import Bi from "@/components/Bi";
export const metadata = {
  title: "Handelsbetingelser – Elite Vask",
  description: "Læs Elite Vaskes handelsbetingelser for mobil bil dampvask på Sjælland.",
  alternates: { canonical: "/handelsbetingelser" },
};

export default function Handelsbetingelser() {
  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <Link href="/" className="legal-back"><Bi da="← Tilbage til forsiden" en="← Back to home" /></Link>
        <Bi da={<>
        <h1 id="terms">Handelsbetingelser</h1>
        <p className="legal-updated">Senest opdateret: 19. juni 2026</p>

        <h2>1. Virksomhedsoplysninger</h2>
        <p>
          Elite Vask<br />
          CVR-nr.: 46392264<br />
          Sjælland, Danmark<br />
          Telefon: +45 24 44 03 21<br />
          E-mail: info@elite-vask.dk
        </p>

        <h2>2. Bestilling og aftale</h2>
        <p>
          En bindende aftale opstår, når du modtager en bekræftelse fra Elite Vask – enten pr. telefon, SMS eller e-mail. Bestillinger via vores online bookingsystem er at betragte som en forespørgsel, indtil vi har bekræftet tid og dato.
        </p>
        <p>
          Vi forbeholder os retten til at afvise bestillinger, hvis vi vurderer, at opgaven ikke kan udføres forsvarligt (f.eks. pga. ekstreme vejrforhold, manglende adgang til køretøjet eller anden force majeure).
        </p>

        <h2>3. Priser og betaling</h2>
        <p>
          Alle priser på vores hjemmeside er vejledende og inkl. moms. Den endelige pris aftales og bekræftes ved booking baseret på biltype, valgt pakke og eventuelle tilvalg.
        </p>
        <p>
          Betaling sker efter udført arbejde og til din fulde tilfredshed. Vi accepterer kontant betaling, MobilePay og bankoverførsel. Der opkræves ingen forudbetaling.
        </p>
        <p>
          Kørsel til og fra din adresse inden for vores serviceområde (Sjælland, postnumre 1000–4799, ekskl. visse øer) er gratis og indgår i prisen.
        </p>

        <h2>4. Aflysning og ændring</h2>
        <p>
          Du kan frit aflyse din booking. Vi beder om, at aflysning sker senest <strong>24 timer</strong> før den aftalte tid, så vi kan disponere vores kapacitet optimalt.
        </p>
        <p>
          Aflysning kan nemt gøres via <strong>annulleringslinket</strong> i din bookingbekræftelse på e-mail – klik blot på &quot;Annuller booking&quot; i mailen. Du kan også kontakte os pr. telefon (+45 24 44 03 21), SMS eller e-mail.
        </p>
        <p>
          Elite Vask kan aflyse eller ombooke i tilfælde af sygdom, ekstreme vejrforhold eller andre uforudsete omstændigheder. Vi kontakter dig hurtigst muligt og tilbyder en ny tid.
        </p>

        <h2>5. Tilfredshedsgaranti</h2>
        <p>
          Vi garanterer din tilfredshed. Hvis du ikke er tilfreds med resultatet, beder vi dig gøre os opmærksom på det samme dag, så vi har mulighed for at udbedre eventuelle mangler. Vi fakturerer udelukkende, når du er tilfreds med det udførte arbejde.
        </p>

        <h2>6. Ansvar og forsikring</h2>
        <p>
          Elite Vask er forsikret og behandler alle køretøjer med den største omhu. Vi anvender professionelle, ph-neutrale produkter og skånsomme metoder, der ikke beskadiger lak, glas eller interiør.
        </p>
        <p>
          Elite Vask er ikke ansvarlig for skader, der skyldes allerede eksisterende svagheder i lak, glas, gummi eller interiørmaterialer, som ikke var synlige inden behandlingen. Kunden bør informere os om eventuelle sådanne forhold inden start.
        </p>
        <p>
          Ved eventuelle reklamationer skal disse fremsættes skriftligt til info@elite-vask.dk senest 3 dage efter behandlingen.
        </p>

        <h2>7. Kundens forpligtelser</h2>
        <p>
          Kunden er ansvarlig for at sikre, at køretøjet er tilgængeligt på det aftalte tidspunkt og sted, og at der er fri adgang og tilstrækkelig plads til at arbejde rundt om bilen. Kunden bør fjerne personlige ejendele og løse genstande fra bilen inden behandlingen.
        </p>

        <h2>8. Serviceområde</h2>
        <p>
          Elite Vask betjener postnumre på Sjælland i intervallet 1000–4799 (visse øer og utilgængelige adresser kan være undtaget). Kontakt os, hvis du er i tvivl om, vi dækker dit område.
        </p>

        <h2>9. Personoplysninger</h2>
        <p>
          Behandling af personoplysninger sker i overensstemmelse med vores <a href="/privatpolitik">Privatlivspolitik</a> og gældende dansk og EU-lovgivning (GDPR).
        </p>

        <h2>10. Tvister og lovvalg</h2>
        <p>
          Enhver tvist mellem parterne er underlagt dansk ret og skal forsøges løst i mindelighed. Kan parterne ikke nå til enighed, kan sagen indbringes for de almindelige danske domstole med værneting i den retskreds, hvor Elite Vask har hjemsted.
        </p>
        <p>
          Du kan også indbringe en klage til <strong>Forbrugerklagenævnet</strong> via <a href="https://www.forbrug.dk" target="_blank" rel="noopener noreferrer">forbrug.dk</a> eller via EU&apos;s online klageportal: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
        </p>
        </>} en={<>
        <h1 id="terms">Terms and Conditions</h1>
        <p className="legal-updated">Last updated: 19 June 2026</p>
        <p>This is an English translation for convenience; the Danish version is legally binding.</p>

        <h2>1. Company information</h2>
        <p>
          Elite Vask<br />
          CVR no.: 46392264<br />
          Zealand, Denmark<br />
          Phone: +45 24 44 03 21<br />
          E-mail: info@elite-vask.dk
        </p>

        <h2>2. Ordering and agreement</h2>
        <p>
          A binding agreement is made when you receive a confirmation from Elite Vask – by phone, text message or e-mail. Orders placed through our online booking system are considered a request until we have confirmed the date and time.
        </p>
        <p>
          We reserve the right to decline orders if we judge that the job cannot be carried out responsibly (e.g. due to extreme weather, no access to the vehicle or other force majeure).
        </p>

        <h2>3. Prices and payment</h2>
        <p>
          All prices on our website are indicative and include VAT. The final price is agreed and confirmed at booking, based on car type, chosen package and any extras.
        </p>
        <p>
          Payment is made after the work is done and to your full satisfaction. We accept cash, MobilePay and bank transfer. No prepayment is charged.
        </p>
        <p>
          Travel to and from your address within our service area (Zealand, postcodes 1000–4799, excluding certain islands) is free and included in the price.
        </p>

        <h2>4. Cancellation and changes</h2>
        <p>
          You are free to cancel your booking. We ask that you cancel no later than <strong>24 hours</strong> before the agreed time, so we can plan our capacity.
        </p>
        <p>
          You can easily cancel using the <strong>cancellation link</strong> in your booking confirmation e-mail – just click &quot;Annuller booking&quot; (Cancel booking) in the e-mail. You can also contact us by phone (+45 24 44 03 21), text message or e-mail.
        </p>
        <p>
          Elite Vask may cancel or rebook in case of illness, extreme weather or other unforeseen circumstances. We will contact you as soon as possible and offer a new time.
        </p>

        <h2>5. Satisfaction guarantee</h2>
        <p>
          We guarantee your satisfaction. If you are not happy with the result, please tell us the same day so we have the chance to put right any shortcomings. We only invoice when you are satisfied with the work.
        </p>

        <h2>6. Liability and insurance</h2>
        <p>
          Elite Vask is insured and treats every vehicle with the greatest care. We use professional, pH-neutral products and gentle methods that do not damage paint, glass or interior.
        </p>
        <p>
          Elite Vask is not liable for damage caused by existing weaknesses in paint, glass, rubber or interior materials that were not visible before the treatment. The customer should inform us of any such conditions before we start.
        </p>
        <p>
          Any complaints must be made in writing to info@elite-vask.dk no later than 3 days after the treatment.
        </p>

        <h2>7. Customer obligations</h2>
        <p>
          The customer is responsible for making sure the vehicle is available at the agreed time and place, and that there is free access and enough space to work around the car. The customer should remove personal belongings and loose items from the car before the treatment.
        </p>

        <h2>8. Service area</h2>
        <p>
          Elite Vask serves postcodes on Zealand in the range 1000–4799 (certain islands and inaccessible addresses may be excluded). Contact us if you are unsure whether we cover your area.
        </p>

        <h2>9. Personal data</h2>
        <p>
          Personal data is processed in accordance with our <a href="/privatpolitik">Privacy Policy</a> and applicable Danish and EU law (GDPR).
        </p>

        <h2>10. Disputes and governing law</h2>
        <p>
          Any dispute between the parties is governed by Danish law and should first be settled amicably. If the parties cannot agree, the case may be brought before the ordinary Danish courts, with venue in the jurisdiction where Elite Vask is based.
        </p>
        <p>
          You can also file a complaint with the <strong>Danish Consumer Complaints Board (Forbrugerklagenævnet)</strong> via <a href="https://www.forbrug.dk" target="_blank" rel="noopener noreferrer">forbrug.dk</a> or via the EU&apos;s online complaints portal: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
        </p>
        </>} />
      </div>
    </div>
  );
}
