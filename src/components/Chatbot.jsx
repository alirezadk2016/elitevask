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
      <button id="chatClose" class="chat-close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>

    <div id="chatIntro" class="chat-intro" style="display:none">
      <svg class="intro-svg" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="aboveRoof">
            <rect x="0" y="0" width="220" height="56"/>
          </clipPath>
          <filter id="botGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- ground shadow -->
        <ellipse cx="110" cy="155" rx="100" ry="5" fill="#000" opacity="0.25"/>

        <!-- CAR GROUP -->
        <g class="intro-car-g">
          <!-- body -->
          <rect x="5" y="92" width="210" height="50" rx="16" fill="#0a2a18"/>
          <!-- cabin -->
          <rect x="50" y="54" width="124" height="42" rx="13" fill="#0c3018"/>
          <!-- windshield -->
          <rect x="54" y="58" width="46" height="34" rx="7" fill="#1a6040" opacity="0.9"/>
          <!-- mid window -->
          <rect x="104" y="58" width="38" height="34" rx="6" fill="#1a6040" opacity="0.9"/>
          <!-- rear window -->
          <rect x="146" y="58" width="24" height="34" rx="5" fill="#1a6040" opacity="0.9"/>
          <!-- sunroof hole -->
          <rect x="104" y="54" width="38" height="10" rx="3" fill="#020a05"/>
          <!-- body shine stripe -->
          <rect x="11" y="92" width="198" height="5" rx="4" fill="#fff" opacity="0.04"/>
          <!-- headlight -->
          <rect x="6" y="101" width="22" height="13" rx="5" fill="#e8ffee" opacity="0.95"/>
          <rect x="6" y="101" width="22" height="13" rx="5" fill="#9afabd" opacity="0.35" filter="url(#botGlow)"/>
          <!-- tail light -->
          <rect x="192" y="101" width="22" height="13" rx="5" fill="#ff5555" opacity="0.8"/>
          <!-- door line -->
          <line x1="128" y1="96" x2="128" y2="138" stroke="#051510" stroke-width="1.5" opacity="0.5"/>
          <!-- door handle -->
          <rect x="102" y="116" width="14" height="4" rx="2" fill="#9afabd" opacity="0.2"/>
          <!-- front bumper -->
          <rect x="5" y="128" width="28" height="12" rx="7" fill="#072010"/>
          <!-- rear bumper -->
          <rect x="187" y="128" width="28" height="12" rx="7" fill="#072010"/>
          <!-- wheel wells -->
          <circle cx="62" cy="144" r="26" fill="#040d08"/>
          <circle cx="158" cy="144" r="26" fill="#040d08"/>
          <!-- tires -->
          <circle cx="62" cy="144" r="22" fill="#111"/>
          <circle cx="158" cy="144" r="22" fill="#111"/>
          <!-- rim -->
          <circle cx="62" cy="144" r="11" fill="#1e1e1e"/>
          <circle cx="158" cy="144" r="11" fill="#1e1e1e"/>
          <!-- spoke lines -->
          <line x1="62" y1="133" x2="62" y2="155" stroke="#2a2a2a" stroke-width="2"/>
          <line x1="51" y1="144" x2="73" y2="144" stroke="#2a2a2a" stroke-width="2"/>
          <line x1="158" y1="133" x2="158" y2="155" stroke="#2a2a2a" stroke-width="2"/>
          <line x1="147" y1="144" x2="169" y2="144" stroke="#2a2a2a" stroke-width="2"/>
          <!-- hub caps -->
          <circle cx="62" cy="144" r="5" fill="#9afabd" opacity="0.45"/>
          <circle cx="158" cy="144" r="5" fill="#9afabd" opacity="0.45"/>
        </g>

        <!-- ROBOT GROUP (clipped above car roof) -->
        <g class="intro-robot-g" clip-path="url(#aboveRoof)">
          <!-- left arm (waves) -->
          <rect class="intro-arm-wave" x="95" y="35" width="9" height="20" rx="4" fill="#0e3d20"/>
          <!-- right arm -->
          <rect x="116" y="35" width="9" height="20" rx="4" fill="#0e3d20"/>
          <!-- torso -->
          <rect x="99" y="33" width="22" height="24" rx="6" fill="#0e3d20"/>
          <!-- chest panel glow -->
          <rect x="103" y="38" width="14" height="8" rx="3" fill="#9afabd" opacity="0.12"/>
          <!-- neck -->
          <rect x="107" y="26" width="6" height="9" rx="3" fill="#0b3018"/>
          <!-- head -->
          <rect x="97" y="4" width="26" height="24" rx="8" fill="#103d22"/>
          <!-- head top highlight -->
          <rect x="99" y="5" width="22" height="5" rx="4" fill="#fff" opacity="0.04"/>
          <!-- antenna -->
          <line x1="110" y1="4" x2="110" y2="-2" stroke="#9afabd" stroke-width="2" stroke-linecap="round"/>
          <!-- antenna ball -->
          <circle class="intro-ant-ball" cx="110" cy="-5" r="4" fill="#9afabd" filter="url(#botGlow)"/>
          <!-- eyes -->
          <rect x="100" y="10" width="8" height="7" rx="2.5" fill="#9afabd"/>
          <rect x="112" y="10" width="8" height="7" rx="2.5" fill="#9afabd"/>
          <!-- pupils -->
          <circle cx="104" cy="13.5" r="2.2" fill="#062313"/>
          <circle cx="116" cy="13.5" r="2.2" fill="#062313"/>
          <!-- eye shine -->
          <circle cx="105" cy="12" r="0.9" fill="#fff" opacity="0.9"/>
          <circle cx="117" cy="12" r="0.9" fill="#fff" opacity="0.9"/>
          <!-- mouth -->
          <rect x="103" y="22" width="14" height="3" rx="1.5" fill="#9afabd" opacity="0.45"/>
        </g>
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
