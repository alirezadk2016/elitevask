const HTML = `<!-- CAR SELECTOR + CALCULATOR -->
<section class="sec selector" id="vaelg"><div class="wrap">
  <div class="center">
    <div class="eyebrow" data-i18n="sel_eyebrow">Trin 1 af 2</div>
    <h2 class="sec-title" data-i18n="sel_title">Find pris til din bil</h2>
    <p class="sec-sub" data-i18n="sel_sub">Indtast din nummerplade – vi finder bilen automatisk og viser prisen med det samme.</p>
  </div>

  <!-- PLATE LOOKUP -->
  <div class="plate-lookup">
    <div class="plate-field">
      <div class="plate-dk">
        <div class="plate-dk-flag">
          <svg viewBox="0 0 20 28" width="20" height="28" fill="none"><rect width="20" height="28" fill="#C60C30"/><rect x="6" y="0" width="4" height="28" fill="white"/><rect x="0" y="12" width="20" height="4" fill="white"/></svg>
          <span>DK</span>
        </div>
        <input id="plateInput" type="text" maxlength="8" placeholder="AB 12 345" autocomplete="off" spellcheck="false" style="text-transform:uppercase">
      </div>
      <button id="plateLookupBtn" class="btn btn-green plate-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span data-i18n="plate_search">Slå op</span>
      </button>
    </div>
    <div id="plateResult" class="plate-result" style="display:none"></div>
    <div class="plate-divider"><span data-i18n="plate_or">– eller vælg manuelt –</span></div>
  </div>

  <div class="car-grid" id="carGrid"></div>

  <div class="calc" id="calc">
    <div class="calc-head">
      <div class="pi" id="calcIcon"></div>
      <div><h3 id="calcTitle">Mini bil</h3><p data-i18n="calc_head_p">Vælg den pakke der passer til dig</p></div>
      <div class="calc-zip">
        <label data-i18n="calc_zip">Postnr.</label>
        <input id="zip" type="text" inputmode="numeric" maxlength="4" placeholder="4700">
      </div>
    </div>
    <div class="pkg-tabs" id="pkgTabs"></div>
    <div class="pkgs" id="pkgs"></div>
    <div class="note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><span data-i18n="calc_note">Priserne er vejledende. Kørsel beregnes ud fra postnummer. Endelig pris bekræftes ved booking.</span></div>
  </div>
</div></section>`;
export default function Pricing() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
