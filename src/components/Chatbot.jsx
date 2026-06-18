const HTML = `<!-- CHATBOT -->
<div id="chatbot" class="chatbot">
  <button id="chatToggle" class="chat-toggle" aria-label="Chat">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <span class="chat-badge" id="chatBadge">1</span>
  </button>
  <div id="chatWindow" class="chat-window" style="display:none">
    <div class="chat-header">
      <div class="chat-header-info">
        <div class="chat-avatar"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- antenna -->
  <line x1="11" y1="1" x2="11" y2="4" stroke="#062313" stroke-width="1.4" stroke-linecap="round"/>
  <circle cx="11" cy="1" r="1" fill="#062313"/>
  <!-- head -->
  <rect x="3" y="4" width="16" height="11" rx="3" fill="#062313" opacity="0.85"/>
  <rect x="4" y="5" width="14" height="9" rx="2.2" fill="#1aff7a" opacity="0.18"/>
  <!-- eyes -->
  <rect x="6" y="7.5" width="3.5" height="3" rx="1" fill="#062313"/>
  <rect x="12.5" y="7.5" width="3.5" height="3" rx="1" fill="#062313"/>
  <circle cx="7.75" cy="9" r="1" fill="#7effc2"/>
  <circle cx="14.25" cy="9" r="1" fill="#7effc2"/>
  <!-- mouth -->
  <rect x="7" y="12" width="8" height="1.5" rx="0.75" fill="#062313" opacity="0.6"/>
  <rect x="8" y="12" width="1.5" height="1.5" rx="0.4" fill="#7effc2"/>
  <rect x="10.25" y="12" width="1.5" height="1.5" rx="0.4" fill="#7effc2"/>
  <rect x="12.5" y="12" width="1.5" height="1.5" rx="0.4" fill="#7effc2"/>
  <!-- body -->
  <rect x="7" y="15.5" width="8" height="4" rx="1.5" fill="#062313" opacity="0.7"/>
  <rect x="9" y="16.5" width="4" height="2" rx="0.8" fill="#1aff7a" opacity="0.3"/>
</svg></div>
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
