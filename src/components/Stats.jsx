const HTML = `<!-- STATS -->
<section class="stats"><div class="wrap">
  <div class="stat"><div class="n">+240</div><div class="l" data-i18n="st1">Biler vasket</div></div>
  <div class="stat"><div class="n">1–3 t</div><div class="l" data-i18n="st2">Behandlingstid</div></div>
  <div class="stat"><div class="n">0 kr</div><div class="l" data-i18n="st3">Ingen forudbetaling</div></div>
  <div class="stat"><div class="n">Hele Sjælland</div><div class="l" data-i18n="st4">Vi kører til dig</div></div>
</div></section>`;
export default function Stats() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
