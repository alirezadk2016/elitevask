'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

import Starfield   from './Starfield'
import GalaxyNode  from './GalaxyNode'
import PlanetNode  from './PlanetNode'
import CameraRig   from './CameraRig'
import { useUniverseStore } from '../state/universeStore'
import { galaxies, getGalaxyById } from '../data/universe'

// Nebula background — full-screen plane behind everything, color shifts per galaxy
const nebulaVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const nebulaFrag = `
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uTime;
  varying vec2  vUv;

  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * (sin(p.x * 1.3 + uTime * 0.06) * sin(p.y * 0.9 + uTime * 0.04) * 0.5 + 0.5);
      p  *= 2.1; a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2  uv = vUv * 2.0 - 1.0;
    float n  = fbm(uv * 1.5 + uTime * 0.02);
    vec3  col = mix(uColorA, uColorB, n) * n * 0.18;
    float vignette = 1.0 - length(uv) * 0.55;
    gl_FragColor = vec4(col * vignette, 1.0);
  }
`

function Nebula({ activeColor }) {
  const matRef = useRef()
  const targetA = useRef(new THREE.Color('#030612'))
  const targetB = useRef(new THREE.Color('#0a0520'))

  const uniforms = useRef({
    uColorA: { value: new THREE.Color('#030612') },
    uColorB: { value: new THREE.Color('#0a0520') },
    uTime:   { value: 0 },
  })

  useEffect(() => {
    if (activeColor) {
      targetA.current.set(activeColor).multiplyScalar(0.08)
      targetB.current.set(activeColor).multiplyScalar(0.03)
    } else {
      targetA.current.set('#030612')
      targetB.current.set('#0a0520')
    }
  }, [activeColor])

  useFrame((_, delta) => {
    uniforms.current.uTime.value += delta
    uniforms.current.uColorA.value.lerp(targetA.current, delta * 0.6)
    uniforms.current.uColorB.value.lerp(targetB.current, delta * 0.6)
  })

  return (
    <mesh position={[0, 0, -95]} scale={[280, 200, 1]}>
      <planeGeometry />
      <shaderMaterial
        ref={matRef}
        vertexShader={nebulaVert}
        fragmentShader={nebulaFrag}
        uniforms={uniforms.current}
        depthWrite={false}
      />
    </mesh>
  )
}

function ActiveGalaxyPlanets() {
  const activeGalaxyId = useUniverseStore(s => s.activeGalaxyId)
  const level          = useUniverseStore(s => s.level)

  if (level === 'universe' || !activeGalaxyId) return null
  const galaxy = getGalaxyById(activeGalaxyId)
  if (!galaxy) return null

  return (
    <>
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial
          color={new THREE.Color(galaxy.color)}
          emissive={new THREE.Color(galaxy.color)}
          emissiveIntensity={2.5}
          roughness={0}
        />
      </mesh>
      {/* Corona rings around galaxy sun */}
      {[2.2, 3.4].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, 0, 0]}>
          <ringGeometry args={[r - 0.015, r + 0.015, 80]} />
          <meshBasicMaterial
            color={galaxy.color}
            transparent opacity={0.2 - i * 0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      <pointLight color={galaxy.color} intensity={5} distance={35} />
      {galaxy.planets.map(planet => (
        <PlanetNode key={planet.id} planet={planet} galaxyId={activeGalaxyId} />
      ))}
    </>
  )
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 20, 10]} intensity={0.5} color="#a0c4ff" />
      <pointLight position={[-22, 12, -15]} intensity={0.7} color="#7b2d8b" distance={70} />
      <pointLight position={[22, -10, -20]} intensity={0.5} color="#00b4d8" distance={70} />
    </>
  )
}

export default function Universe() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const activeGalaxyId = useUniverseStore(s => s.activeGalaxyId)
  const galaxy = activeGalaxyId ? getGalaxyById(activeGalaxyId) : null

  const handleMouseMove = (e) => {
    setMouse({
      x:  (e.clientX / window.innerWidth  - 0.5),
      y: -(e.clientY / window.innerHeight - 0.5),
    })
  }

  return (
    <div
      style={{ width: '100vw', height: '100vh', background: '#00010a', cursor: 'none' }}
      onMouseMove={handleMouseMove}
    >
      {/* Custom cursor dot */}
      <div style={{
        position: 'fixed',
        left: `${(mouse.x + 0.5) * 100}vw`,
        top:  `${(-mouse.y + 0.5) * 100}vh`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', zIndex: 9999,
        transition: 'left 0.05s linear, top 0.05s linear',
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#00d4ff',
          boxShadow: '0 0 0 2px rgba(0,212,255,0.2), 0 0 18px 4px rgba(0,212,255,0.6)',
        }} />
      </div>

      <Canvas
        camera={{ fov: 60, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <fog attach="fog" args={['#00010a', 90, 220]} />
        <SceneLights />

        <Suspense fallback={null}>
          <Nebula activeColor={galaxy?.glowColor} />
          <Starfield />

          {galaxies.map(g => (
            <GalaxyNode key={g.id} galaxy={g} />
          ))}

          <ActiveGalaxyPlanets />
          <CameraRig mouseX={mouse.x} mouseY={mouse.y} />

          <EffectComposer>
            <Bloom
              intensity={1.6}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.85}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0006, 0.0006]}
            />
            <Vignette eskil={false} offset={0.18} darkness={0.75} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
