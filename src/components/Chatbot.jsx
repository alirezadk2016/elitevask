const HTML = `<!-- CHATBOT -->
<div id="chatbot" class="chatbot">
  <button id="chatToggle" class="chat-toggle" aria-label="Chat">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <span class="chat-badge" id="chatBadge">1</span>
  </button>
  <div id="chatWindow" class="chat-window" style="display:none">
    <div class="chat-header">
      <div class="chat-header-info">
        <div class="chat-avatar"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="3" r="1.5" fill="#062313"/><line x1="12" y1="4.5" x2="12" y2="7" stroke="#062313" stroke-width="1.5" stroke-linecap="round"/><rect x="4" y="7" width="16" height="10" rx="3" fill="#062313"/><circle cx="8.5" cy="12" r="2" fill="#9afabd"/><circle cx="15.5" cy="12" r="2" fill="#9afabd"/><circle cx="8.5" cy="12" r="0.9" fill="#062313"/><circle cx="15.5" cy="12" r="0.9" fill="#062313"/><rect x="9" y="15.5" width="6" height="1.5" rx="0.75" fill="#9afabd"/><rect x="7" y="18" width="10" height="5" rx="2" fill="#062313"/><rect x="10" y="19.5" width="4" height="2" rx="0.8" fill="#9afabd" opacity="0.4"/></svg></div>
        <div>
          <div class="chat-name">Elite Bot</div>
          <div class="chat-status" data-i18n="chat_status">Svar indenfor minutter</div>
        </div>
      </div>
      <button id="chatClose" class="chat-close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>
    <div id="chatMessages" class="chat-messages"></div>
    <div class="chat-quick" id="chatQuick"></div>
    <div class="chat-input-row">
      <input id="chatInput" type="text" placeholder="Skriv dit spørgsmål..." autocomplete="off">
      <button id="chatSend" class="btn btn-green chat-send-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button>
    </div>
  </div>
</div>`;
export default function Chatbot() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
