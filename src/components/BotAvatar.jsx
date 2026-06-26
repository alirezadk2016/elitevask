/**
 * Premium 3D Elite Bot avatar — gold metallic frame, dark glossy face, glowing green eyes.
 * Single source used at all sizes via SVG scaling.
 */
export function botAvatarSvg(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bav-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#f0d060"/>
      <stop offset="28%"  stop-color="#d4af37"/>
      <stop offset="55%"  stop-color="#f5e590"/>
      <stop offset="82%"  stop-color="#a8860a"/>
      <stop offset="100%" stop-color="#d4af37"/>
    </linearGradient>
    <linearGradient id="bav-gold-h" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#8a6b00"/>
      <stop offset="18%"  stop-color="#d4af37"/>
      <stop offset="82%"  stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#8a6b00"/>
    </linearGradient>
    <radialGradient id="bav-face" cx="50%" cy="36%" r="62%">
      <stop offset="0%"   stop-color="#1d3324"/>
      <stop offset="65%"  stop-color="#0b1811"/>
      <stop offset="100%" stop-color="#050d07"/>
    </radialGradient>
    <radialGradient id="bav-eye" cx="28%" cy="22%" r="75%">
      <stop offset="0%"   stop-color="#90ffcc"/>
      <stop offset="35%"  stop-color="#00e676"/>
      <stop offset="100%" stop-color="#006b2b"/>
    </radialGradient>
    <filter id="bav-glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.8" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="bav-frameshadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity=".6"/>
    </filter>
    <linearGradient id="bav-shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#fff" stop-opacity=".22"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- dark base so SVG looks clean in a circular clip or transparent bg -->
  <rect width="100" height="100" fill="#071910"/>

  <!-- antenna stem -->
  <rect x="47" y="9" width="6" height="15" rx="3" fill="url(#bav-gold)"/>
  <!-- antenna tip glow -->
  <circle cx="50" cy="7.5" r="5.5" fill="#d4af37" opacity=".55" filter="url(#bav-glow)"/>
  <circle cx="50" cy="7.5" r="3.8" fill="url(#bav-gold)"/>
  <circle cx="50" cy="7.5" r="2"   fill="#f8ea72"/>

  <!-- frame drop shadow -->
  <rect x="13" y="22" width="74" height="70" rx="16" fill="#000" opacity=".5" transform="translate(2,3)"/>

  <!-- gold outer frame -->
  <rect x="13" y="22" width="74" height="70" rx="16" fill="url(#bav-gold)" filter="url(#bav-frameshadow)"/>
  <!-- top bevel shine -->
  <rect x="13" y="22" width="74" height="13" rx="13" fill="url(#bav-shine)"/>
  <!-- left edge highlight -->
  <rect x="13" y="22" width="5"  height="70" rx="4"  fill="#fff" opacity=".08"/>
  <!-- right edge shadow -->
  <rect x="82" y="22" width="5"  height="70" rx="4"  fill="#000" opacity=".18"/>
  <!-- bottom edge shadow -->
  <rect x="13" y="85" width="74" height="7"  rx="7"  fill="#000" opacity=".25"/>

  <!-- dark face inset -->
  <rect x="17" y="26" width="66" height="62" rx="13" fill="url(#bav-face)"/>

  <!-- subtle face top gloss -->
  <ellipse cx="50" cy="33" rx="22" ry="5.5" fill="#fff" opacity=".06"/>

  <!-- left eye socket -->
  <ellipse cx="34" cy="51" rx="12" ry="10.5" fill="#060e09"/>
  <!-- left eye glow halo -->
  <ellipse cx="34" cy="51" rx="10.5" ry="9" fill="#00c853" opacity=".28" filter="url(#bav-glow)"/>
  <!-- left iris -->
  <ellipse cx="34" cy="51" rx="8.5"  ry="7.5" fill="url(#bav-eye)"/>
  <!-- left pupil -->
  <ellipse cx="34" cy="51" rx="4.5"  ry="4"   fill="#050e07"/>
  <!-- left pupil inner glow -->
  <ellipse cx="34" cy="51" rx="2"    ry="1.8"  fill="#00e676" opacity=".5"/>
  <!-- left specular highlight -->
  <ellipse cx="30.5" cy="47.5" rx="2.2" ry="1.6" fill="#fff" opacity=".88"/>

  <!-- right eye socket -->
  <ellipse cx="66" cy="51" rx="12" ry="10.5" fill="#060e09"/>
  <!-- right eye glow halo -->
  <ellipse cx="66" cy="51" rx="10.5" ry="9"   fill="#00c853" opacity=".28" filter="url(#bav-glow)"/>
  <!-- right iris -->
  <ellipse cx="66" cy="51" rx="8.5"  ry="7.5" fill="url(#bav-eye)"/>
  <!-- right pupil -->
  <ellipse cx="66" cy="51" rx="4.5"  ry="4"   fill="#050e07"/>
  <!-- right pupil inner glow -->
  <ellipse cx="66" cy="51" rx="2"    ry="1.8"  fill="#00e676" opacity=".5"/>
  <!-- right specular highlight -->
  <ellipse cx="62.5" cy="47.5" rx="2.2" ry="1.6" fill="#fff" opacity=".88"/>

  <!-- smile -->
  <path d="M36 67.5 Q50 77 64 67.5" stroke="url(#bav-gold)"   stroke-width="2.6" stroke-linecap="round"/>
  <path d="M36 67.5 Q50 77 64 67.5" stroke="#fff"             stroke-width=".7"  stroke-linecap="round" opacity=".2"/>

  <!-- chin accent bar -->
  <rect x="38" y="80" width="24" height="3" rx="1.5" fill="url(#bav-gold-h)" opacity=".38"/>
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
