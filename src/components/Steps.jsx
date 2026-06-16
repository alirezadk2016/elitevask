const HTML = `<!-- STEPS -->
<section class="sec"><div class="wrap">
  <div class="center"><div class="eyebrow" data-i18n="how_eyebrow">Sådan virker det</div><h2 class="sec-title" data-i18n="how_title">3 nemme trin</h2></div>
  <div class="steps">
    <div class="step"><div class="num">1</div><h4 data-i18n="how1t">Vælg og book</h4><p data-i18n="how1p">Vælg biltype og pakke, og book en tid på få minutter.</p></div>
    <div class="step"><div class="num">2</div><h4 data-i18n="how2t">Vi kører ud</h4><p data-i18n="how2p">Vi ankommer med alt udstyr direkte til din adresse.</p></div>
    <div class="step"><div class="num">3</div><h4 data-i18n="how3t">Bilen skinner</h4><p data-i18n="how3p">Nyd en ren, frisk bil. Du behøvede ikke flytte dig.</p></div>
  </div>
</div></section>`;
export default function Steps() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
