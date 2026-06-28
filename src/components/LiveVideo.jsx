const HTML = `<!-- LIVE VIDEO -->
<section class="sec live-video" id="video"><div class="wrap">
  <div class="center">
    <div class="eyebrow" data-i18n="vid_eyebrow">Live optagelse</div>
    <h2 class="sec-title" data-i18n="vid_title2">Se dampen arbejde</h2>
    <p class="sec-sub" data-i18n="vid_sub2">Oplev vores mobile bilpleje i aktion – optaget på stedet, mens vi arbejder hjemme hos kunden.</p>
  </div>
  <div class="lv-stage">
    <div class="lv-frame">
      <div class="ev-video-badge"><span class="ev-pulse"></span><span data-i18n="vid_badge">Se os i aktion</span></div>
      <video class="ev-video" autoplay muted loop playsinline preload="metadata">
        <source src="/gallery/elite-vask-demo.mp4" type="video/mp4">
      </video>
      <div class="ev-video-overlay">
        <div class="ev-video-text">
          <h3 data-i18n="vid_title">Professionel dampvask</h3>
          <p data-i18n="vid_sub">Se hvordan vi transformer din bil – fra snavset til skinnende ren</p>
        </div>
      </div>
    </div>
  </div>
</div></section>`;
export default function LiveVideo() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
