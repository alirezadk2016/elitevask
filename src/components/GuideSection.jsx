const HTML = `<!-- GUIDE SECTION -->
<section class="guide-section" id="guide"><div class="guide-section-inner">
  <div class="section-eyebrow">Bilpleje Guide</div>
  <h2 class="section-title">Lær mere om bilpleje</h2>
  <p class="section-sub">Praktiske guides baseret på faktuel viden – så du ved, hvornår og hvordan du bedst plejer din bil.</p>
  <div class="guide-cards">
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
</div></section>`;

export default function GuideSection() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
