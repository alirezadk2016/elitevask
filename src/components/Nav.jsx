const HTML = `<!-- NAV -->
<nav class="nav" id="siteNav"><div class="nav-inner">
  <a href="#top" class="logo">
    <span class="logo-mark"><img src="/logo.jpg" alt="Elite Vask logo"></span>
    <span class="logo-text"><span class="a">ELITE VASK</span><span class="b">MOBIL BIL DAMPVASK</span></span>
  </a>
  <div class="nav-links">
    <a href="#vaelg" data-i18n="nav_choose">Se priser</a>
    <a href="/galleri" data-i18n="nav_work">Galleri</a>
    <a href="/faq">FAQ</a>
    <a href="#kontakt" data-i18n="nav_contact">Kontakt</a>
    <a href="/guide" class="guide-nav-link" data-i18n="nav_guide">Guide</a>
  </div>
  <div class="nav-right">
    <div class="lang">
      <button type="button" aria-label="Skift til dansk" aria-pressed="true" data-lang="da" class="on" title="Dansk"><svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true"><rect width="20" height="14" fill="#C60C30"/><rect x="6" y="0" width="3" height="14" fill="white"/><rect x="0" y="5.5" width="20" height="3" fill="white"/></svg>DK</button>
      <button type="button" aria-label="Switch to English" aria-pressed="false" data-lang="en" title="English"><svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true"><rect width="30" height="20" fill="#012169"/><path d="M0,0 L30,20 M30,0 L0,20" stroke="white" stroke-width="4"/><path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" stroke-width="2.4"/><rect x="12" y="0" width="6" height="20" fill="white"/><rect x="0" y="7" width="30" height="6" fill="white"/><rect x="13" y="0" width="4" height="20" fill="#C8102E"/><rect x="0" y="8" width="30" height="4" fill="#C8102E"/></svg>UK</button>
    </div>
    <a href="tel:+4524440321" class="nav-phone" aria-label="Ring nu" title="Ring nu"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg></a>
    <button type="button" class="btn btn-green nav-book-btn" data-book data-i18n="nav_book">Book nu</button>
    <button type="button" class="menu-toggle" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="navDrawer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
  </div>
</div>
<div class="nav-drawer" id="navDrawer">
  <a href="#vaelg" class="drawer-link" data-i18n="nav_choose">Se priser</a>
  <a href="/galleri" class="drawer-link" data-i18n="nav_work">Galleri</a>
  <a href="/guide" class="drawer-link" data-i18n="nav_guide">Guide</a>
  <a href="/faq" class="drawer-link">FAQ</a>
  <a href="#kontakt" class="drawer-link" data-i18n="nav_contact">Kontakt</a>
  <div class="drawer-sep"></div>
  <div class="drawer-lang">
    <button type="button" aria-label="Skift til dansk" aria-pressed="true" data-lang="da" class="drawer-lang-btn on" title="Dansk"><svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true"><rect width="20" height="14" fill="#C60C30"/><rect x="6" y="0" width="3" height="14" fill="white"/><rect x="0" y="5.5" width="20" height="3" fill="white"/></svg>DK</button>
    <button type="button" aria-label="Switch to English" aria-pressed="false" data-lang="en" class="drawer-lang-btn" title="English"><svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true"><rect width="30" height="20" fill="#012169"/><path d="M0,0 L30,20 M30,0 L0,20" stroke="white" stroke-width="4"/><path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" stroke-width="2.4"/><rect x="12" y="0" width="6" height="20" fill="white"/><rect x="0" y="7" width="30" height="6" fill="white"/><rect x="13" y="0" width="4" height="20" fill="#C8102E"/><rect x="0" y="8" width="30" height="4" fill="#C8102E"/></svg>UK</button>
  </div>
  <div class="drawer-actions">
    <a href="tel:+4524440321" class="btn drawer-call"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg><span data-i18n="m_call">Ring nu</span></a>
    <button class="btn btn-green" data-book data-i18n="nav_book">Book nu</button>
  </div>
</div></nav>
<a href="https://www.google.com/maps?cid=14890071893602568107" target="_blank" rel="noopener" class="mob-google-strip">
  <span class="mgs-logo"><svg viewBox="0 0 24 24" width="15" height="15"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.1Z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6 14.2a6.6 6.6 0 0 1 0-4.2V7.2H2.3a11 11 0 0 0 0 9.8L6 14.2Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.2L6 10c.9-2.5 3.2-4.4 6-4.4Z"/></svg> Google</span>
  <span class="mgs-divider"></span>
  <span class="mgs-stars">★★★★★</span>
  <span class="mgs-score">5.0</span>
  <span class="mgs-divider"></span>
  <span class="mgs-label">Se anmeldelser</span>
</a>`;
export default function Nav() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
