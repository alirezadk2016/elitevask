const HTML = `<!-- REVIEWS -->
<section class="sec" id="anmeldelser"><div class="wrap">
  <div class="center">
    <div class="eyebrow" data-i18n="rev_eyebrow">Kundeanmeldelser</div>
    <h2 class="sec-title" data-i18n="rev_title">Det siger vores kunder</h2>
  </div>

  <div class="rev-center-block">
    <div class="rev-google-badge">
      <svg viewBox="0 0 24 24" width="36" height="36"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
      <span class="rev-badge-label">Google</span>
    </div>
    <div class="rev-score-num">5.0</div>
    <div class="rev-stars">
      <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
    </div>
    <p class="rev-sub">Var du tilfreds med vores service? Del din oplevelse og hjælp andre med at træffe det rigtige valg.</p>
    <div class="rev-actions">
      <a href="https://www.google.com/maps?cid=14890071893602568107&action=write_review" target="_blank" rel="noopener" class="btn btn-green rev-btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg>
        Skriv en anmeldelse
      </a>
      <a href="https://www.google.com/maps?cid=14890071893602568107" target="_blank" rel="noopener" class="btn rev-btn-ghost">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        Se på Google Maps
      </a>
    </div>
    <a href="https://dk.trustpilot.com/review/elite-vask.dk" target="_blank" rel="noopener" class="rev-tp" aria-label="Se vores anmeldelser på Trustpilot">
      <span class="rev-tp-or" data-i18n="rev_or">Eller anmeld os på</span>
      <span class="rev-tp-brand"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect width="24" height="24" rx="3" fill="#00b67a"/><path fill="#fff" d="M12 4.5l1.97 4.78 5.15.42-3.92 3.36 1.2 5.02L12 15.78 7.6 18.5l1.2-5.02L4.88 9.7l5.15-.42z"/></svg>Trustpilot</span>
      <span class="rev-tp-stars" aria-hidden="true">
        <svg viewBox="0 0 127 24" height="16" aria-hidden="true">
          <rect width="24" height="24" rx="2.5" fill="#00b67a"/><path fill="#fff" d="M12 5l1.8 4.35 4.7.38-3.57 3.06 1.09 4.58L12 14.9 7.98 17.37l1.09-4.58L5.5 9.73l4.7-.38z"/>
          <rect x="25.75" width="24" height="24" rx="2.5" fill="#00b67a"/><path fill="#fff" d="M37.75 5l1.8 4.35 4.7.38-3.57 3.06 1.09 4.58-4.02-2.47-4.02 2.47 1.09-4.58-3.57-3.06 4.7-.38z"/>
          <rect x="51.5" width="24" height="24" rx="2.5" fill="#00b67a"/><path fill="#fff" d="M63.5 5l1.8 4.35 4.7.38-3.57 3.06 1.09 4.58-4.02-2.47-4.02 2.47 1.09-4.58-3.57-3.06 4.7-.38z"/>
          <rect x="77.25" width="24" height="24" rx="2.5" fill="#00b67a"/><path fill="#fff" d="M89.25 5l1.8 4.35 4.7.38-3.57 3.06 1.09 4.58-4.02-2.47-4.02 2.47 1.09-4.58-3.57-3.06 4.7-.38z"/>
          <rect x="103" width="24" height="24" rx="2.5" fill="#00b67a"/><path fill="#fff" d="M115 5l1.8 4.35 4.7.38-3.57 3.06 1.09 4.58-4.02-2.47-4.02 2.47 1.09-4.58-3.57-3.06 4.7-.38z"/>
        </svg>
      </span>
    </a>
  </div>

</div></section>`;
export default function Reviews() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
