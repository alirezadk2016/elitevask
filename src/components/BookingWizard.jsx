const HTML = `<!-- WIZARD MODAL -->
<div class="modal" id="modal">
  <div class="wiz">
    <div class="wiz-top"><h3 data-i18n="wiz_title">Book din bilvask</h3><button class="wiz-close" id="wizClose"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="wiz-prog" id="wizProg"></div>
    <div class="wiz-body" id="wizBody"></div>
  </div>
</div>`;
export default function BookingWizard() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
