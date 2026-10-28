"use client";
import { useLang } from "@/lib/useLang";

// Shared "how it works" section for the /bilvask/<by> pages (Mak rule 11:
// one content structure per page type), with in-text links from the city
// page to its pillar pages (rule 9). Only facts the site already states.
// Server-rendered in Danish; English after hydration for English visitors.
export default function CityProcess({ city, cityEn }) {
  const en = useLang() === "en";
  const c = en ? cityEn || city : city;
  if (en) {
    return (
      <>
        <h2>How a mobile car wash in {c} works</h2>
        <p>
          An alternative to the car wash in {c}: Elite Vask is a mobile car wash – instead of driving to a car wash and waiting in line, we come to the car and wash it by hand where it is parked.
        </p>
        <ol>
          <li><strong>Choose and book.</strong> Pick your car type and package, and book an available time online in a few minutes.</li>
          <li><strong>We drive out.</strong> We come to your address in {c} with all the equipment – with free travel.</li>
          <li><strong>The car is steam-cleaned.</strong> We work with steam and soft microfibre cloths – no brushes and no harsh chemicals – and use only 1–3 litres of water. Depending on the package it takes 1–3 hours. You don&apos;t need to be home, as long as we can reach the car.</li>
          <li><strong>You pay afterwards.</strong> No prepayment – you only pay once the car is clean.</li>
        </ol>
        <p>
          The price depends on the car type – small car, medium car, large car or van – and we wash electric cars too. All packages and prices are on the page with{" "}
          <a href="/priser">mobile car wash prices</a>. Want to know why we use steam instead of brushes? Read about{" "}
          <a href="/guide/dampvask-vs-traditionel">the difference between steam washing and a traditional car wash</a>. In winter,{" "}
          <a href="/guide/salt-og-lak">protecting the paint from road salt</a> matters most.
        </p>
      </>
    );
  }
  return (
    <>
      <h2>Sådan foregår mobil bilvask i {c}</h2>
      <p>
        Et alternativ til vaskehallen i {c}: Elite Vask er udekørende bilvask – i stedet for at køre til en vaskehal og vente i kø, kommer vi til bilen og vasker den i hånden, hvor den holder.
      </p>
      <ol>
        <li><strong>Vælg og book.</strong> Vælg biltype og pakke, og book en ledig tid online på få minutter.</li>
        <li><strong>Vi kører ud.</strong> Vi kommer til din adresse i {c} med alt udstyr – med gratis kørsel.</li>
        <li><strong>Bilen bliver damprenset.</strong> Vi arbejder med damp og bløde mikrofiberklude – ingen børster og ingen aggressive kemikalier – og bruger kun 1–3 liter vand. Afhængigt af pakken tager det 1–3 timer. Du behøver ikke være hjemme, så længe vi kan komme til bilen.</li>
        <li><strong>Du betaler bagefter.</strong> Ingen forudbetaling – du betaler først, når bilen er ren.</li>
      </ol>
      <p>
        Prisen afhænger af biltypen – lille bil, mellemstor bil, stor bil eller varebil – og elbiler vasker vi også. Alle pakker og priser står på siden med{" "}
        <a href="/priser">priser på mobil bilvask</a>. Vil du vide, hvorfor vi bruger damp i stedet for
        børster, så læs om <a href="/guide/dampvask-vs-traditionel">forskellen på dampvask og traditionel bilvask</a>.
        Om vinteren er <a href="/guide/salt-og-lak">beskyttelse af lakken mod vejsalt</a> det vigtigste.
      </p>
    </>
  );
}
