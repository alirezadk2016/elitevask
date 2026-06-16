const HTML = `<!-- LOCAL SEO -->
<section class="sec local"><div class="wrap">
  <div class="eyebrow" data-i18n="local_eyebrow">Serviceområde</div>
  <h2 class="sec-title" data-i18n="local_title">Mobil bilvask i hele Sjælland</h2>
  <div class="local-chips">
    <a href="#kontakt" class="chip">Bilvask i Næstved</a>
    <a href="#kontakt" class="chip">Bilvask i Slagelse</a>
    <a href="#kontakt" class="chip">Bilvask i Roskilde</a>
    <a href="#kontakt" class="chip">Bilvask i Køge</a>
    <a href="#kontakt" class="chip">Bilvask i Ringsted</a>
    <a href="#kontakt" class="chip">Bilvask i København</a>
  </div>
</div></section>`;
export default function LocalSEO() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
