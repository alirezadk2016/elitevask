"use client";
import Link from "next/link";
import { useLang } from "@/lib/useLang";
// Internal-links block for the standalone pages (city/guide/kontakt/legal),
// which otherwise only link back to the homepage.
//
// Few links, to related pages, in varied words: a block of 16 identical chips
// on every page split each page's value thin and told search engines nothing
// about which pages belong together. A city page now links to the core pages
// and its geographic neighbours only; the hub pages (priser, kontakt) still
// list every city, because there the list is the structure itself.
const EN = { koebenhavn: "Copenhagen", helsingoer: "Helsingør (Elsinore)" };
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
  const en = useLang() === "en";
  const name = (c) => (en && EN[c]) || CITIES[c][0];
  const near = city && CITIES[city] ? CITIES[city][1] : Object.keys(CITIES);
  return (
    <nav aria-label={en ? "Related pages" : "Relaterede sider"} className="related-links">
      <h2 className="related-links-title">{city ? (en ? "See also" : "Se også") : (en ? "Explore Elite Vask" : "Udforsk Elite Vask")}</h2>
      <div className="local-chips" style={{ justifyContent: "flex-start" }}>
        <Link href="/" className="chip">{en ? "Home" : "Forside"}</Link>
        <a href="/priser" className="chip">{city ? (en ? "Mobile car wash prices" : "Priser på mobil bilvask") : (en ? "Prices" : "Priser")}</a>
        <a href="/faq" className="chip">{city ? (en ? "Questions about steam washing" : "Spørgsmål om dampvask") : "FAQ"}</a>
        <a href="/guide" className="chip">{en ? "Car care guide" : "Bilpleje guide"}</a>
        {!city && <a href="/galleri" className="chip">{en ? "Gallery" : "Galleri"}</a>}
        {!city && <a href="/kontakt" className="chip">{en ? "Contact" : "Kontakt"}</a>}
        {near.map((c) => (
          <a key={c} href={`/bilvask/${c}`} className="chip">
            {city ? (en ? `Mobile car wash in ${name(c)}` : `Mobil bilvask i ${name(c)}`) : (en ? `Car wash ${name(c)}` : `Bilvask ${name(c)}`)}
          </a>
        ))}
      </div>
    </nav>
  );
}
