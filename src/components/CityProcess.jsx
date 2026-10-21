// Shared "how it works" section for the /bilvask/<by> pages (Mak rule 11:
// one content structure per page type), with in-text links from the city
// page to its pillar pages (rule 9). Only facts the site already states.
export default function CityProcess({ city }) {
  return (
    <>
      <h2>Sådan foregår mobil bilvask i {city}</h2>
      <ol>
        <li><strong>Vælg og book.</strong> Vælg biltype og pakke, og book en ledig tid online på få minutter.</li>
        <li><strong>Vi kører ud.</strong> Vi kommer til din adresse i {city} med alt udstyr – kørslen er gratis.</li>
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
