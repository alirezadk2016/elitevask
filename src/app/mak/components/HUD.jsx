'use client'

import { useUniverseStore } from '../state/universeStore'
import { getGalaxyById } from '../data/universe'

const glassNav = {
  background: 'rgba(8,12,24,0.65)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
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
    { label: '🌌 Universe', level: 'universe', active: level === 'universe' },
    ...(galaxy ? [{ label: `${galaxy.icon} ${galaxy.name}`, level: 'galaxy', active: level === 'galaxy' }] : []),
    ...(planet ? [{ label: `${planet.icon} ${planet.name}`, level: 'planet', active: level === 'planet' }] : []),
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {crumbs.map((c, i) => (
        <span key={c.level} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>›</span>}
          <button
            onClick={c.active ? undefined : goBack}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: c.active ? 'default' : 'pointer',
              color: c.active ? '#fff' : 'rgba(255,255,255,0.4)',
              fontSize: 11, fontWeight: c.active ? 600 : 400,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.04em',
              transition: 'color 0.2s',
            }}
          >
            {c.label}
          </button>
        </span>
      ))}
    </div>
  )
}

function LevelDots() {
  const level = useUniverseStore(s => s.level)
  const levels = [
    { id: 'universe', label: 'Universe' },
    { id: 'galaxy',   label: 'Galaxy' },
    { id: 'planet',   label: 'Planet' },
    // PHASE 2: { id: 'surface', label: 'Surface' }
  ]
  const activeIdx = levels.findIndex(l => l.id === level)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      ...glassNav, borderRadius: 24, padding: '12px 8px',
    }}>
      {levels.map((l, i) => (
        <div key={l.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{
            width: i === activeIdx ? 10 : 6,
            height: i === activeIdx ? 10 : 6,
            borderRadius: '50%',
            background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.2)',
            boxShadow: i === activeIdx ? '0 0 12px #fff8' : 'none',
            transition: 'all 0.3s',
          }} />
          {i < levels.length - 1 && (
            <div style={{
              width: 1, height: 16,
              background: i < activeIdx ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

function HologramAssistant() {
  const text = useUniverseStore(s => s.hologramText)

  return (
    <div style={{
      ...glassNav,
      borderRadius: 14,
      padding: '12px 16px',
      maxWidth: 280,
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      {/* Avatar pulse */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #00b4d8, #7b2d8b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
        }}>
          🤖
        </div>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 8, height: 8, borderRadius: '50%',
          background: '#00ff88',
          boxShadow: '0 0 6px #00ff88',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      </div>
      <div>
        <div style={{
          color: '#00b4d8', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif', marginBottom: 4,
        }}>
          Nova AI
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.7)', fontSize: 11,
          fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
        }}>
          {text}
        </div>
      </div>
    </div>
  )
}

export default function HUD() {
  const level  = useUniverseStore(s => s.level)
  const goBack = useUniverseStore(s => s.goBack)

  return (
    <>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100, padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        ...glassNav, borderRadius: 0,
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: 15, fontStyle: 'italic', fontWeight: 700,
          color: '#fff', letterSpacing: '0.04em',
        }}>
          Alireza Makvandi
        </div>

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Back button (hidden at universe level) */}
        {level !== 'universe' && (
          <button
            onClick={goBack}
            style={{
              ...glassNav,
              borderRadius: 8, padding: '6px 14px',
              color: 'rgba(255,255,255,0.7)', fontSize: 11,
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.06)',
              letterSpacing: '0.05em',
            }}
          >
            ← Back
          </button>
        )}
      </div>

      {/* Right-click hint (universe only) */}
      {level !== 'universe' && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          color: 'rgba(255,255,255,0.25)',
          fontSize: 10, fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Right-click to go back
        </div>
      )}

      {/* Bottom-left: Nova AI */}
      <div style={{
        position: 'fixed', bottom: 24, left: 20,
        zIndex: 100,
      }}>
        <HologramAssistant />
      </div>

      {/* Bottom-right: Level dots */}
      <div style={{
        position: 'fixed', bottom: 24, right: 20,
        zIndex: 100,
      }}>
        <LevelDots />
      </div>
    </>
  )
}
