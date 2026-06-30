// Internal-links block for the standalone pages (city/guide/kontakt/legal),
// which otherwise only link back to the homepage. Improves crawlability,
// link equity distribution and on-page navigation. Plain links, no JS.
export default function RelatedLinks() {
  return (
    <nav aria-label="Relaterede sider" className="related-links">
      <h2 className="related-links-title">Udforsk Elite Vask</h2>
      <div className="local-chips" style={{ justifyContent: "flex-start" }}>
        <a href="/" className="chip">Forside</a>
        <a href="/priser" className="chip">Priser</a>
        <a href="/galleri" className="chip">Galleri</a>
        <a href="/kontakt" className="chip">Kontakt</a>
        <a href="/faq" className="chip">FAQ</a>
        <a href="/guide" className="chip">Bilpleje guide</a>
        <a href="/bilvask/koebenhavn" className="chip">Bilvask København</a>
        <a href="/bilvask/roskilde" className="chip">Bilvask Roskilde</a>
        <a href="/bilvask/koege" className="chip">Bilvask Køge</a>
        <a href="/bilvask/naestved" className="chip">Bilvask Næstved</a>
        <a href="/bilvask/ringsted" className="chip">Bilvask Ringsted</a>
      </div>
    </nav>
  );
}
