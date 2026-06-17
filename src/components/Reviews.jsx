const HTML = `<!-- REVIEWS -->
<section class="sec" id="anmeldelser"><div class="wrap">
  <div class="center"><div class="eyebrow" data-i18n="rev_eyebrow">Kundeanmeldelser</div><h2 class="sec-title" data-i18n="rev_title">Det siger vores kunder</h2></div>
  <div class="tp-widget-wrap">
    <div class="trustpilot-widget"
      data-locale="da-DK"
      data-template-id="56278e9abfbbba0bdcd568bc"
      data-businessunit-id="alMjUlvV9s57mEha"
      data-style-height="52px"
      data-style-width="100%"
      data-theme="light"
      data-stars="1,2,3,4,5">
      <a href="https://www.trustpilot.com/review/elite-vask.dk" target="_blank" rel="noopener">Se vores anmeldelser på Trustpilot</a>
    </div>
  </div>
  <div class="tp-widget-wrap" style="margin-top:24px">
    <div class="trustpilot-widget"
      data-locale="da-DK"
      data-template-id="54ad5defc6454f065c28af8b"
      data-businessunit-id="alMjUlvV9s57mEha"
      data-style-height="240px"
      data-style-width="100%"
      data-theme="light"
      data-tags="All"
      data-stars="4,5">
      <a href="https://www.trustpilot.com/review/elite-vask.dk" target="_blank" rel="noopener">Se vores anmeldelser på Trustpilot</a>
    </div>
  </div>
</div></section>`;
export default function Reviews() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
