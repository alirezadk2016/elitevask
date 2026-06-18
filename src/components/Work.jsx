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
    <figure class="gitem" data-full="/gallery/img12.jpg"><img src="/gallery/img03.jpg" alt="Sæderens før" loading="lazy"><figcaption data-i18n="g_seat_for">Sæderens · før</figcaption></figure>
    <figure class="gitem" data-full="/gallery/img13.jpg"><img src="/gallery/img04.jpg" alt="Sæderens efter" loading="lazy"><figcaption data-i18n="g_seat_efter">Sæderens · efter</figcaption></figure>
    <figure class="gitem" data-full="/gallery/img14.jpg"><img src="/gallery/img05.jpg" alt="Fodrum før" loading="lazy"><figcaption data-i18n="g_floor_for">Fodrum · før</figcaption></figure>
    <figure class="gitem" data-full="/gallery/img15.jpg"><img src="/gallery/img06.jpg" alt="Fodrum efter" loading="lazy"><figcaption data-i18n="g_floor_efter">Fodrum · efter</figcaption></figure>
    <figure class="gitem" data-full="/gallery/img16.jpg"><img src="/gallery/img07.jpg" alt="Tankdæksel før" loading="lazy"><figcaption data-i18n="g_fuel_for">Tankdæksel · før</figcaption></figure>
    <figure class="gitem" data-full="/gallery/img17.jpg"><img src="/gallery/img08.jpg" alt="Tankdæksel efter" loading="lazy"><figcaption data-i18n="g_fuel_efter">Tankdæksel · efter</figcaption></figure>
    <figure class="gitem" data-full="/gallery/img18.jpg"><img src="/gallery/img09.jpg" alt="Tagkant alger" loading="lazy"><figcaption data-i18n="g_roof">Tagkant · algerens</figcaption></figure>
    <figure class="gitem" data-full="/gallery/img19.jpg"><img src="/gallery/img10.jpg" alt="Pedalområde" loading="lazy"><figcaption data-i18n="g_pedal">Pedalområde · rens</figcaption></figure>
    <figure class="gitem" data-full="/gallery/img20.jpg"><img src="/gallery/img11.jpg" alt="Dampvask på stedet" loading="lazy"><figcaption data-i18n="g_onsite">Mobil dampvask · på stedet</figcaption></figure>
    <figure class="gitem" data-full="/gallery/IMG_20260512_174045896_HDR.jpg"><img src="/gallery/IMG_20260512_174045896_HDR.jpg" alt="Motorrens før" loading="lazy"><figcaption>Motorrens · før</figcaption></figure>
    <figure class="gitem" data-full="/gallery/IMG_20260512_182945671_HDR.jpg"><img src="/gallery/IMG_20260512_182945671_HDR.jpg" alt="Motorrens efter" loading="lazy"><figcaption>Motorrens · efter</figcaption></figure>
  </div>
</div></section>`;
export default function Work() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
