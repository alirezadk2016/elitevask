const HTML = `<!-- NAV -->
<nav class="nav" id="siteNav"><div class="nav-inner">
  <a href="#top" class="logo">
    <span class="logo-mark"><img src="/logo.jpg" alt="Elite Vask logo"></span>
    <span class="logo-text"><span class="a">ELITE VASK</span><span class="b">MOBIL BIL DAMPVASK</span></span>
  </a>
  <div class="nav-links">
    <a href="#vaelg" data-i18n="nav_choose">Vælg bil</a>
    <a href="#arbejde" data-i18n="nav_work">Vores arbejde</a>
    <a href="#faq">FAQ</a>
    <a href="#kontakt" data-i18n="nav_contact">Kontakt</a>
  </div>
  <div class="nav-right">
    <div class="lang">
      <button data-lang="da" class="on" title="Dansk"><svg viewBox="0 0 20 14" width="20" height="14"><rect width="20" height="14" fill="#C60C30"/><rect x="6" y="0" width="3" height="14" fill="white"/><rect x="0" y="5.5" width="20" height="3" fill="white"/></svg>DK</button>
      <button data-lang="en" title="English"><svg viewBox="0 0 30 20" width="20" height="14"><rect width="30" height="20" fill="#012169"/><path d="M0,0 L30,20 M30,0 L0,20" stroke="white" stroke-width="4"/><path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" stroke-width="2.4"/><rect x="12" y="0" width="6" height="20" fill="white"/><rect x="0" y="7" width="30" height="6" fill="white"/><rect x="13" y="0" width="4" height="20" fill="#C8102E"/><rect x="0" y="8" width="30" height="4" fill="#C8102E"/></svg>UK</button>
    </div>
    <a href="tel:+4524440321" class="nav-phone" data-i18n="m_call"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>Ring nu</a>
    <button class="btn btn-green nav-book-btn" data-book data-i18n="nav_book">Book nu</button>
    <button class="menu-toggle" id="menuBtn" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
  </div>
</div>
<div class="nav-drawer" id="navDrawer">
  <a href="#vaelg" class="drawer-link" data-i18n="nav_choose">Vælg bil</a>
  <a href="#arbejde" class="drawer-link" data-i18n="nav_work">Vores arbejde</a>
  <a href="#faq" class="drawer-link">FAQ</a>
  <a href="#kontakt" class="drawer-link" data-i18n="nav_contact">Kontakt</a>
  <div class="drawer-sep"></div>
  <div class="drawer-lang">
    <button data-lang="da" class="drawer-lang-btn on" title="Dansk"><svg viewBox="0 0 20 14" width="20" height="14"><rect width="20" height="14" fill="#C60C30"/><rect x="6" y="0" width="3" height="14" fill="white"/><rect x="0" y="5.5" width="20" height="3" fill="white"/></svg>DK</button>
    <button data-lang="en" class="drawer-lang-btn" title="English"><svg viewBox="0 0 30 20" width="20" height="14"><rect width="30" height="20" fill="#012169"/><path d="M0,0 L30,20 M30,0 L0,20" stroke="white" stroke-width="4"/><path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" stroke-width="2.4"/><rect x="12" y="0" width="6" height="20" fill="white"/><rect x="0" y="7" width="30" height="6" fill="white"/><rect x="13" y="0" width="4" height="20" fill="#C8102E"/><rect x="0" y="8" width="30" height="4" fill="#C8102E"/></svg>UK</button>
  </div>
  <div class="drawer-actions">
    <a href="tel:+4524440321" class="btn drawer-call"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg><span data-i18n="m_call">Ring nu</span></a>
    <button class="btn btn-green" data-book data-i18n="nav_book">Book nu</button>
  </div>
</div></nav>`;
export default function Nav() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
