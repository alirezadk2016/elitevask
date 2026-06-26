const HTML = `<!-- CHATBOT -->
<div id="chatbot" class="chatbot">
  <button id="chatToggle" class="chat-toggle" aria-label="Chat">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <span class="chat-badge" id="chatBadge">1</span>
  </button>
  <div id="chatWindow" class="chat-window" style="display:none">
    <div class="chat-header">
      <div class="chat-header-info">
        <div class="chat-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="3" r="1.5" fill="#062313"/><line x1="12" y1="4.5" x2="12" y2="7" stroke="#062313" stroke-width="1.5" stroke-linecap="round"/><rect x="4" y="7" width="16" height="10" rx="3" fill="#062313"/><circle cx="8.5" cy="12" r="2" fill="#9afabd"/><circle cx="15.5" cy="12" r="2" fill="#9afabd"/><circle cx="8.5" cy="12" r="0.9" fill="#062313"/><circle cx="15.5" cy="12" r="0.9" fill="#062313"/><rect x="9" y="15.5" width="6" height="1.5" rx="0.75" fill="#9afabd"/><rect x="7" y="18" width="10" height="5" rx="2" fill="#062313"/><rect x="10" y="19.5" width="4" height="2" rx="0.8" fill="#9afabd" opacity="0.4"/></svg>
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
      <svg class="intro-svg" viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="iglow" cx="50%" cy="85%" r="55%">
            <stop offset="0%" stop-color="#d4af37" stop-opacity=".18"/>
            <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
          </radialGradient>
          <filter id="gf" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="gf2" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- ambient gold ground glow -->
        <ellipse cx="110" cy="115" rx="88" ry="8" fill="url(#iglow)"/>
        <!-- CAR — luxury sedan outline -->
        <g class="intro-car-g">
          <!-- body -->
          <path d="M14 76 L14 74 Q14 70 18 70 L24 70 L34 55 Q44 42 68 38 L130 38 Q156 42 168 56 L178 70 L202 70 Q206 70 206 74 L206 98 Q206 102 202 102 L18 102 Q14 102 14 98 Z" fill="#071a0f" stroke="#d4af37" stroke-width="1.4" stroke-opacity=".75"/>
          <!-- roof line -->
          <path d="M68 38 Q78 24 100 20 L130 20 Q148 22 152 38 Z" fill="#081606" stroke="#d4af37" stroke-width="1" stroke-opacity=".5"/>
          <!-- front window -->
          <path d="M70 38 L80 24 L98 20 L98 38 Z" fill="#1c5535" opacity=".85"/>
          <!-- rear window -->
          <path d="M132 20 L150 24 L150 38 L132 38 Z" fill="#1c5535" opacity=".85"/>
          <!-- mid window -->
          <rect x="100" y="20" width="30" height="18" rx="1.5" fill="#1c5535" opacity=".9"/>
          <!-- headlight -->
          <rect x="16" y="78" width="20" height="10" rx="4" fill="#eafff2" opacity=".95"/>
          <rect x="16" y="78" width="20" height="10" rx="4" fill="#9afabd" opacity=".5" filter="url(#gf)"/>
          <!-- tail light -->
          <rect x="184" y="78" width="20" height="10" rx="4" fill="#ff4444" opacity=".75"/>
          <!-- door divider -->
          <line x1="120" y1="44" x2="120" y2="100" stroke="#d4af37" stroke-width=".8" opacity=".2"/>
          <!-- body crease line -->
          <line x1="20" y1="82" x2="200" y2="82" stroke="#d4af37" stroke-width=".6" opacity=".15"/>
          <!-- door handle front -->
          <rect x="88" y="80" width="16" height="3.5" rx="1.8" fill="#d4af37" opacity=".25"/>
          <!-- door handle rear -->
          <rect x="135" y="80" width="16" height="3.5" rx="1.8" fill="#d4af37" opacity=".25"/>
          <!-- front wheel -->
          <circle cx="54" cy="104" r="19" fill="#040c07"/>
          <circle cx="54" cy="104" r="15" fill="#0b1a0e" stroke="#d4af37" stroke-width="1.2" stroke-opacity=".45"/>
          <circle cx="54" cy="104" r="7" fill="#d4af37" opacity=".12"/>
          <circle cx="54" cy="104" r="3" fill="#d4af37" opacity=".4"/>
          <!-- rear wheel -->
          <circle cx="166" cy="104" r="19" fill="#040c07"/>
          <circle cx="166" cy="104" r="15" fill="#0b1a0e" stroke="#d4af37" stroke-width="1.2" stroke-opacity=".45"/>
          <circle cx="166" cy="104" r="7" fill="#d4af37" opacity=".12"/>
          <circle cx="166" cy="104" r="3" fill="#d4af37" opacity=".4"/>
        </g>
        <!-- steam sparkles -->
        <circle class="isp1" cx="85" cy="14" r="3.5" fill="#d4af37" filter="url(#gf2)"/>
        <circle class="isp2" cx="110" cy="8"  r="2.8" fill="#d4af37" filter="url(#gf2)"/>
        <circle class="isp3" cx="136" cy="12" r="3"   fill="#d4af37" filter="url(#gf2)"/>
        <circle class="isp4" cx="98"  cy="3"  r="1.8" fill="#d4af37" opacity=".7"/>
        <circle class="isp5" cx="122" cy="2"  r="1.5" fill="#d4af37" opacity=".6"/>
      </svg>
      <p class="intro-label" data-i18n="chat_intro_label">Elite Bot er klar!</p>
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
