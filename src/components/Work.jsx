const HTML = `<!-- BEFORE/AFTER + GALLERY -->
<section class="sec work" id="arbejde"><div class="wrap">
  <div class="center"><div class="eyebrow" data-i18n="ba_eyebrow">Vores arbejde</div><h2 class="sec-title" data-i18n="ba_title">Før & efter</h2><p class="sec-sub" data-i18n="ba_sub">Træk i slideren for at se forskellen. Rigtige resultater fra vores kunder.</p></div>
  <div class="ba-feature">
    <div class="ba-slider" id="baSlider">
      <img class="ba-before" src="/gallery/img01.jpg" alt="Motorrum før">
      <img class="ba-after" id="baAfter" src="/gallery/img02.jpg" alt="Motorrum efter">
      <span class="ba-lab l">FØR</span>
      <span class="ba-lab r">EFTER</span>
      <div class="ba-handle" id="baHandle"><div class="ba-knob"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6M9 18l6-6-6-6"/></svg></div></div>
    </div>
    <p class="ba-cap" data-i18n="ba_cap">Motorrens · Peugeot – afrenset med damp</p>
  </div>

  <div class="center" style="margin-top:64px"><div class="eyebrow" data-i18n="gal_eyebrow">Galleri</div><h2 class="sec-title" data-i18n="gal_title">Billeder fra vores arbejde</h2></div>
  <div class="gallery" id="gallery">
    <figure class="gitem" data-full="/gallery/seat-before.jpg"><img src="/gallery/seat-before.jpg" alt="Sæderens før" loading="lazy"><figcaption>Sæderens · før</figcaption></figure>
    <figure class="gitem" data-full="/gallery/seat-after.jpg"><img src="/gallery/seat-after.jpg" alt="Sæderens efter" loading="lazy"><figcaption>Sæderens · efter</figcaption></figure>
    <figure class="gitem" data-full="/gallery/floor-before.jpg"><img src="/gallery/floor-before.jpg" alt="Fodrum før" loading="lazy"><figcaption>Fodrum · før</figcaption></figure>
    <figure class="gitem" data-full="/gallery/floor-after.jpg"><img src="/gallery/floor-after.jpg" alt="Fodrum efter" loading="lazy"><figcaption>Fodrum · efter</figcaption></figure>
    <figure class="gitem" data-full="/gallery/roof-before.jpg"><img src="/gallery/roof-before.jpg" alt="Tagkant alger før" loading="lazy"><figcaption>Tagkant · alger · før</figcaption></figure>
    <figure class="gitem" data-full="/gallery/roof-after.jpg"><img src="/gallery/roof-after.jpg" alt="Tagkant alger efter" loading="lazy"><figcaption>Tagkant · alger · efter</figcaption></figure>
    <figure class="gitem" data-full="/gallery/interior-before.jpg"><img src="/gallery/interior-before.jpg" alt="Interiør før" loading="lazy"><figcaption>Interiør · før</figcaption></figure>
    <figure class="gitem" data-full="/gallery/steam-bmw.jpg"><img src="/gallery/steam-bmw.jpg" alt="Dampvask BMW" loading="lazy"><figcaption>Dampvask · BMW</figcaption></figure>
    <figure class="gitem" data-full="/gallery/steam-hood.jpg"><img src="/gallery/steam-hood.jpg" alt="Dampvask motorhjelm" loading="lazy"><figcaption>Dampvask · motorhjelm</figcaption></figure>
    <figure class="gitem" data-full="/gallery/IMG_20260512_174045896_HDR.jpg"><img src="/gallery/thumb_motor_for.jpg" alt="Motorrens før" loading="lazy"><figcaption>Motorrens · før</figcaption></figure>
    <figure class="gitem" data-full="/gallery/IMG_20260512_182945671_HDR.jpg"><img src="/gallery/thumb_motor_efter.jpg" alt="Motorrens efter" loading="lazy"><figcaption>Motorrens · efter</figcaption></figure>
    <figure class="gitem" data-full="/gallery/img11.jpg"><img src="/gallery/img11.jpg" alt="Mobil dampvask på stedet" loading="lazy"><figcaption>Mobil dampvask · på stedet</figcaption></figure>
  </div>
</div></section>`;
export default function Work() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
