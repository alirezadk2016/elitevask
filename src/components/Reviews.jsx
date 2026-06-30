const HTML = `<!-- REVIEWS -->
<section class="sec" id="anmeldelser"><div class="wrap">
  <div class="center">
    <div class="eyebrow" data-i18n="rev_eyebrow">Kundeanmeldelser</div>
    <h2 class="sec-title" data-i18n="rev_title">Det siger vores kunder</h2>
  </div>

  <div class="rev-center-block">
    <p class="rev-sub" data-i18n="rev_sub">Var du tilfreds med vores service? Del din oplevelse og hjælp andre med at træffe det rigtige valg.</p>
    <div class="rev-platforms">
      <a href="https://www.google.com/maps?cid=14890071893602568107&action=write_review" target="_blank" rel="noopener" class="rev-platform" aria-label="Skriv en anmeldelse på Google">
        <span class="rp-head">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
          Google
        </span>
        <span class="rp-stars google" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
        <span class="rp-write" data-i18n="rev_write">Skriv en anmeldelse →</span>
      </a>
      <a href="https://dk.trustpilot.com/evaluate/elite-vask.dk" target="_blank" rel="noopener" class="rev-platform" aria-label="Skriv en anmeldelse på Trustpilot">
        <span class="rp-head">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="#00b67a" d="M12 2l2.9 6.95L22 9.6l-5.3 4.7 1.6 7.1L12 17.6 5.7 21.4l1.6-7.1L2 9.6l7.1-.65L12 2z"/></svg>
          Trustpilot
        </span>
        <span class="rp-stars tp" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
        <span class="rp-write" data-i18n="rev_write">Skriv en anmeldelse →</span>
      </a>
    </div>
  </div>

</div></section>`;
export default function Reviews() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
