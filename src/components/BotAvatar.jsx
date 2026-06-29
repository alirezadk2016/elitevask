/**
 * Premium 3D Elite Bot avatar — brushed-gold metallic frame with directional
 * lighting, glass-dome face, refined glowing-lens eyes. Single source, any size.
 */
export function botAvatarSvg(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- diagonal brushed-gold: bright top-left → deep bottom-right = 3D light -->
    <linearGradient id="bav-gold" x1="14%" y1="6%" x2="86%" y2="96%">
      <stop offset="0%"   stop-color="#fff6cf"/>
      <stop offset="20%"  stop-color="#f3d873"/>
      <stop offset="46%"  stop-color="#d4af37"/>
      <stop offset="70%"  stop-color="#9a7712"/>
      <stop offset="100%" stop-color="#c8a02e"/>
    </linearGradient>
    <!-- inner channel: darker recessed gold for the bevel -->
    <linearGradient id="bav-gold-in" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#5e470a"/>
      <stop offset="50%"  stop-color="#9c7c1c"/>
      <stop offset="100%" stop-color="#6f540b"/>
    </linearGradient>
    <!-- glossy dark glass face -->
    <radialGradient id="bav-face" cx="50%" cy="28%" r="82%">
      <stop offset="0%"   stop-color="#163a28"/>
      <stop offset="52%"  stop-color="#091a11"/>
      <stop offset="100%" stop-color="#030f08"/>
    </radialGradient>
    <!-- curved top reflection on the glass -->
    <linearGradient id="bav-glass" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity=".20"/>
      <stop offset="55%"  stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <!-- refined emerald lens -->
    <radialGradient id="bav-eye" cx="34%" cy="26%" r="82%">
      <stop offset="0%"   stop-color="#e6fff1"/>
      <stop offset="20%"  stop-color="#56ffab"/>
      <stop offset="52%"  stop-color="#00e676"/>
      <stop offset="100%" stop-color="#015c2b"/>
    </radialGradient>
    <linearGradient id="bav-smile" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#9a7712"/>
      <stop offset="50%"  stop-color="#f3d873"/>
      <stop offset="100%" stop-color="#9a7712"/>
    </linearGradient>
    <filter id="bav-glow" x="-90%" y="-90%" width="280%" height="280%">
      <feGaussianBlur stdDeviation="2.6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="bav-soft" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="4.5"/>
    </filter>
    <filter id="bav-drop" x="-25%" y="-25%" width="150%" height="155%">
      <feDropShadow dx="0" dy="3.5" stdDeviation="4.5" flood-color="#000" flood-opacity=".55"/>
    </filter>
  </defs>

  <!-- dark base (fills the circular header clip cleanly) -->
  <rect width="100" height="100" fill="#06140c"/>
  <!-- ambient gold floor glow under the head -->
  <ellipse cx="50" cy="90" rx="34" ry="7" fill="#d4af37" opacity=".18" filter="url(#bav-soft)"/>

  <!-- antenna -->
  <rect x="48.4" y="7" width="3.2" height="16" rx="1.6" fill="url(#bav-gold)"/>
  <circle cx="50" cy="6" r="6"   fill="#37e08a" opacity=".5" filter="url(#bav-soft)"/>
  <circle cx="50" cy="6" r="3.4" fill="url(#bav-gold)"/>
  <circle cx="48.8" cy="4.9" r="1.1" fill="#fff8d6"/>

  <!-- ===== HEAD ===== -->
  <!-- outer gold frame -->
  <rect x="14" y="20" width="72" height="72" rx="19" fill="url(#bav-gold)" filter="url(#bav-drop)"/>
  <!-- bright top-left rim light -->
  <rect x="15.2" y="21.2" width="69.6" height="69.6" rx="18" fill="none" stroke="#fff7d4" stroke-opacity=".5" stroke-width="1.1"/>
  <!-- dark bottom-right contact shadow -->
  <path d="M84 34 Q85 60 70 80 Q56 91 30 88" fill="none" stroke="#5a440a" stroke-opacity=".5" stroke-width="2"/>
  <!-- recessed inner channel -->
  <rect x="18.5" y="24.5" width="63" height="63" rx="15" fill="url(#bav-gold-in)"/>
  <!-- glass face -->
  <rect x="21" y="27" width="58" height="58" rx="12.5" fill="url(#bav-face)"/>
  <!-- curved glass-dome reflection -->
  <path d="M21 39.5 Q50 22 79 39.5 L79 33 Q79 27 73 27 L27 27 Q21 27 21 33 Z" fill="url(#bav-glass)"/>

  <!-- ===== EYES (refined lenses) ===== -->
  <!-- left -->
  <circle cx="38" cy="52" r="10.5" fill="#040c08"/>
  <circle cx="38" cy="52" r="9.4"  fill="#00d36a" opacity=".30" filter="url(#bav-glow)"/>
  <circle cx="38" cy="52" r="7.4"  fill="url(#bav-eye)"/>
  <circle cx="38" cy="52" r="7.4"  fill="none" stroke="#aaffd7" stroke-opacity=".35" stroke-width=".7"/>
  <circle cx="38" cy="52" r="3.1"  fill="#03130b"/>
  <circle cx="38" cy="52" r="1.3"  fill="#5bffae"/>
  <circle cx="35.4" cy="49.2" r="1.7" fill="#fff" opacity=".9"/>
  <!-- right -->
  <circle cx="62" cy="52" r="10.5" fill="#040c08"/>
  <circle cx="62" cy="52" r="9.4"  fill="#00d36a" opacity=".30" filter="url(#bav-glow)"/>
  <circle cx="62" cy="52" r="7.4"  fill="url(#bav-eye)"/>
  <circle cx="62" cy="52" r="7.4"  fill="none" stroke="#aaffd7" stroke-opacity=".35" stroke-width=".7"/>
  <circle cx="62" cy="52" r="3.1"  fill="#03130b"/>
  <circle cx="62" cy="52" r="1.3"  fill="#5bffae"/>
  <circle cx="59.4" cy="49.2" r="1.7" fill="#fff" opacity=".9"/>

  <!-- ===== SMILE ===== -->
  <path d="M40 68 Q50 75.5 60 68" stroke="url(#bav-smile)" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  <path d="M40 68 Q50 75.5 60 68" stroke="#fff" stroke-width=".6" stroke-linecap="round" fill="none" opacity=".25"/>

  <!-- subtle cheek sensors -->
  <circle cx="28.5" cy="63" r="1.3" fill="#37e08a" opacity=".5"/>
  <circle cx="71.5" cy="63" r="1.3" fill="#37e08a" opacity=".5"/>
</svg>`;
}

export default function BotAvatar({ size = 52 }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: botAvatarSvg(size) }}
      style={{ width: size, height: size, display: 'inline-flex', flexShrink: 0 }}
    />
  );
}
