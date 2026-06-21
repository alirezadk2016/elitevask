'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useUniverseStore } from '../state/universeStore'
import { getGalaxyById } from '../data/universe'

const tokens = {
  bg:       'rgba(4, 8, 20, 0.68)',
  blur:     'blur(24px) saturate(150%)',
  border:   'rgba(255,255,255,0.07)',
  text:     'rgba(255,255,255,0.85)',
  muted:    'rgba(255,255,255,0.35)',
  fontHead: "'Archivo', 'Inter', sans-serif",
  fontBody: "'Space Grotesk', 'Inter', sans-serif",
}

const glass = {
  background:              tokens.bg,
  backdropFilter:          tokens.blur,
  WebkitBackdropFilter:    tokens.blur,
  border:                  `1px solid ${tokens.border}`,
  boxShadow:               '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
}

// ─── Animated breadcrumb segment ─────────────────────────────────────────────
function Crumb({ label, onClick, active }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current,
        { opacity: 0, x: -8, filter: 'blur(6px)' },
        { opacity: 1, x: 0,  filter: 'blur(0px)', duration: 0.4, ease: 'power3.out' }
      )
    }
  }, [label])

  return (
    <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={active ? undefined : onClick}
        style={{
          background: 'none', border: 'none', padding: '3px 0', margin: 0,
          cursor: active ? 'default' : 'pointer',
          color: active ? '#fff' : tokens.muted,
          fontSize: 11, fontWeight: active ? 700 : 400,
          fontFamily: tokens.fontBody, letterSpacing: '0.04em',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.color = tokens.muted }}
      >
        {label}
      </button>
    </span>
  )
}

function Breadcrumb() {
  const level          = useUniverseStore(s => s.level)
  const activeGalaxyId = useUniverseStore(s => s.activeGalaxyId)
  const activePlanetId = useUniverseStore(s => s.activePlanetId)
  const goBack         = useUniverseStore(s => s.goBack)

  const galaxy = activeGalaxyId ? getGalaxyById(activeGalaxyId) : null
  const planet = activePlanetId && galaxy
    ? galaxy.planets.find(p => p.id === activePlanetId)
    : null

  const crumbs = [
    { label: 'Universe', active: level === 'universe', key: 'u' },
    ...(galaxy ? [{ label: galaxy.name, active: level === 'galaxy', key: 'g' }] : []),
    ...(planet ? [{ label: planet.name, active: level === 'planet', key: 'p' }] : []),
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {crumbs.map((c, i) => (
        <span key={c.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          {i > 0 && (
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6"/>
            </svg>
          )}
          <Crumb label={c.label} active={c.active} onClick={goBack} />
        </span>
      ))}
    </div>
  )
}

// ─── Level indicator dots ─────────────────────────────────────────────────────
function LevelDots() {
  const level = useUniverseStore(s => s.level)
  const levels = [
    { id: 'universe', label: 'Universe' },
    { id: 'galaxy',   label: 'Galaxy' },
    { id: 'planet',   label: 'Planet' },
  ]
  const activeIdx = levels.findIndex(l => l.id === level)

  return (
    <div style={{
      ...glass,
      borderRadius: 28, padding: '14px 10px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
    }}>
      {levels.map((l, i) => (
        <div key={l.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            title={l.label}
            style={{
              width: i === activeIdx ? 9 : 5,
              height: i === activeIdx ? 9 : 5,
              borderRadius: '50%',
              background: i === activeIdx ? '#fff' : i < activeIdx ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
              boxShadow: i === activeIdx ? '0 0 10px #fff, 0 0 22px rgba(255,255,255,0.5)' : 'none',
              transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              margin: '3px 0',
            }}
          />
          {i < levels.length - 1 && (
            <div style={{
              width: 1, height: 18,
              background: i < activeIdx
                ? 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5))'
                : 'rgba(255,255,255,0.1)',
              transition: 'background 0.4s',
            }} />
          )}
        </div>
      ))}
      <div style={{
        marginTop: 8,
        color: tokens.muted, fontSize: 8,
        fontFamily: tokens.fontBody, letterSpacing: '0.1em',
        textTransform: 'uppercase',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        transform: 'rotate(180deg)',
      }}>
        {levels[activeIdx]?.label}
      </div>
    </div>
  )
}

// ─── Nova AI hologram assistant ───────────────────────────────────────────────
function NovaAssistant() {
  const text    = useUniverseStore(s => s.hologramText)
  const textRef = useRef(null)
  const prevText = useRef(text)

  useEffect(() => {
    if (text !== prevText.current && textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 6, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out' }
      )
      prevText.current = text
    }
  }, [text])

  return (
    <div style={{
      ...glass, borderRadius: 14,
      padding: '12px 15px', maxWidth: 290,
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #00b4d8 0%, #7b2d8b 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(0,180,216,0.4)',
        }}>
          {/* Bot SVG icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.72A2 2 0 0 1 10 4a2 2 0 0 1 2-2M5 14v5a1 1 0 0 0 1 1h2v-6H5m11 0v6h2a1 1 0 0 0 1-1v-5h-3m-4 0v6h2v-6h-2z"/>
          </svg>
        </div>
        {/* Online indicator */}
        <div style={{
          position: 'absolute', top: -2, right: -2,
          width: 8, height: 8, borderRadius: '50%',
          background: '#00ff88',
          boxShadow: '0 0 8px #00ff88',
          border: '1.5px solid rgba(4,8,20,0.8)',
          animation: 'novapulse 2.4s ease-in-out infinite',
        }} />
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{
          color: '#00b4d8', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          fontFamily: tokens.fontBody, marginBottom: 4,
        }}>
          Nova AI
        </div>
        <div
          ref={textRef}
          style={{
            color: tokens.text, fontSize: 11,
            fontFamily: tokens.fontBody, lineHeight: 1.6,
            opacity: 1,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}

// ─── Main HUD ─────────────────────────────────────────────────────────────────
export default function HUD() {
  const level  = useUniverseStore(s => s.level)
  const goBack = useUniverseStore(s => s.goBack)
  const topRef = useRef(null)

  // Blur-in on mount
  useEffect(() => {
    if (topRef.current) {
      gsap.fromTo(topRef.current,
        { opacity: 0, y: -20, filter: 'blur(10px)' },
        { opacity: 1, y: 0,   filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', delay: 0.2 }
      )
    }
  }, [])

  return (
    <>
      {/* ── Top nav ── */}
      <div
        ref={topRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          ...glass,
          borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none',
          padding: '0 20px', height: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{
          fontFamily: tokens.fontHead,
          fontSize: 14, fontWeight: 800,
          color: '#fff', letterSpacing: '-0.02em',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00b4d8, #7b2d8b)',
            boxShadow: '0 0 10px #00b4d8',
          }} />
          Alireza Makvandi
        </div>

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Back CTA */}
        {level !== 'universe' ? (
          <button
            onClick={goBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.65)',
              fontSize: 11, fontFamily: tokens.fontBody,
              cursor: 'pointer', letterSpacing: '0.04em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.11)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5m7-7-7 7 7 7"/>
            </svg>
            Back
          </button>
        ) : (
          <div style={{ width: 70 }} /> /* spacer */
        )}
      </div>

      {/* ── Right-click hint ── */}
      {level !== 'universe' && (
        <div style={{
          position: 'fixed', bottom: 22, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          color: 'rgba(255,255,255,0.18)',
          fontSize: 9, fontFamily: tokens.fontBody,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          pointerEvents: 'none',
        }}>
          Right-click or ← Back to go up
        </div>
      )}

      {/* ── Universe hint ── */}
      {level === 'universe' && (
        <div style={{
          position: 'fixed', bottom: 22, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          color: 'rgba(255,255,255,0.18)',
          fontSize: 9, fontFamily: tokens.fontBody,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          Click a galaxy to explore · Mouse to drift
        </div>
      )}

      {/* ── Nova AI ── */}
      <div style={{ position: 'fixed', bottom: 22, left: 20, zIndex: 100 }}>
        <NovaAssistant />
      </div>

      {/* ── Level dots ── */}
      <div style={{ position: 'fixed', bottom: 22, right: 20, zIndex: 100 }}>
        <LevelDots />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes novapulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.45; transform: scale(0.7); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  )
}
