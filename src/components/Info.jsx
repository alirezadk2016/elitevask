const HTML = `<!-- INFO -->
<section class="sec info"><div class="wrap">
  <div class="center"><div class="eyebrow" data-i18n="info_eyebrow">Om Elite Vask</div><h2 class="sec-title" data-i18n="info_title">Mød holdet bag</h2><p class="sec-sub" data-i18n="info_sub">Her fortæller vi snart mere om os og det udstyr, vi bruger.</p></div>
  <div class="info-grid">
    <div class="info-card"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></div><h4 data-i18n="info1t">Ejer & kontaktperson</h4><p data-i18n="info1p">Navn og direkte kontakt til indehaveren tilføjes her.</p><span class="soon" data-i18n="info_soon">Tilføjes snart</span></div>
    <div class="info-card"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="m20 4-8.5 8.5"/><path d="M9 4H4v16h16v-5"/></svg></div><h4 data-i18n="info2t">Vores udstyr</h4><p data-i18n="info2p">Beskrivelse af de dampmaskiner og produkter vi vasker med.</p><span class="soon" data-i18n="info_soon2">Tilføjes snart</span></div>
    <div class="info-card"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-3H5a2 2 0 0 0-2 2Z"/></svg></div><h4 data-i18n="info3t">Dækningsområde</h4><p data-i18n="info3p">Vi dækker store dele af Sjælland, herunder Storkøbenhavn.</p></div>
  </div>
</div></section>`;
export default function Info() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
