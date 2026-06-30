import { botAvatarSvg } from './BotAvatar';

const HTML = `<!-- CHATBOT -->
<div id="chatbot" class="chatbot">
  <button id="chatToggle" class="chat-toggle" aria-label="Chat">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <span class="chat-badge" id="chatBadge">1</span>
  </button>
  <div id="chatWindow" class="chat-window" style="display:none">
    <div class="chat-header">
      <div class="chat-header-info">
        <div class="chat-avatar">
          ${botAvatarSvg(48)}
          <span class="chat-av-online"></span>
        </div>
        <div>
          <div class="chat-name">Elite Bot</div>
          <div class="chat-status" data-i18n="chat_status">Online nu</div>
        </div>
      </div>
      <button type="button" aria-label="Luk chat" id="chatClose" class="chat-close"><svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>

    <div id="chatIntro" class="chat-intro" style="display:none">
      <div class="intro-stage">
        <span class="intro-halo"></span>
        <span class="intro-ring"></span>
        <div class="intro-bot">${botAvatarSvg(132)}<span class="intro-sweep"></span></div>
        <span class="intro-spark s1"></span>
        <span class="intro-spark s2"></span>
        <span class="intro-spark s3"></span>
        <span class="intro-spark s4"></span>
        <span class="intro-spark s5"></span>
      </div>
      <p class="intro-label" data-i18n="chat_intro_label">Elite Bot er klar!</p>
      <span class="intro-loadbar"></span>
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
