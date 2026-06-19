const HTML = `<!-- GUIDE DROPDOWN -->
<div class="guide-dropdown" id="guideDropdown" aria-hidden="true">
  <div class="guide-dropdown-inner">
    <div class="guide-dropdown-head">
      <span class="guide-eyebrow" style="margin:0">Bilpleje Guide</span>
      <button class="guide-dropdown-close" id="guideDropdownClose" aria-label="Luk"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="guide-cards" style="margin-top:20px">
      <a href="/guide/hvor-ofte" class="guide-card">
        <div class="guide-card-icon">📅</div>
        <h3>Hvor ofte bør man vaske sin bil?</h3>
        <p>Salt om vinteren, pollen om foråret, insekter om sommeren. Se den konkrete guide til vaskehyppighed efter årstid.</p>
        <span class="guide-card-read">Læs guide →</span>
      </a>
      <a href="/guide/salt-og-lak" class="guide-card">
        <div class="guide-card-icon">🧂</div>
        <h3>Beskyt bilens lak mod vejsalt</h3>
        <p>Vejsalt er bilens største fjende i den danske vinter. Lær hvordan salt angriber lakken og hvad du gør ved det.</p>
        <span class="guide-card-read">Læs guide →</span>
      </a>
      <a href="/guide/dampvask-vs-traditionel" class="guide-card">
        <div class="guide-card-icon">♨️</div>
        <h3>Dampvask vs. traditionel bilvask</h3>
        <p>1–3 liter vand vs. 200 liter. Ingen ridser, bakteriedrab ved 145°C. Se den fulde sammenligning.</p>
        <span class="guide-card-read">Læs guide →</span>
      </a>
    </div>
  </div>
</div>`;

export default function GuideSection() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
