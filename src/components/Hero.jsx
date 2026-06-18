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
      <a href="#vaelg" class="btn btn-green btn-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><span data-i18n="hero_cta1">Se priser</span></a>
      <button class="btn btn-ghost btn-lg" data-book data-i18n="hero_cta2">Book med det samme</button>
    </div>
  </div>
</section>`;
export default function Hero() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
