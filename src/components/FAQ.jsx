const HTML = `<!-- FAQ -->
<section class="sec info" id="faq"><div class="wrap">
  <div class="center"><div class="eyebrow" data-i18n="faq_eyebrow">Spørgsmål & svar</div><h2 class="sec-title" data-i18n="faq_title">Ofte stillede spørgsmål</h2></div>
  <div class="faq" id="faqList"></div>
</div></section>`;
export default function FAQ() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
