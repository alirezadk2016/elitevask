const HTML = `<!-- STATS -->
<section class="stats"><div class="wrap">
  <div class="stat"><div class="n">Damp</div><div class="l" data-i18n="st1">Skånsom rensemetode</div></div>
  <div class="stat"><div class="n">1–4 t</div><div class="l" data-i18n="st2">Typisk behandlingstid</div></div>
  <div class="stat"><div class="n">100%</div><div class="l" data-i18n="st3">Mobil – vi kører ud</div></div>
  <div class="stat"><div class="n">Sjælland</div><div class="l" data-i18n="st4">Vores serviceområde</div></div>
</div></section>`;
export default function Stats() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
