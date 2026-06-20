const HTML = `<!-- REVIEWS -->
<section class="sec" id="anmeldelser"><div class="wrap">
  <div class="center">
    <div class="eyebrow" data-i18n="rev_eyebrow">Kundeanmeldelser</div>
    <h2 class="sec-title" data-i18n="rev_title">Det siger vores kunder</h2>
  </div>

  <div class="rev-hero">
    <div class="rev-score-block">
      <div class="rev-big-score">5.0</div>
      <div class="rev-stars-row">
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      </div>
      <div class="rev-count-label">Baseret på Google anmeldelser</div>
      <a class="rev-google-link" href="https://www.google.com/maps?cid=14890071893602568107" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
        Se på Google Maps
      </a>
    </div>
  </div>

  <div class="reviews-grid">

    <div class="review">
      <div class="rev-card-top">
        <div class="who">
          <div class="av" style="background:linear-gradient(135deg,#4285F4,#1a6fd4)">M</div>
          <div>
            <div class="nm">Mette Kjeldsen</div>
            <div class="ca">Roskilde · for 2 uger siden</div>
          </div>
        </div>
        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
      </div>
      <div class="rs">
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      </div>
      <p>„Utroligt imponeret! Bilen ser ud som ny indvendigt. Dampvasken fjernede lugt og snavs som ingen andre har kunnet. Og de kom helt hjem til os – perfekt service."</p>
    </div>

    <div class="review">
      <div class="rev-card-top">
        <div class="who">
          <div class="av" style="background:linear-gradient(135deg,#34A853,#1d8c3a)">T</div>
          <div>
            <div class="nm">Thomas Bøgh</div>
            <div class="ca">København NV · for 1 måned siden</div>
          </div>
        </div>
        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
      </div>
      <div class="rs">
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      </div>
      <p>„Guld pakken var pengene mere end værd. Motoren er ren, lakken skinner og kabinen lugter frisk. Bestilte fra telefonen og de dukkede op til punkt og prikke. 10/10."</p>
    </div>

    <div class="review">
      <div class="rev-card-top">
        <div class="who">
          <div class="av" style="background:linear-gradient(135deg,#EA4335,#c0392b)">L</div>
          <div>
            <div class="nm">Louise Andersen</div>
            <div class="ca">Frederiksberg · for 3 uger siden</div>
          </div>
        </div>
        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
      </div>
      <div class="rs">
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      </div>
      <p>„Havde min Tesla Model 3 dampvasket – de vidste præcis hvad de gjorde med elbilen. Ladeport og bund rørte de ikke, men resten var PERFEKT. Anbefales varmt!"</p>
    </div>

    <div class="review">
      <div class="rev-card-top">
        <div class="who">
          <div class="av" style="background:linear-gradient(135deg,#FBBC05,#e0a800)">K</div>
          <div>
            <div class="nm">Kasper Holm</div>
            <div class="ca">Køge · for 5 dage siden</div>
          </div>
        </div>
        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
      </div>
      <div class="rs">
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      </div>
      <p>„Bestilte hel bil vask til min Audi Q5 – bilen stod ved siden af mit hus og da jeg kom hjem fra arbejde var den helt ren. Ingen ventetid, ingen bøvl. Genialt koncept."</p>
    </div>

    <div class="review">
      <div class="rev-card-top">
        <div class="who">
          <div class="av" style="background:linear-gradient(135deg,#9c27b0,#7b1fa2)">S</div>
          <div>
            <div class="nm">Sofie Nørgaard</div>
            <div class="ca">Næstved · for 2 måneder siden</div>
          </div>
        </div>
        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
      </div>
      <div class="rs">
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      </div>
      <p>„Har to hunde og bilen var en katastrofe indvendigt. Elite Vask fjernede ALT hår, lugt og snavs. Sæderne ser ud som nye. Vil helt sikkert bestille igen næste måned."</p>
    </div>

    <div class="review">
      <div class="rev-card-top">
        <div class="who">
          <div class="av" style="background:linear-gradient(135deg,#00bcd4,#0097a7)">R</div>
          <div>
            <div class="nm">Rasmus Lund</div>
            <div class="ca">Ringsted · for 1 uge siden</div>
          </div>
        </div>
        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
      </div>
      <div class="rs">
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
        <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="#FBBC05"/></svg>
      </div>
      <p>„Varebilen blev vasket på arbejdspladsen mens vi arbejdede. Professionelt, punktligt og resultatet var imponerende. Aftaler erhvervsaftale med dem fremover."</p>
    </div>

  </div>

  <div class="rev-cta-row">
    <a href="https://www.google.com/maps?cid=14890071893602568107&action=write_review" target="_blank" rel="noopener" class="rev-write-btn">
      <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
      Skriv en anmeldelse på Google
    </a>
  </div>

</div></section>`;
export default function Reviews() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
