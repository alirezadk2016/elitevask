const HTML = `<!-- HERO -->
<section class="hero hero-img">
  <img src="/hero.jpg.png" alt="Elite Vask medarbejder der dampvasker en sort bil – mobil bilvask på Sjælland" class="hero-bg-img" fetchpriority="high" decoding="async" />
  <div class="hero-overlay"></div>
  <div class="wrap hero-inner">
    <div class="hero-badges">
      <a href="https://www.google.com/maps?cid=14890071893602568107" target="_blank" rel="noopener" class="badge badge-google">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg>
        <span class="htm-stars">★★★★★</span><span class="badge-g-score">5,0</span><span class="badge-g-sep">·</span><span data-i18n="tb_rating">Google anmeldelser</span>
      </a>
      <a href="https://dk.trustpilot.com/evaluate/elite-vask.dk" target="_blank" rel="noopener" class="badge badge-trustpilot" aria-label="Skriv en anmeldelse på Trustpilot">
        <span class="tp-word"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="#00b67a" d="M12 2l2.9 6.95L22 9.6l-5.3 4.7 1.6 7.1L12 17.6 5.7 21.4l1.6-7.1L2 9.6l7.1-.65L12 2z"/></svg>Trustpilot</span>
        <span class="tp-stars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
        <span class="tp-cta" data-i18n="tp_rate">Bedøm os</span>
      </a>
    </div>
    <h1><span data-i18n="hero_h1a">Vi kører til dig</span><br><em data-i18n="hero_h1b">og vasker din bil</em></h1>
    <p data-i18n="hero_p">Professionel mobil dampvask i hele Sjælland – vi kører til din adresse. Ingen kø, ingen kemi, bare en skinnende ren bil.</p>
    <div class="hero-flow">
      <a href="#vaelg" class="flow-step flow-link"><span class="fn">1</span><span data-i18n="flow1">Vælg biltype</span></a>
      <span class="flow-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      <a href="#vaelg" class="flow-step flow-link"><span class="fn">2</span><span data-i18n="flow2">Se pris</span></a>
      <span class="flow-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      <a href="#vaelg" class="flow-step flow-link" id="flowBook3"><span class="fn">3</span><span data-i18n="flow3">Book tid</span></a>
    </div>
    <div class="hero-cta">
      <a href="#vaelg" class="btn btn-green btn-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg><span data-i18n="hero_cta1">Se priser</span></a>
      <button type="button" class="btn btn-ghost btn-lg" data-book data-i18n="hero_cta2">Book med det samme</button>
    </div>
    <div class="hero-trust-mini">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg><span data-i18n="htm_guarantee">100% tilfredshedsgaranti</span></span>
      <span class="htm-dot"></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2v-4c0-1-.7-1.8-1.5-2L16 10l-2.2-2.3c-.4-.4-1-.7-1.7-.7H5c-.6 0-1.1.4-1.4 1L2 11v6h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg><span data-i18n="htm_free">Gratis kørsel</span></span>
    </div>
  </div>
</section>`;
export default function Hero() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
