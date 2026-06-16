const HTML = `<!-- REVIEWS (empty – ready for real Google reviews) -->
<section class="sec" id="anmeldelser"><div class="wrap">
  <div class="center"><div class="eyebrow" data-i18n="rev_eyebrow">Kundeanmeldelser</div><h2 class="sec-title" data-i18n="rev_title">Det siger vores kunder</h2></div>
  <div class="empty-state">
    <div class="es-google"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg><span>Google</span></div>
    <h4 data-i18n="rev_empty_t">Anmeldelser vises her snart</h4>
    <p data-i18n="rev_empty_p">Vi forbinder vores Google Business-profil. Når den er klar, vises rigtige kundeanmeldelser automatisk her.</p>
    <button class="btn btn-green" data-book data-i18n="rev_empty_cta">Book din vask</button>
  </div>
</div></section>`;
export default function Reviews() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
