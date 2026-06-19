const HTML = `<!-- CAR SELECTOR + CALCULATOR -->
<section class="sec selector" id="vaelg"><div class="wrap">
  <div class="center">
    <div class="eyebrow" data-i18n="sel_eyebrow">Trin 1 af 2</div>
    <h2 class="sec-title" data-i18n="sel_title">Find pris til din bil</h2>
    <p class="sec-sub" data-i18n="sel_sub">Vælg din biltype nedenfor og se prisen med det samme.</p>
  </div>

  <div class="car-grid" id="carGrid"></div>

  <div class="calc" id="calc">
    <div class="calc-head">
      <div class="calc-head-left">
        <div class="pi" id="calcIcon"></div>
        <div class="calc-head-info">
          <h3 id="calcTitle">Mini bil</h3>
          <div id="calcTime" class="calc-time"></div>
        </div>
      </div>
      <div class="calc-head-chips">
        <span class="ch-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg><span data-i18n="chip_drive">Gratis kørsel – hele Sjælland</span></span>
        <span class="ch-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg><span data-i18n="chip_guar">Tilfredshedsgaranti</span></span>
        <span class="ch-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg><span data-i18n="chip_pay">Betal efter vask</span></span>
      </div>
    </div>
    <div class="pkg-tabs" id="pkgTabs"></div>
    <div class="pkgs" id="pkgs"></div>
    <div class="note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><span data-i18n="calc_note">Priserne er vejledende. Gratis kørsel til hele Sjælland. Endelig pris bekræftes ved booking.</span></div>
  </div>
</div></section>`;
export default function Pricing() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
