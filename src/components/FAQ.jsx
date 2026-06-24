const HTML = `<!-- FAQ -->
<section class="sec info" id="faq"><div class="wrap">
  <div class="center"><div class="eyebrow" data-i18n="faq_eyebrow">Spørgsmål & svar</div><h2 class="sec-title" data-i18n="faq_title">Ofte stillede spørgsmål</h2></div>
  <div class="faq" id="faqList"></div>
  <div style="text-align:center;margin-top:32px">
    <a href="/faq" style="display:inline-flex;align-items:center;gap:8px;color:var(--green);font-size:14px;font-weight:700;text-decoration:none;border:1.5px solid rgba(55,210,120,.3);border-radius:50px;padding:11px 26px;background:rgba(55,210,120,.05);transition:.2s" onmouseover="this.style.background='rgba(55,210,120,.12)'" onmouseout="this.style.background='rgba(55,210,120,.05)'">Se alle spørgsmål <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
  </div>
</div></section>`;
export default function FAQ() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
