const HTML = `<!-- WHY -->
<section class="sec" id="hvorfor"><div class="wrap">
  <div class="center"><div class="eyebrow" data-i18n="why_eyebrow">Hvorfor vælge os</div><h2 class="sec-title" data-i18n="why_title">Tillid og kvalitet i centrum</h2></div>
  <div class="why-grid">
    <div class="why"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg></div><div><h4 data-i18n="why1t">Gennemsigtige priser</h4><p data-i18n="why1p">Du kender prisen, før vi kører ud. Ingen overraskelser.</p></div></div>
    <div class="why"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/></svg></div><div><h4 data-i18n="why2t">Miljøvenlig dampvask</h4><p data-i18n="why2p">Skånsom metode med minimalt vandforbrug.</p></div></div>
    <div class="why"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></svg></div><div><h4 data-i18n="why3t">Vi kommer til dig</h4><p data-i18n="why3p">Hjemme, på kontoret eller i sommerhuset.</p></div></div>
    <div class="why"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z"/></svg></div><div><h4 data-i18n="why4t">Tilfredshedsgaranti</h4><p data-i18n="why4p">Ikke tilfreds? Så finder vi en løsning.</p></div></div>
  </div>
</div></section>`;
export default function Why() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
