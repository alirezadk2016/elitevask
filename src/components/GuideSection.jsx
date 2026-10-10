const HTML = `<!-- GUIDE DROPDOWN -->
<div class="guide-dropdown" id="guideDropdown" aria-hidden="true">
  <div class="guide-dropdown-inner">
    <div class="guide-dropdown-head">
      <span class="guide-eyebrow" style="margin:0">Bilpleje Guide</span>
      <button class="guide-dropdown-close" id="guideDropdownClose" aria-label="Luk"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="guide-cards" style="margin-top:20px">
      <a href="/guide/hvor-ofte" class="guide-card">
        <div class="guide-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg></div>
        <h3>Hvor ofte bør man vaske sin bil?</h3>
        <p>Salt om vinteren, pollen om foråret, insekter om sommeren. Se den konkrete guide til vaskehyppighed efter årstid.</p>
        <span class="guide-card-read">Læs guide →</span>
      </a>
      <a href="/guide/salt-og-lak" class="guide-card">
        <div class="guide-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4M12 16h.01"/></svg></div>
        <h3>Beskyt bilens lak mod vejsalt</h3>
        <p>Vejsalt er bilens største fjende i den danske vinter. Lær hvordan salt angriber lakken og hvad du gør ved det.</p>
        <span class="guide-card-read">Læs guide →</span>
      </a>
      <a href="/guide/dampvask-vs-traditionel" class="guide-card">
        <div class="guide-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3c-1 1.5 1 3 0 4.5S7 10 8 11M12 3c-1 1.5 1 3 0 4.5S11 10 12 11M16 3c-1 1.5 1 3 0 4.5S15 10 16 11"/><path d="M4 15h16l-1.5 5h-13z"/></svg></div>
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
