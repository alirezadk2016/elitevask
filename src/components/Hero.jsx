const HTML = `<!-- HERO -->
<section class="hero hero-img">
  <img src="/hero.jpg.png" alt="Elite Vask dampvask" class="hero-bg-img" />
  <div class="hero-overlay"></div>
  <div class="wrap hero-inner">
    <div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span data-i18n="hero_badge">Vi kører til dig – hele Sjælland</span></div>
    <h1><span data-i18n="hero_h1a">Vi kører til dig</span><br><em data-i18n="hero_h1b">og vasker din bil</em></h1>
    <p data-i18n="hero_p">Mobil bil dampvask med premium produkter. Rent, effektivt og miljøvenligt – uden at du forlader hjemmet.</p>
    <div class="hero-flow">
      <a href="#vaelg" class="flow-step flow-link"><span class="fn">1</span><span data-i18n="flow1">Vælg biltype</span></a>
      <span class="flow-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      <a href="#vaelg" class="flow-step flow-link"><span class="fn">2</span><span data-i18n="flow2">Se pris</span></a>
      <span class="flow-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      <a href="#" class="flow-step flow-link" id="flowBook3"><span class="fn">3</span><span data-i18n="flow3">Book tid</span></a>
    </div>
    <div class="hero-cta">
      <a href="#vaelg" class="btn btn-green btn-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg><span data-i18n="hero_cta1">Se priser</span></a>
      <button class="btn btn-ghost btn-lg" data-book data-i18n="hero_cta2">Book med det samme</button>
    </div>
    <a href="https://www.google.com/maps?cid=14890071893602568107" target="_blank" rel="noopener" class="google-rating-badge">
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      <span class="gr-stars">★★★★★</span>
      <span class="gr-text">Google anmeldelser</span>
    </a>
  </div>
</section>`;
export default function Hero() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
