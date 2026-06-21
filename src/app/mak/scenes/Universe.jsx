'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

import Starfield from './Starfield'
import GalaxyNode from './GalaxyNode'
import PlanetNode from './PlanetNode'
import CameraRig from './CameraRig'
import { useUniverseStore } from '../state/universeStore'
import { galaxies, getGalaxyById } from '../data/universe'

function ActiveGalaxyPlanets() {
  const activeGalaxyId = useUniverseStore(s => s.activeGalaxyId)
  const level          = useUniverseStore(s => s.level)

  if (level === 'universe' || !activeGalaxyId) return null

  const galaxy = getGalaxyById(activeGalaxyId)
  if (!galaxy) return null

  return (
    <>
      {/* Galaxy sun */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={new THREE.Color(galaxy.color)}
          emissive={new THREE.Color(galaxy.color)}
          emissiveIntensity={2}
          roughness={0}
        />
      </mesh>
      <pointLight color={galaxy.color} intensity={4} distance={30} />

      {galaxy.planets.map(planet => (
        <PlanetNode key={planet.id} planet={planet} galaxyId={activeGalaxyId} />
      ))}
    </>
  )
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[10, 20, 10]} intensity={0.6} color="#b0d4ff" />
      <pointLight position={[-20, 10, -15]} intensity={0.8} color="#7b2d8b" distance={60} />
      <pointLight position={[20, -10, -20]} intensity={0.6} color="#00b4d8" distance={60} />
    </>
  )
}

export default function Universe() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    setMouse({
      x: (e.clientX / window.innerWidth  - 0.5),
      y: -(e.clientY / window.innerHeight - 0.5),
    })
  }

  return (
    <div
      style={{ width: '100vw', height: '100vh', background: '#00010a', cursor: 'none' }}
      onMouseMove={handleMouseMove}
    >
      {/* Custom cursor */}
      <div
        style={{
          position: 'fixed',
          left: `${(mouse.x + 0.5) * 100}vw`,
          top:  `${(-mouse.y + 0.5) * 100}vh`,
          transform: 'translate(-50%, -50%)',
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#00d4ff',
          boxShadow: '0 0 16px 4px #00d4ff88',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'left 0.06s, top 0.06s',
        }}
      />

      <Canvas
        camera={{ fov: 60, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <fog attach="fog" args={['#00010a', 80, 200]} />
        <SceneLights />

        <Suspense fallback={null}>
          <Starfield />

          {/* Galaxy cores — visible at universe level */}
          {galaxies.map(g => (
            <GalaxyNode key={g.id} galaxy={g} />
          ))}

          {/* Active galaxy's planets — visible at galaxy/planet level */}
          <ActiveGalaxyPlanets />

          <CameraRig mouseX={mouse.x} mouseY={mouse.y} />

          <EffectComposer>
            <Bloom
              intensity={1.4}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.2} darkness={0.7} />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0008, 0.0008]}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
