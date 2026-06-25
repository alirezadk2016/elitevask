'use client'

import dynamic from 'next/dynamic'
import PlanetOverlay from './components/PlanetOverlay'
import HUD from './components/HUD'

const Universe = dynamic(() => import('./scenes/Universe'), { ssr: false })

export default function MakPage() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#00010a' }}>
      <Universe />
      <HUD />
      <PlanetOverlay />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; overflow: hidden; }
      `}</style>
    </main>
  )
}
