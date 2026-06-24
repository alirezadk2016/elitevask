const HTML = `<!-- CONTACT -->
<section class="sec contact" id="kontakt"><div class="wrap">
  <div class="contact-grid">
    <div>
      <h2 data-i18n="ct_title">Klar til en skinnende ren bil?</h2>
      <p class="lead" data-i18n="ct_lead">Kontakt os i dag og book din mobile dampvask. Vi kører til dig – nemt, hurtigt og lokalt.</p>
      <div class="contact-cta">
        <button type="button" class="btn btn-green btn-lg" data-book data-i18n="ct_book">Book online nu</button>
        <a href="tel:+4524440321" class="btn btn-ghost btn-lg" data-i18n="ct_call">Ring til os</a>
      </div>
    </div>
    <div class="contact-list">
      <a href="tel:+4524440321" class="cl-item"><span class="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg></span><span><span class="lab" data-i18n="ct_phone">Telefon</span><br><span class="val">+45 24 44 03 21</span></span></a>
      <a href="https://www.facebook.com/share/14ciFraNT4M/" target="_blank" rel="noopener noreferrer" class="cl-item"><span class="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></span><span><span class="lab">Facebook</span><br><span class="val">Elite Vask</span></span></a>
      <a href="https://instagram.com/elitevasksjaelland" target="_blank" rel="noopener noreferrer" class="cl-item"><span class="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg></span><span><span class="lab">Instagram</span><br><span class="val">@elitevasksjaelland</span></span></a>
      <a href="mailto:info@elite-vask.dk" class="cl-item"><span class="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg></span><span><span class="lab" data-i18n="ct_email">E-mail</span><br><span class="val">info@elite-vask.dk</span></span></a>
      <div class="cl-item cl-item-hours"><span class="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span><span><span class="lab" data-i18n="ct_hours">Åbningstider</span><div class="hours-grid"><div class="hrow"><span class="hday" data-i18n="ct_h_wday">Man – Fre</span><span class="htime">08:00 – 20:00</span></div><div class="hrow"><span class="hday" data-i18n="ct_h_wend">Lør – Søn</span><span class="htime">10:00 – 20:00</span></div><div class="hrow hrow-note"><span data-i18n="ct_h_note">eller efter aftale</span></div></div></span></div>
      <div class="cl-item"><span class="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span><span><span class="lab" data-i18n="ct_addr">Adresse</span><br><span class="val">Vangeledet 21, 2830 Virum</span></span></div>
      <div class="cl-item"><span class="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg></span><span><span class="lab">CVR</span><br><span class="val">46392264</span></span></div>
    </div>
  </div>
</div></section>`;
export default function Contact() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
