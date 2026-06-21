'use client'

import { useEffect, useState, useRef } from 'react'
import { useUniverseStore } from '../state/universeStore'
import { galaxies, getPlanetById } from '../data/universe'

const glass = {
  background: 'rgba(8, 12, 24, 0.72)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
}

function Tag({ label, color }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      border: `1px solid ${color}55`,
      color: color,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.06em',
      background: `${color}11`,
      margin: '0 4px 4px 0',
    }}>
      {label}
    </span>
  )
}

function Metric({ label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10,
      padding: '10px 14px',
      flex: 1,
      minWidth: 90,
    }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color, fontSize: 13, fontWeight: 700 }}>{value}</div>
    </div>
  )
}

export default function PlanetOverlay() {
  const activePlanetId = useUniverseStore(s => s.activePlanetId)
  const overlayOpen    = useUniverseStore(s => s.overlayOpen)
  const closeOverlay   = useUniverseStore(s => s.closeOverlay)
  const level          = useUniverseStore(s => s.level)

  const [iframeOpen, setIframeOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  const data = activePlanetId ? getPlanetById(activePlanetId) : null
  const planet = data?.planet
  const galaxy = data?.galaxy

  // Animate in
  useEffect(() => {
    if (overlayOpen) {
      setIframeOpen(false)
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [overlayOpen, activePlanetId])

  if (!planet || !overlayOpen) return null

  const color = planet.color

  return (
    <>
      {/* Full-screen iframe for flagship planet */}
      {iframeOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: '#000',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* iframe toolbar */}
          <div style={{
            ...glass,
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <button
              onClick={() => setIframeOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none',
                borderRadius: 8, color: '#fff', cursor: 'pointer',
                padding: '6px 14px', fontSize: 12, fontFamily: 'Inter, sans-serif',
              }}
            >
              ← Back
            </button>
            <span style={{ color: color, fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {planet.icon} {planet.name}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
              {planet.url}
            </span>
            <a
              href={planet.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: 'auto',
                background: color, border: 'none', borderRadius: 8,
                color: '#000', cursor: 'pointer', padding: '6px 14px',
                fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
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

      {/* Side panel */}
      <div
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 'min(460px, 96vw)',
          zIndex: 200,
          ...glass,
          borderRadius: '0 0 0 0',
          borderRight: 'none',
          padding: '28px 28px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          overflowY: 'auto',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Close */}
        <button
          onClick={closeOverlay}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: '#fff', cursor: 'pointer',
            width: 32, height: 32, fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>

        {/* Galaxy breadcrumb */}
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {galaxy?.icon} {galaxy?.name}
        </div>

        {/* Planet header */}
        <div>
          <div style={{ fontSize: 36, marginBottom: 6 }}>{planet.icon}</div>
          <h2 style={{
            fontSize: 26, fontWeight: 800, color: '#fff',
            margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            {planet.name}
          </h2>
          <div style={{ color, fontSize: 13, marginTop: 5, fontWeight: 500 }}>
            {planet.category}
          </div>
          {planet.flagship && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'linear-gradient(90deg, #ffd70022, #ff990022)',
              border: '1px solid #ffd70066',
              borderRadius: 20, padding: '3px 10px', marginTop: 8,
              color: '#ffd700', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            }}>
              ★ FLAGSHIP PROJECT
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{
          color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.7, margin: 0,
        }}>
          {planet.description}
        </p>

        {/* Metrics grid */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {planet.metrics.map(m => (
            <Metric key={m.label} label={m.label} value={m.value} color={color} />
          ))}
        </div>

        {/* Stack */}
        <div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Stack & Skills
          </div>
          <div>
            {planet.stack.map(s => (
              <Tag key={s} label={s} color={color} />
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Tags
          </div>
          <div>
            {planet.tags.map(t => (
              <Tag key={t} label={t} color="rgba(255,255,255,0.5)" />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Flagship: Enter Project World */}
          {planet.flagship && planet.url !== '#' && (
            <button
              onClick={() => setIframeOpen(true)}
              style={{
                padding: '14px 0',
                borderRadius: 12,
                border: `1px solid ${color}88`,
                background: `linear-gradient(135deg, ${color}22, ${color}08)`,
                color,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background = `${color}33`; e.target.style.boxShadow = `0 0 24px ${color}44` }}
              onMouseLeave={e => { e.target.style.background = `linear-gradient(135deg, ${color}22, ${color}08)`; e.target.style.boxShadow = '' }}
            >
              🌐 Enter Project World
            </button>
          )}

          {/* Visit live site */}
          {planet.url !== '#' && (
            <a
              href={planet.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '13px 0',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            >
              Visit Live Site ↗
            </a>
          )}

          {planet.url === '#' && (
            <div style={{
              padding: '13px 0',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.25)',
              fontSize: 12,
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
            }}>
              🔒 Coming Soon
            </div>
          )}
        </div>

        {/* Gradient accent bar at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0.6,
        }} />
      </div>
    </>
  )
}
