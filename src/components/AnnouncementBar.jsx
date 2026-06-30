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
      <span class="ann-tp-word"><svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="#00b67a" d="M12 2l2.9 6.95L22 9.6l-5.3 4.7 1.6 7.1L12 17.6 5.7 21.4l1.6-7.1L2 9.6l7.1-.65L12 2z"/></svg>Trustpilot</span>
      <span class="ann-tp-stars" aria-hidden="true">
        <svg viewBox="0 0 127 24" height="13" aria-hidden="true">
          <g>
            <rect width="24" height="24" rx="2.5" fill="#00b67a"/><path fill="#fff" d="M12 5l1.8 4.35 4.7.38-3.57 3.06 1.09 4.58L12 14.9 7.98 17.37l1.09-4.58L5.5 9.73l4.7-.38z"/>
            <rect x="25.75" width="24" height="24" rx="2.5" fill="#00b67a"/><path fill="#fff" d="M37.75 5l1.8 4.35 4.7.38-3.57 3.06 1.09 4.58-4.02-2.47-4.02 2.47 1.09-4.58-3.57-3.06 4.7-.38z"/>
            <rect x="51.5" width="24" height="24" rx="2.5" fill="#00b67a"/><path fill="#fff" d="M63.5 5l1.8 4.35 4.7.38-3.57 3.06 1.09 4.58-4.02-2.47-4.02 2.47 1.09-4.58-3.57-3.06 4.7-.38z"/>
            <rect x="77.25" width="24" height="24" rx="2.5" fill="#00b67a"/><path fill="#fff" d="M89.25 5l1.8 4.35 4.7.38-3.57 3.06 1.09 4.58-4.02-2.47-4.02 2.47 1.09-4.58-3.57-3.06 4.7-.38z"/>
            <rect x="103" width="24" height="24" rx="2.5" fill="#00b67a"/><path fill="#fff" d="M115 5l1.8 4.35 4.7.38-3.57 3.06 1.09 4.58-4.02-2.47-4.02 2.47 1.09-4.58-3.57-3.06 4.7-.38z"/>
          </g>
        </svg>
      </span>
    </a>
  </div>
</div>`;
export default function AnnouncementBar() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
