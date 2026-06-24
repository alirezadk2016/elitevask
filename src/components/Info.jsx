const HTML = `<!-- INFO -->
<section class="sec info"><div class="wrap">
  <div class="center"><div class="eyebrow" data-i18n="info_eyebrow">Om Elite Vask</div><h2 class="sec-title" data-i18n="info_title">Mød holdet bag</h2><p class="sec-sub" data-i18n="info_sub">Her fortæller vi snart mere om os og det udstyr, vi bruger.</p></div>
  <div class="info-grid">
    <div class="info-card info-card-why" id="whyCard" role="button" tabindex="0" aria-expanded="false" aria-controls="whyBody" onclick="toggleWhyCard()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleWhyCard()}">
      <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
      <div class="why-header">
        <h4 data-i18n="info1t">Hvorfor vælge Elite Vask?</h4>
        <span class="why-toggle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>
      </div>
      <p class="why-teaser" data-i18n="info1p">Premium mobil bilvask — vi sætter standarden. Klik for at læse mere.</p>
      <div class="why-body" id="whyBody">
        <div class="why-items">
          <div class="why-item"><span class="why-emoji">🚗</span><div><strong data-i18n="why_i1t">Vi kommer direkte til dig</strong><p data-i18n="why_i1p">Ingen ventetid i vaskehal. Vi møder op til din adresse i hele Sjælland — til tiden, klar til at levere.</p></div></div>
          <div class="why-item"><span class="why-emoji">✨</span><div><strong data-i18n="why_i2t">Håndværksmæssig præcision</strong><p data-i18n="why_i2p">Hver bil behandles individuelt med fuld opmærksomhed og professionel teknik. Vi giver aldrig køb på kvaliteten.</p></div></div>
          <div class="why-item"><span class="why-emoji">🌱</span><div><strong data-i18n="why_i3t">Bæredygtig damprensning</strong><p data-i18n="why_i3p">Vores damp-teknologi bruger op til 90 % mindre vand end konventionelle bilvaske — skånsomt for naturen, hårdt mod snavs.</p></div></div>
          <div class="why-item"><span class="why-emoji">🛡️</span><div><strong data-i18n="why_i4t">Skåner lakken — altid</strong><p data-i18n="why_i4p">Vi anvender udelukkende professionelle, pH-neutrale produkter som beskytter og bevarer bilens overflade.</p></div></div>
          <div class="why-item"><span class="why-emoji">💎</span><div><strong data-i18n="why_i5t">Dybdeglans & perfektion</strong><p data-i18n="why_i5p">Dampen penetrerer overfladen, fjerner indgroet snavs og fremhæver bilens naturlige glans — fra hjul til tag.</p></div></div>
          <div class="why-item"><span class="why-emoji">⭐</span><div><strong data-i18n="why_i6t">Betal kun når du er tilfreds</strong><p data-i18n="why_i6p">Ingen forudbetaling. Vi fakturerer udelukkende efter afsluttet arbejde og din fulde tilfredshed.</p></div></div>
          <div class="why-item"><span class="why-emoji">🤝</span><div><strong data-i18n="why_i7t">Service i verdensklasse</strong><p data-i18n="why_i7p">Vi tilstræber at overgå dine forventninger ved hvert besøg — fra første kontakt til det afsluttende håndtryk.</p></div></div>
        </div>
      </div>
    </div>
    <div class="info-card"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="m20 4-8.5 8.5"/><path d="M9 4H4v16h16v-5"/></svg></div><h4 data-i18n="info2t">Vores udstyr</h4><p data-i18n="info2p">Vi arbejder med <strong>Optima Steamer XD2</strong> – en professionel damprenser med kontinuerlig damp, høj temperatur og minimalt vandforbrug. Perfekt til skånsom og effektiv bilvask.</p><div class="eq-specs"><span>☁️ Kontinuerlig damp</span><span>🌡️ Op til 180°C</span><span>💧 Minimalt vand</span><span>⚡ Professionel kraft</span></div></div>
    <div class="info-card"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-3H5a2 2 0 0 0-2 2Z"/></svg></div><h4 data-i18n="info3t">Dækningsområde</h4><p data-i18n="info3p">Vi dækker store dele af Sjælland, herunder Storkøbenhavn.</p></div>
  </div>
</div></section>`;
export default function Info() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
