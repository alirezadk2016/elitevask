const HTML = `<!-- ANNOUNCEMENT BAR -->
<div class="ann-bar">
  <div class="ann-inner">
    <span class="ann-pulse"></span>
    <span class="ann-text">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
      <strong data-i18n="ann_main">Betal først når bilen er ren</strong>
      <span class="ann-sep">·</span>
      <span class="ann-sub" data-i18n="ann_sub">Ingen forudbetaling – 100% tilfredshedsgaranti</span>
    </span>
    <a href="https://dk.trustpilot.com/review/elite-vask.dk" target="_blank" rel="noopener" class="ann-tp" aria-label="Se vores anmeldelser på Trustpilot" title="Trustpilot">
      <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="#00b67a" d="M12 2l2.9 6.95L22 9.6l-5.3 4.7 1.6 7.1L12 17.6 5.7 21.4l1.6-7.1L2 9.6l7.1-.65L12 2z"/></svg>
      <span class="ann-tp-stars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
      <span class="ann-tp-word">Trustpilot</span>
    </a>
  </div>
</div>`;
export default function AnnouncementBar() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
