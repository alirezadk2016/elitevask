const HTML = `<!-- LOCAL SEO -->
<section class="sec sec-tight local"><div class="wrap">
  <div class="eyebrow" data-i18n="local_eyebrow">Serviceområde</div>
  <h2 class="sec-title" data-i18n="local_title">Mobil bilvask i hele Sjælland</h2>
  <p class="sec-sub" data-i18n="local_sub">Elite Vask kører ud i hele Sjælland – alle postnumre fra 1000 til 4799 – og kørslen er altid gratis. Vælg din by for lokale detaljer.</p>
  <div class="local-chips">
    <a href="/bilvask/koebenhavn" class="chip">Bilvask i København</a>
    <a href="/bilvask/roskilde" class="chip">Bilvask i Roskilde</a>
    <a href="/bilvask/koege" class="chip">Bilvask i Køge</a>
    <a href="/bilvask/naestved" class="chip">Bilvask i Næstved</a>
    <a href="/bilvask/ringsted" class="chip">Bilvask i Ringsted</a>
    <a href="/bilvask/stevns" class="chip">Bilvask i Stevns Kommune</a>
    <a href="/bilvask/faxe" class="chip">Bilvask i Faxe Kommune</a>
    <a href="/bilvask/helsingoer" class="chip">Bilvask i Helsingør</a>
    <a href="/bilvask/hilleroed" class="chip">Bilvask i Hillerød</a>
    <a href="/bilvask/frederikssund" class="chip">Bilvask i Frederikssund</a>
  </div>
</div></section>`;
export default function LocalSEO() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
