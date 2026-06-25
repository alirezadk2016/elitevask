function baCard(before, after, capKey, capText, altBefore, altAfter, featured) {
  return `<figure class="ba-card${featured ? ' ba-card--featured' : ''}">
    <div class="ba-slider">
      <img class="ba-before" src="${before}" alt="${altBefore}" loading="lazy">
      <img class="ba-after" src="${after}" alt="${altAfter}" loading="lazy">
      <span class="ba-lab l" data-i18n="ba_before">Før</span>
      <span class="ba-lab r" data-i18n="ba_after">Efter</span>
      <div class="ba-handle"><div class="ba-knob"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6M9 18l6-6-6-6"/></svg></div></div>
    </div>
    <figcaption data-i18n="${capKey}">${capText}</figcaption>
  </figure>`;
}

function galItem(src, capKey, capText, alt) {
  return `<figure class="gitem" data-full="${src}"><img src="${src}" alt="${alt}" loading="lazy"><figcaption data-i18n="${capKey}">${capText}</figcaption></figure>`;
}

const HTML = `<!-- BEFORE/AFTER + GALLERY -->
<section class="sec work" id="arbejde"><div class="wrap">
  <div class="center">
    <div class="eyebrow" data-i18n="ba_eyebrow">Vores arbejde</div>
    <h2 class="sec-title" data-i18n="ba_title">Før & efter</h2>
    <p class="sec-sub" data-i18n="ba_sub">Træk i slideren og se forskellen – ægte resultater fra professionel mobil bilvask hos vores kunder.</p>
  </div>

  <div class="ba-gallery">
    ${baCard('/gallery/img01.jpg', '/gallery/img02.jpg', 'ba_c1', 'Motorrens · Peugeot', 'Motorrum før dampvask', 'Motorrum efter dampvask', true)}
    ${baCard('/gallery/seat-before.jpg', '/gallery/seat-after.jpg', 'ba_c3', 'Sæderens · stofsæder', 'Sæderens før', 'Sæderens efter')}
    ${baCard('/gallery/interior-before.jpg', '/gallery/interior-after.jpg', 'ba_c4', 'Interiør · kabine', 'Interiør før', 'Interiør efter')}
    ${baCard('/gallery/floor-before.jpg', '/gallery/floor-after.jpg', 'ba_c5', 'Fodrum · måtter', 'Fodrum før', 'Fodrum efter')}
    ${baCard('/gallery/roof-before.jpg', '/gallery/roof-after.jpg', 'ba_c6', 'Tagkant · algerens', 'Tagkant alger før', 'Tagkant alger efter')}
  </div>
  <div class="gallery-cta-row">
    <a href="/galleri#foer-efter" class="gallery-cta" data-i18n="see_all_ba">Se alle før &amp; efter</a>
  </div>

  <div class="center" style="margin-top:76px">
    <div class="eyebrow" data-i18n="gal_eyebrow">Galleri</div>
    <h2 class="sec-title" data-i18n="gal_title">Flere billeder fra vores arbejde</h2>
    <p class="sec-sub" data-i18n="gal_sub2">Flere eksempler på bilvask hjemme og bilrengøring hjemme hos kunden – klik for fuld størrelse.</p>
  </div>
  <div class="gallery-nav-wrap" id="galleryNavWrap">
    <div class="gallery" id="gallery">
      ${galItem('/gallery/steam-bmw.jpg', 'g_bmw', 'Dampvask · BMW', 'Dampvask af BMW')}
      ${galItem('/gallery/steam-hood.jpg', 'g_hood', 'Motorhjelm · damp', 'Dampvask af motorhjelm')}
      ${galItem('/gallery/aerial-wash.jpg', 'g_onsite', 'Mobil dampvask · på stedet', 'Mobil dampvask på stedet')}
    </div>
    <button class="gal-nav-btn gal-nav-prev" id="galPrev" aria-label="Forrige">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="gal-nav-btn gal-nav-next" id="galNext" aria-label="Næste">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  </div>
  <div class="gallery-cta-row">
    <a href="/galleri#galleri" class="gallery-cta" data-i18n="see_all_gallery">Se hele galleriet</a>
  </div>
</div></section>`;
export default function Work() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
