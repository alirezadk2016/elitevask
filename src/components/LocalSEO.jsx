const HTML = `<!-- LOCAL SEO -->
<section class="sec sec-tight local"><div class="wrap">
  <div class="eyebrow" data-i18n="local_eyebrow">Serviceområde</div>
  <h2 class="sec-title" data-i18n="local_title">Mobil bilvask i hele Sjælland</h2>
  <p class="sec-sub" data-i18n="local_sub">Elite Vask kører ud i hele Sjælland – alle postnumre fra 1000 til 4799 – og kørslen er altid gratis. Vælg din by for lokale detaljer.</p>
  <div class="local-chips">
    <a href="/bilvask/koebenhavn" class="chip" data-i18n="loc1">Bilvask i København</a>
    <a href="/bilvask/roskilde" class="chip" data-i18n="loc2">Bilvask i Roskilde</a>
    <a href="/bilvask/koege" class="chip" data-i18n="loc3">Bilvask i Køge</a>
    <a href="/bilvask/naestved" class="chip" data-i18n="loc4">Bilvask i Næstved</a>
    <a href="/bilvask/ringsted" class="chip" data-i18n="loc5">Bilvask i Ringsted</a>
    <a href="/bilvask/stevns" class="chip" data-i18n="loc6">Bilvask i Stevns Kommune</a>
    <a href="/bilvask/faxe" class="chip" data-i18n="loc7">Bilvask i Faxe Kommune</a>
    <a href="/bilvask/helsingoer" class="chip" data-i18n="loc8">Bilvask i Helsingør</a>
    <a href="/bilvask/hilleroed" class="chip" data-i18n="loc9">Bilvask i Hillerød</a>
    <a href="/bilvask/frederikssund" class="chip" data-i18n="loc10">Bilvask i Frederikssund</a>
  </div>
</div></section>`;
export default function LocalSEO() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
