const HTML = `<!-- STEPS -->
<section class="sec"><div class="wrap">
  <div class="center"><div class="eyebrow" data-i18n="how_eyebrow">Sådan virker det</div><h2 class="sec-title" data-i18n="how_title">3 nemme trin</h2><p class="sec-sub" data-i18n="how_sub">Du booker online, vi kører ud med alt udstyr, og bilen er færdig efter 1–3 timer. Du behøver ikke være hjemme, så længe vi kan komme til bilen.</p></div>
  <ol class="steps">
    <li class="step"><div class="num">1</div><h3 data-i18n="how1t">Vælg og book</h3><p data-i18n="how1p">Vælg biltype og pakke, og book en tid på få minutter.</p></li>
    <li class="step"><div class="num">2</div><h3 data-i18n="how2t">Vi kører ud</h3><p data-i18n="how2p">Vi ankommer med alt udstyr direkte til din adresse.</p></li>
    <li class="step"><div class="num">3</div><h3 data-i18n="how3t">Bilen skinner</h3><p data-i18n="how3p">Nyd en ren, frisk bil. Du behøvede ikke flytte dig.</p></li>
  </ol>
</div></section>`;
export default function Steps() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
