'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useUniverseStore } from '../state/universeStore'
import { getPlanetById } from '../data/universe'

// ─── Design tokens (from ui-ux-pro-max: Liquid Glass + OLED dark) ────────────
const tokens = {
  bg:        'rgba(4, 8, 20, 0.75)',
  blur:      'blur(28px) saturate(160%)',
  border:    'rgba(255,255,255,0.07)',
  textMuted: 'rgba(255,255,255,0.45)',
  textSub:   'rgba(255,255,255,0.65)',
  fontHead:  "'Archivo', 'Inter', sans-serif",
  fontBody:  "'Space Grotesk', 'Inter', sans-serif",
}

// ─── Magnetic button hook ─────────────────────────────────────────────────────
function useMagnetic(strength = 0.35) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e) => {
      const rect = el.getBoundingClientRect()
      const dx   = e.clientX - (rect.left + rect.width / 2)
      const dy   = e.clientY - (rect.top  + rect.height / 2)
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.3, ease: 'power2.out' })
    }
    const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', reset)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', reset) }
  }, [strength])
  return ref
}

// ─── Liquid glass border (rotating iridescent gradient) ───────────────────────
function LiquidBorder({ color, active }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current || !active) return
    let deg = 0
    const id = setInterval(() => {
      deg = (deg + 0.8) % 360
      ref.current.style.background =
        `conic-gradient(from ${deg}deg, ${color}00, ${color}99, ${color}ff, ${color}99, ${color}00)`
    }, 16)
    return () => clearInterval(id)
  }, [color, active])

  return (
    <div ref={ref} aria-hidden style={{
      position: 'absolute', inset: -1,
      borderRadius: 'inherit',
      padding: 1,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      pointerEvents: 'none',
      opacity: active ? 1 : 0,
      transition: 'opacity 0.4s',
    }} />
  )
}

// ─── Stack chip ───────────────────────────────────────────────────────────────
function StackChip({ label, color }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 11px', borderRadius: 6,
      border: `1px solid ${color}40`,
      color, fontSize: 10, fontWeight: 700,
      fontFamily: tokens.fontBody,
      letterSpacing: '0.06em',
      background: `${color}0e`,
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: color, boxShadow: `0 0 6px ${color}`,
        flexShrink: 0,
      }} />
      {label}
    </span>
  )
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 85,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10, padding: '10px 13px',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ color: tokens.textMuted, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5, fontFamily: tokens.fontBody }}>
        {label}
      </div>
      <div style={{ color, fontSize: 12, fontWeight: 800, fontFamily: tokens.fontHead, letterSpacing: '-0.01em' }}>
        {value}
      </div>
    </div>
  )
}

// ─── Main overlay ─────────────────────────────────────────────────────────────
export default function PlanetOverlay() {
  const activePlanetId = useUniverseStore(s => s.activePlanetId)
  const overlayOpen    = useUniverseStore(s => s.overlayOpen)
  const closeOverlay   = useUniverseStore(s => s.closeOverlay)

  const [iframeOpen, setIframeOpen]   = useState(false)
  const [mounted, setMounted]         = useState(false)
  const panelRef   = useRef(null)
  const contentRef = useRef(null)
  const visitBtn   = useMagnetic(0.4)
  const enterBtn   = useMagnetic(0.3)

  const data   = activePlanetId ? getPlanetById(activePlanetId) : null
  const planet = data?.planet
  const galaxy = data?.galaxy

  // GSAP stagger reveal on open (Veldara animation technique)
  useEffect(() => {
    if (!overlayOpen || !panelRef.current) return
    setMounted(true)
    setIframeOpen(false)

    const panel    = panelRef.current
    const children = contentRef.current?.children

    // Panel slide-in
    gsap.fromTo(panel,
      { x: '100%', opacity: 0 },
      { x: '0%',   opacity: 1, duration: 0.55, ease: 'power4.out' }
    )

    // Staggered content reveal — each block fades + slides up
    if (children) {
      gsap.fromTo(Array.from(children),
        { y: 22, opacity: 0, filter: 'blur(8px)' },
        { y: 0,  opacity: 1, filter: 'blur(0px)',
          duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.15 }
      )
    }
  }, [overlayOpen, activePlanetId])

  // GSAP slide-out on close
  const handleClose = () => {
    if (!panelRef.current) return
    gsap.to(panelRef.current, {
      x: '100%', opacity: 0, duration: 0.4, ease: 'power3.in',
      onComplete: () => { setMounted(false); closeOverlay() },
    })
  }

  useEffect(() => {
    if (!overlayOpen) setMounted(false)
  }, [overlayOpen])

  if (!planet || (!overlayOpen && !mounted)) return null

  const color = planet.color

  return (
    <>
      {/* ── Fullscreen iframe world (flagship only) ── */}
      {iframeOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: '#00010a',
          display: 'flex', flexDirection: 'column',
          animation: 'iframeIn 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '0 20px', height: 52,
            background: tokens.bg,
            backdropFilter: tokens.blur,
            borderBottom: `1px solid ${tokens.border}`,
            flexShrink: 0,
          }}>
            <button
              onClick={() => setIframeOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: '#fff', cursor: 'pointer',
                padding: '5px 13px', fontSize: 11, fontFamily: tokens.fontBody,
                letterSpacing: '0.04em', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.13)'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.07)'}
            >
              ← Exit World
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
              <span style={{ color, fontSize: 12, fontWeight: 700, fontFamily: tokens.fontBody }}>
                {planet.name}
              </span>
              <span style={{ color: tokens.textMuted, fontSize: 10, fontFamily: tokens.fontBody }}>
                {planet.url}
              </span>
            </div>
            <a
              href={planet.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: 'auto',
                padding: '6px 14px', borderRadius: 8,
                background: color, color: '#000',
                fontSize: 11, fontWeight: 800, fontFamily: tokens.fontBody,
                textDecoration: 'none', letterSpacing: '0.03em',
              }}
            >
              Open in Tab ↗
            </a>
          </div>
          <iframe
            src={planet.url}
            style={{ flex: 1, border: 'none', width: '100%' }}
            title={planet.name}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      )}

      {/* ── Side panel ── */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 'min(460px, 95vw)',
          zIndex: 200,
          background: tokens.bg,
          backdropFilter: tokens.blur,
          WebkitBackdropFilter: tokens.blur,
          borderLeft: `1px solid ${tokens.border}`,
          boxShadow: `-24px 0 80px rgba(0,0,0,0.7), inset 1px 0 0 rgba(255,255,255,0.06)`,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          transform: 'translateX(100%)',
          fontFamily: tokens.fontBody,
        }}
      >
        <LiquidBorder color={color} active={overlayOpen} />

        {/* Color accent stripe at top */}
        <div style={{
          height: 3, flexShrink: 0,
          background: `linear-gradient(90deg, transparent, ${color}, ${color}, transparent)`,
          opacity: 0.7,
        }} />

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            width: 32, height: 32,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 8, color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer', fontSize: 17,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        >
          ×
        </button>

        {/* Scrollable content */}
        <div
          ref={contentRef}
          style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}
        >
          {/* Breadcrumb */}
          <div style={{ color: tokens.textMuted, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', paddingTop: 4 }}>
            {galaxy?.icon} {galaxy?.name} › {planet.name}
          </div>

          {/* Header */}
          <div>
            {planet.flagship && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 20, marginBottom: 10,
                background: 'linear-gradient(90deg, rgba(255,215,0,0.12), rgba(255,153,0,0.08))',
                border: '1px solid rgba(255,215,0,0.35)',
                color: '#ffd700', fontSize: 9, fontWeight: 800, letterSpacing: '0.14em',
              }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#ffd700">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
                FLAGSHIP PROJECT
              </div>
            )}
            <h2 style={{
              fontFamily: tokens.fontHead,
              fontSize: 28, fontWeight: 800,
              color: '#fff', margin: 0,
              letterSpacing: '-0.03em', lineHeight: 1.05,
            }}>
              {planet.name}
            </h2>
            <div style={{ color, fontSize: 12, marginTop: 6, fontWeight: 600, letterSpacing: '0.02em' }}>
              {planet.category}
            </div>
            <div style={{ color: tokens.textMuted, fontSize: 10, marginTop: 3 }}>
              {planet.label}
            </div>
          </div>

          {/* Description */}
          <p style={{
            color: tokens.textSub, fontSize: 13, lineHeight: 1.75, margin: 0,
            fontFamily: tokens.fontBody,
          }}>
            {planet.description}
          </p>

          {/* Metrics */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {planet.metrics.map(m => (
              <MetricCard key={m.label} label={m.label} value={m.value} color={color} />
            ))}
          </div>

          {/* Stack chips */}
          <div>
            <div style={{ color: tokens.textMuted, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, fontFamily: tokens.fontBody }}>
              Stack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {planet.stack.map(s => <StackChip key={s} label={s} color={color} />)}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div style={{ color: tokens.textMuted, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, fontFamily: tokens.fontBody }}>
              Tags
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {planet.tags.map(tag => (
                <span key={tag} style={{
                  padding: '3px 9px', borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: 10, fontFamily: tokens.fontBody,
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${color}44, transparent)`,
          }} />

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {planet.flagship && planet.url !== '#' && (
              <button
                ref={enterBtn}
                onClick={() => setIframeOpen(true)}
                style={{
                  width: '100%', padding: '15px 0',
                  borderRadius: 12, cursor: 'pointer',
                  border: `1px solid ${color}66`,
                  background: `linear-gradient(135deg, ${color}1a, ${color}08)`,
                  color, fontSize: 13, fontWeight: 800,
                  fontFamily: tokens.fontHead, letterSpacing: '0.04em',
                  backdropFilter: 'blur(8px)',
                  boxShadow: `0 0 0 0 ${color}00`,
                  transition: 'box-shadow 0.3s, background 0.3s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 0 28px ${color}44, 0 0 60px ${color}22`
                  e.currentTarget.style.background = `linear-gradient(135deg, ${color}28, ${color}12)`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = `0 0 0 0 ${color}00`
                  e.currentTarget.style.background = `linear-gradient(135deg, ${color}1a, ${color}08)`
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: 7 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
                Enter Project World
              </button>
            )}

            {planet.url !== '#' && (
              <a
                ref={visitBtn}
                href={planet.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', width: '100%', padding: '13px 0',
                  borderRadius: 12, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 12, fontWeight: 600,
                  fontFamily: tokens.fontBody, letterSpacing: '0.05em',
                  textDecoration: 'none', textAlign: 'center',
                  backdropFilter: 'blur(8px)',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
              >
                Visit Live Site ↗
              </a>
            )}

            {planet.url === '#' && (
              <div style={{
                padding: '13px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.2)', fontSize: 12,
                textAlign: 'center', fontFamily: tokens.fontBody,
                background: 'rgba(255,255,255,0.01)',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: 6, opacity: 0.4 }}>
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
                </svg>
                Coming Soon
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes iframeIn {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  )
}
