import Link from "next/link";
// Internal-links block for the standalone pages (city/guide/kontakt/legal),
// which otherwise only link back to the homepage.
//
// Few links, to related pages, in varied words: a block of 16 identical chips
// on every page split each page's value thin and told search engines nothing
// about which pages belong together. A city page now links to the core pages
// and its geographic neighbours only; the hub pages (priser, kontakt) still
// list every city, because there the list is the structure itself.
const CITIES = {
  koebenhavn:    ["København",     ["roskilde", "koege", "hilleroed", "helsingoer"]],
  roskilde:      ["Roskilde",      ["koebenhavn", "koege", "ringsted", "frederikssund"]],
  koege:         ["Køge",          ["stevns", "roskilde", "ringsted", "koebenhavn"]],
  naestved:      ["Næstved",       ["ringsted", "faxe", "stevns"]],
  ringsted:      ["Ringsted",      ["roskilde", "koege", "naestved", "faxe"]],
  helsingoer:    ["Helsingør",     ["hilleroed", "koebenhavn"]],
  hilleroed:     ["Hillerød",      ["helsingoer", "frederikssund", "koebenhavn"]],
  frederikssund: ["Frederikssund", ["hilleroed", "roskilde"]],
  stevns:        ["Stevns",        ["koege", "faxe", "naestved"]],
  faxe:          ["Faxe",          ["stevns", "naestved", "ringsted", "koege"]],
};

export default function RelatedLinks({ city }) {
  const near = city && CITIES[city] ? CITIES[city][1] : Object.keys(CITIES);
  return (
    <nav aria-label="Relaterede sider" className="related-links">
      <h2 className="related-links-title">{city ? "Se også" : "Udforsk Elite Vask"}</h2>
      <div className="local-chips" style={{ justifyContent: "flex-start" }}>
        <Link href="/" className="chip">Forside</Link>
        <a href="/priser" className="chip">{city ? "Priser på mobil bilvask" : "Priser"}</a>
        <a href="/faq" className="chip">{city ? "Spørgsmål om dampvask" : "FAQ"}</a>
        <a href="/guide" className="chip">Bilpleje guide</a>
        {!city && <a href="/galleri" className="chip">Galleri</a>}
        {!city && <a href="/kontakt" className="chip">Kontakt</a>}
        {near.map((c) => (
          <a key={c} href={`/bilvask/${c}`} className="chip">
            {city ? `Mobil bilvask i ${CITIES[c][0]}` : `Bilvask ${CITIES[c][0]}`}
          </a>
        ))}
      </div>
    </nav>
  );
}
