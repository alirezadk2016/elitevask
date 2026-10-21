
const HTML = `<!-- CHATBOT -->
<div id="chatbot" class="chatbot">
  <button id="chatToggle" class="chat-toggle" aria-label="Chat med Elite Vask">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.1A8.5 8.5 0 1 1 21 12Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" stroke-width="2.6"/></svg>
    <span class="chat-toggle-dot" aria-hidden="true"></span>
  </button>
  <div id="chatWindow" class="chat-window" style="display:none">
    <div class="chat-header">
      <div class="chat-header-info">
        <div class="chat-avatar">
          <img src="/logo-96.webp" width="96" height="96" alt="" decoding="async">
          <span class="chat-av-online"></span>
        </div>
        <div>
          <div class="chat-name">Elite Vask</div>
          <div class="chat-status" data-i18n="chat_status">Online nu</div>
        </div>
      </div>
      <a href="tel:+4524440321" class="chat-call" aria-label="Ring til Elite Vask"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"/></svg></a>
      <button type="button" aria-label="Luk chat" id="chatClose" class="chat-close"><svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>

    <div id="chatIntro" class="chat-intro" style="display:none">
      <div class="intro-stage">
        <span class="intro-halo"></span>
        <span class="intro-ring"></span>
        <div class="intro-bot"><img src="/logo-96.webp" width="96" height="96" alt="" decoding="async"><span class="intro-sweep"></span></div>
        <span class="intro-spark s1"></span>
        <span class="intro-spark s2"></span>
        <span class="intro-spark s3"></span>
        <span class="intro-spark s4"></span>
        <span class="intro-spark s5"></span>
      </div>
      <p class="intro-label" data-i18n="chat_intro_label">Elite Vask er klar</p>
      <span class="intro-loadbar"></span>
    </div>

    <div id="chatMessages" class="chat-messages"></div>
    <div class="chat-quick" id="chatQuick"></div>
    <div class="chat-input-row">
      <input id="chatInput" type="text" placeholder="Skriv dit spørgsmål..." autocomplete="off" aria-label="Skriv dit spørgsmål" data-i18n-ph="chat_ph">
      <button id="chatSend" class="btn btn-green chat-send-btn" aria-label="Send" data-i18n-aria="chat_send"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button>
    </div>
    <div class="chat-foot" data-i18n="chat_foot">Svar med det samme · Ring +45 24 44 03 21</div>
  </div>
</div>`;
export default function Chatbot() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
