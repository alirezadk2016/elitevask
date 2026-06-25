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
    <div class="pkg-tabs-wrap">
      <div class="pkg-tabs" id="pkgTabs"></div>
    </div>
    <div class="pkgs" id="pkgs"></div>
    <div class="calc-trust">
      <div class="ct-item"><span class="ct-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></span><span class="ct-tx"><strong data-i18n="trust1t">Forsikret & professionel</strong><span data-i18n="trust1p">Erfarne fagfolk · fuldt forsikret arbejde</span></span></div>
      <div class="ct-item"><span class="ct-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></span><span class="ct-tx"><strong data-i18n="trust2t">Ingen forudbetaling</strong><span data-i18n="trust2p">Du betaler først, når bilen er ren</span></span></div>
      <div class="ct-item"><span class="ct-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z"/></svg></span><span class="ct-tx"><strong data-i18n="trust3t">Tilfredshedsgaranti</strong><span data-i18n="trust3p">Ikke tilfreds? Så finder vi en løsning</span></span></div>
    </div>
    <div class="note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><span data-i18n="calc_note">Priserne er vejledende. Gratis kørsel til hele Sjælland. Endelig pris bekræftes ved booking.</span></div>
  </div>
</div></section>`;
export default function Pricing() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
