import { lastModified } from "@/lib/pageDates";
const HTML = `<!-- FOOTER -->
<footer class="footer"><div class="wrap">
  <div class="footer-grid">
    <div class="fb">
      <a href="#top" class="logo"><span class="logo-mark"><picture><source type="image/webp" srcset="/logo-96.webp" sizes="40px"><img src="/logo-96.png" width="96" height="96" alt="Elite Vask logo" loading="lazy" decoding="async"></picture></span><span class="logo-text"><span class="a">ELITE VASK</span><span class="b">MOBIL BIL DAMPVASK</span></span></a>
      <p data-i18n="foot_p">Professionel mobil bilpleje på Sjælland – dampvask direkte på din adresse. Rent, skånsomt og miljøvenligt.</p>
      <div class="foot-loc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span>København · Sjælland · Danmark</span></div>
      <div class="cvr">© ${new Date().getFullYear()} Elite Vask · CVR 46392264</div>
    </div>
    <div class="col"><h3 data-i18n="foot_s1">Service</h3><a href="#vaelg" data-i18n="foot_l1">Vælg bil & priser</a><a href="#arbejde" data-i18n="foot_l2">Vores arbejde</a><a href="#anmeldelser" data-i18n="foot_l3">Anmeldelser</a><a href="/about" title="About Elite Vask">Om Elite Vask</a><a href="/kontakt#contact" title="Contact">Kontakt</a><a href="/faq">FAQ</a></div>
    <div class="col"><h3 data-i18n="foot_s2">Kontakt</h3><a href="tel:+4524440321">+45 24 44 03 21</a><a href="mailto:info@elite-vask.dk">info@elite-vask.dk</a><a href="https://instagram.com/elitevasksjaelland">@elitevasksjaelland</a><a href="https://www.facebook.com/share/14ciFraNT4M/">Facebook</a></div>
  </div>
  <div class="footer-bottom"><span>Rent • Effektivt • Miljøvenligt</span><span class="foot-byline">Udgivet af Elite Vask · Opdateret __UPDATED__</span><span class="foot-legal"><a href="/handelsbetingelser#terms" rel="terms-of-service" title="Terms of service">Handelsbetingelser</a> · <a href="/privatpolitik#privacy-policy" rel="privacy-policy" title="Privacy policy">Privatlivspolitik</a> · <a href="/cookies">Cookies</a></span></div>
  <a href="https://www.makvandi.dk/" target="_blank" rel="noopener" class="mak-credit">
    <span class="mak-line"></span>
    <span class="mak-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span class="mak-label">crafted by</span>
      <span class="mak-sig">MAK</span>
    </span>
    <span class="mak-line"></span>
  </a>
</div></footer>`;
/* Visible byline + machine-readable update date (the same date the sitemap and
   the WebPage schema use). Answer engines read provenance and freshness from
   the page itself, not only from JSON-LD. */
const MONTHS = ["januar","februar","marts","april","maj","juni","juli","august","september","oktober","november","december"];
export default function Footer() {
  const iso = lastModified("/") || "2026-10-10";
  const [y, m, d] = iso.split("-").map(Number);
  const html = HTML.replace("__UPDATED__", `<time datetime="${iso}">${d}. ${MONTHS[m - 1]} ${y}</time>`);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
