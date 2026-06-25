'use client'

import { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { planets } from './projects'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// ─── Galaxy Disc ──────────────────────────────────────────────────────────────
function GalaxyDisc() {
  const ref = useRef()
  const { positions, colors } = useMemo(() => {
    const count = 12000
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const arms = 3
    for (let i = 0; i < count; i++) {
      const arm = i % arms
      const r = 8 + Math.pow(Math.random(), 0.5) * 55
      const spin = r * 0.18
      const angle = (arm / arms) * Math.PI * 2 + spin + (Math.random() - 0.5) * 0.8
      const spread = (1 - r / 63) * 1.5
      pos[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.4
      pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * spread - 35

      const t = Math.random()
      const isBright = Math.random() > 0.7
      if (isBright) {
        col[i * 3] = 0.9; col[i * 3 + 1] = 0.95; col[i * 3 + 2] = 1.0
      } else if (t < 0.33) {
        col[i * 3] = 0.5 + t; col[i * 3 + 1] = 0.3; col[i * 3 + 2] = 0.9
      } else if (t < 0.66) {
        col[i * 3] = 0.2; col[i * 3 + 1] = 0.5 + t * 0.5; col[i * 3 + 2] = 1.0
      } else {
        col[i * 3] = 1.0; col[i * 3 + 1] = 0.6; col[i * 3 + 2] = 0.3
      }
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.18} sizeAttenuation vertexColors transparent opacity={0.9} />
    </points>
  )
}

// ─── Deep Space Stars ─────────────────────────────────────────────────────────
function DeepStars() {
  const ref = useRef()
  const { positions, colors } = useMemo(() => {
    const count = 6000
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 60 + Math.random() * 80
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      const t = Math.random()
      col[i * 3] = 0.7 + t * 0.3
      col[i * 3 + 1] = 0.8 + t * 0.15
      col[i * 3 + 2] = 1.0
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.006
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.28} sizeAttenuation vertexColors transparent opacity={0.85} />
    </points>
  )
}

// ─── Shooting Star ────────────────────────────────────────────────────────────
function ShootingStar() {
  const ref = useRef()
  const trailRef = useRef()
  const state = useRef({ active: false, timer: Math.random() * 8 + 4, progress: 0 })
  const startPos = useRef(new THREE.Vector3())
  const endPos = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    state.current.timer -= delta
    if (state.current.timer <= 0 && !state.current.active) {
      state.current.active = true
      state.current.progress = 0
      state.current.timer = Math.random() * 12 + 8
      startPos.current.set(
        (Math.random() - 0.5) * 60,
        Math.random() * 20 + 5,
        -Math.random() * 30 - 10
      )
      endPos.current.set(
        startPos.current.x + (Math.random() - 0.5) * 30,
        startPos.current.y - Math.random() * 15 - 5,
        startPos.current.z + Math.random() * 10
      )
    }
    if (state.current.active && ref.current) {
      state.current.progress += delta * 1.8
      const t = Math.min(state.current.progress, 1)
      ref.current.position.lerpVectors(startPos.current, endPos.current, easeInOutCubic(t))
      ref.current.visible = true
      if (t >= 1) { state.current.active = false; ref.current.visible = false }
    }
  })

  return (
    <group ref={ref} visible={false}>
      <mesh>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.03, 1.2, 4]} />
        <meshBasicMaterial color="#aaddff" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

// ─── Nebula Cloud ─────────────────────────────────────────────────────────────
function NebulaCloud({ color, position, scale }) {
  const ref = useRef()
  const { positions, sizes } = useMemo(() => {
    const count = 300
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * scale * 2
      pos[i * 3 + 1] = (Math.random() - 0.5) * scale
      pos[i * 3 + 2] = (Math.random() - 0.5) * scale * 2
      sz[i] = Math.random() * 2 + 0.5
    }
    return { positions: pos, sizes: sz }
  }, [scale])

  useFrame((s) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.0008
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.15) * 0.05
  })

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={1.2}
        sizeAttenuation
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </points>
  )
}

// ─── Planet Atmosphere Glow ───────────────────────────────────────────────────
function PlanetAtmosphere({ color, size }) {
  const layers = [1.25, 1.45, 1.7]
  return (
    <>
      {layers.map((s, i) => (
        <mesh key={i} scale={[s * size, s * size, s * size]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.06 - i * 0.015}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  )
}

// ─── Planet ───────────────────────────────────────────────────────────────────
function Planet({ data, onHover, onClick, cameraPhase }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const lightRef = useRef()
  const [hovered, setHovered] = useState(false)
  const hasRing = data.id === 2 || data.id === 5
  const hasAtmosphere = data.id !== 6

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const x = Math.sin(t * data.orbitSpeed) * data.orbitRadius
    const y = Math.sin(t * 0.25 + data.id * 1.2) * 2.5
    const z = Math.cos(t * data.orbitSpeed) * data.orbitRadius * 0.45 - 22

    groupRef.current.position.set(x, y, z)

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004 + data.id * 0.001
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.05

      const targetEI = hovered ? 2.0 : 0.4
      meshRef.current.material.emissiveIntensity += (targetEI - meshRef.current.material.emissiveIntensity) * 0.08
      const targetS = hovered ? 1.18 : 1.0
      const cs = meshRef.current.scale.x
      const ns = cs + (targetS - cs) * 0.08
      meshRef.current.scale.setScalar(ns)
    }

    if (lightRef.current) {
      const targetI = hovered ? 4 : 0.5
      lightRef.current.intensity += (targetI - lightRef.current.intensity) * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {/* Orbit trail */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[data.size * 1.8, 0.015, 8, 80]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.1} />
      </mesh>

      {/* Atmosphere glow */}
      {hasAtmosphere && <PlanetAtmosphere color={data.color} size={data.size} />}

      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        scale={[data.size, data.size, data.size]}
        onPointerEnter={() => { setHovered(true); onHover(data); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto' }}
        onClick={() => { if (cameraPhase === 1) onClick(data) }}
      >
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.emissive}
          emissiveIntensity={0.4}
          roughness={data.id === 6 ? 0.1 : 0.65}
          metalness={data.id === 6 ? 0.9 : 0.25}
        />
      </mesh>

      {/* Saturn ring */}
      {hasRing && (
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[data.size * 1.6, data.size * 0.35, 2, 80]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Point light */}
      <pointLight ref={lightRef} color={data.color} intensity={0.5} distance={12} />

      {/* Hover label */}
      {hovered && (
        <Html position={[0, data.size * 2.2, 0]} center>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.92), rgba(10,5,20,0.92))',
            border: `1px solid ${data.color}`,
            borderRadius: 10,
            padding: '12px 18px',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: 13,
            whiteSpace: 'nowrap',
            boxShadow: `0 0 30px ${data.color}66, 0 0 60px ${data.color}22`,
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ color: data.color, fontWeight: 'bold', marginBottom: 5, fontSize: 14, letterSpacing: 1 }}>
              {data.icon} {data.name}
            </div>
            <div style={{ color: '#888', fontSize: 10, marginBottom: 8, letterSpacing: 2 }}>{data.category.toUpperCase()}</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {data.tech.map(t => (
                <span key={t} style={{
                  background: `${data.color}20`,
                  border: `1px solid ${data.color}60`,
                  color: data.color,
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                }}>{t}</span>
              ))}
            </div>
            <div style={{ color: '#ffffff33', fontSize: 9, marginTop: 8, letterSpacing: 2 }}>CLICK TO EXPLORE</div>
          </div>
        </Html>
      )}
    </group>
  )
}

// ─── Gaming Room ──────────────────────────────────────────────────────────────
function GamingRoom() {
  const rgbRefs = useRef([])
  const pulseRef = useRef(0)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    pulseRef.current = t
    const rgbColors = ['#ff0055', '#0055ff', '#00ffaa', '#aa00ff']
    rgbRefs.current.forEach((light, i) => {
      if (!light) return
      const c = new THREE.Color(rgbColors[i])
      const n = new THREE.Color(rgbColors[(i + 1) % 4])
      light.color.lerpColors(c, n, (Math.sin(t * 0.4 + i * 1.6) + 1) * 0.5)
      light.intensity = 2.5 + Math.sin(t * 1.5 + i) * 1.0
    })
  })

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#050510" roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Floor grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.19, 0]}>
        <planeGeometry args={[16, 12, 16, 12]} />
        <meshBasicMaterial color="#1a1a4a" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Floor RGB strips */}
      {[-3, -1, 1, 3].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -2.185, 0]}>
          <planeGeometry args={[0.05, 10]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#00b4d8' : '#8338ec'}
            transparent opacity={0.6}
          />
        </mesh>
      ))}

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#030308" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0.65, -5.2]}>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#050510" />
      </mesh>

      {/* Window frame */}
      {[
        { pos: [0, 3.3, -5.1], geo: [8.4, 0.15, 0.12] },
        { pos: [0, -0.9, -5.1], geo: [8.4, 0.15, 0.12] },
        { pos: [-4.2, 1.2, -5.1], geo: [0.15, 4.4, 0.12] },
        { pos: [4.2, 1.2, -5.1], geo: [0.15, 4.4, 0.12] },
      ].map((f, i) => (
        <mesh key={i} position={f.pos}>
          <boxGeometry args={f.geo} />
          <meshStandardMaterial color="#1a1a3a" metalness={0.9} roughness={0.1} emissive="#2a2a6a" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Window glass */}
      <mesh position={[0, 1.2, -5.15]}>
        <planeGeometry args={[8.2, 4.2]} />
        <meshStandardMaterial color="#000820" transparent opacity={0.08} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-8, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 7]} />
        <meshStandardMaterial color="#040410" />
      </mesh>
      <mesh position={[8, 0.65, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12, 7]} />
        <meshStandardMaterial color="#040410" />
      </mesh>

      {/* Desk */}
      <mesh position={[0, -0.85, -3.6]}>
        <boxGeometry args={[4, 0.07, 1.3]} />
        <meshStandardMaterial color="#0e0e22" metalness={0.6} roughness={0.4} />
      </mesh>
      {[[-1.8, -0.5], [1.8, -0.5], [-1.8, 0.5], [1.8, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, -1.55, -3.6 + z]}>
          <boxGeometry args={[0.07, 1.4, 0.07]} />
          <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Center monitor (main - bigger) */}
      <mesh position={[0, 0.08, -4.1]}>
        <boxGeometry args={[1.8, 1.1, 0.06]} />
        <meshStandardMaterial color="#080818" emissive="#000830" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, 0.08, -4.07]}>
        <planeGeometry args={[1.7, 1.02]} />
        <meshStandardMaterial color="#000318" emissive="#001525" emissiveIntensity={2} />
      </mesh>
      <Html position={[0, 0.08, -4.04]} center transform>
        <div style={{ textAlign: 'center', pointerEvents: 'none', width: 200 }}>
          <div style={{ color: '#00d4ff', fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold', letterSpacing: 3, textShadow: '0 0 15px #00d4ff, 0 0 30px #00d4ff44' }}>
            EXPLORE MY UNIVERSE
          </div>
          <div style={{ width: 160, height: 1, background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)', margin: '6px auto' }} />
          <div style={{ color: '#4488aa', fontFamily: 'monospace', fontSize: 8, letterSpacing: 2 }}>
            GALAXY PORTFOLIO
          </div>
        </div>
      </Html>
      <mesh position={[0, -0.51, -4.0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Left monitor */}
      <mesh position={[-1.5, -0.05, -4.0]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[1.2, 0.78, 0.055]} />
        <meshStandardMaterial color="#080818" emissive="#080010" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-1.5, -0.05, -3.97]} rotation={[0, 0.18, 0]}>
        <planeGeometry args={[1.12, 0.72]} />
        <meshStandardMaterial color="#080010" emissive="#1a0030" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-1.5, -0.5, -3.88]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Right monitor */}
      <mesh position={[1.5, -0.05, -4.0]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[1.2, 0.78, 0.055]} />
        <meshStandardMaterial color="#080818" emissive="#100800" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[1.5, -0.05, -3.97]} rotation={[0, -0.18, 0]}>
        <planeGeometry args={[1.12, 0.72]} />
        <meshStandardMaterial color="#100800" emissive="#200800" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[1.5, -0.5, -3.88]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, -0.8, -3.2]}>
        <boxGeometry args={[1.1, 0.04, 0.38]} />
        <meshStandardMaterial color="#0a0a18" roughness={0.9} emissive="#0a0a18" emissiveIntensity={0.5} />
      </mesh>
      {/* Keyboard RGB glow */}
      <pointLight position={[0, -0.75, -3.2]} color="#8338ec" intensity={0.6} distance={1.5} />

      {/* Mouse */}
      <mesh position={[0.78, -0.8, -3.2]}>
        <boxGeometry args={[0.14, 0.04, 0.24]} />
        <meshStandardMaterial color="#0a0a18" roughness={0.9} />
      </mesh>

      {/* Chair back */}
      <mesh position={[0, -0.15, -1.85]}>
        <boxGeometry args={[0.75, 1.3, 0.1]} />
        <meshStandardMaterial color="#08081e" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Chair wings */}
      <mesh position={[-0.42, 0.1, -1.88]}>
        <boxGeometry args={[0.12, 0.8, 0.1]} />
        <meshStandardMaterial color="#06061a" />
      </mesh>
      <mesh position={[0.42, 0.1, -1.88]}>
        <boxGeometry args={[0.12, 0.8, 0.1]} />
        <meshStandardMaterial color="#06061a" />
      </mesh>
      {/* Chair RGB strip */}
      <mesh position={[0, -0.15, -1.8]}>
        <boxGeometry args={[0.72, 1.25, 0.02]} />
        <meshBasicMaterial color="#00b4d8" transparent opacity={0.08} />
      </mesh>
      {/* Chair seat */}
      <mesh position={[0, -0.92, -2.22]}>
        <boxGeometry args={[0.75, 0.1, 0.68]} />
        <meshStandardMaterial color="#08081e" />
      </mesh>
      <mesh position={[-0.44, -0.72, -2.22]}>
        <boxGeometry args={[0.1, 0.18, 0.56]} />
        <meshStandardMaterial color="#060618" />
      </mesh>
      <mesh position={[0.44, -0.72, -2.22]}>
        <boxGeometry args={[0.1, 0.18, 0.56]} />
        <meshStandardMaterial color="#060618" />
      </mesh>
      <mesh position={[0, -1.12, -2.22]}>
        <cylinderGeometry args={[0.055, 0.055, 0.32, 8]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.3, -2.22]}>
        <cylinderGeometry args={[0.52, 0.52, 0.06, 16]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Decorative shelves */}
      <mesh position={[-6.5, 1.2, -2]}>
        <boxGeometry args={[0.08, 1.8, 0.4]} />
        <meshStandardMaterial color="#0a0a1a" />
      </mesh>
      {[0.5, 0.1, -0.3].map((y, i) => (
        <mesh key={i} position={[-6.46, y, -2]}>
          <boxGeometry args={[0.06, 0.06, 0.38]} />
          <meshStandardMaterial color={['#00b4d8', '#8338ec', '#e63946'][i]} emissive={['#00b4d8', '#8338ec', '#e63946'][i]} emissiveIntensity={1} />
        </mesh>
      ))}

      {/* RGB ambient lights */}
      {[
        { pos: [-7, 1.5, -3], color: '#ff0055' },
        { pos: [7, 1.5, -3], color: '#0055ff' },
        { pos: [-7, 1.5, 1], color: '#00ffaa' },
        { pos: [7, 1.5, 1], color: '#aa00ff' },
      ].map(({ pos, color }, i) => (
        <pointLight
          key={i}
          ref={el => { rgbRefs.current[i] = el }}
          position={pos}
          color={color}
          intensity={2.5}
          distance={12}
        />
      ))}

      {/* Monitor glow lights */}
      <pointLight position={[0, 0.8, -3.8]} color="#00d4ff" intensity={2} distance={5} />
      <pointLight position={[-1.5, 0.5, -3.6]} color="#aa00ff" intensity={1.2} distance={3} />
      <pointLight position={[1.5, 0.5, -3.6]} color="#ff4400" intensity={1.2} distance={3} />

      {/* Ceiling lights */}
      <pointLight position={[0, 3.2, -2]} color="#ffffff" intensity={0.4} distance={8} />
      <pointLight position={[-4, 3.2, -1]} color="#8338ec" intensity={0.6} distance={6} />
      <pointLight position={[4, 3.2, -1]} color="#00b4d8" intensity={0.6} distance={6} />
    </group>
  )
}

// ─── Gamer Boy ────────────────────────────────────────────────────────────────
function GamerBoy() {
  const groupRef = useRef()
  const headRef = useRef()
  const armLRef = useRef()
  const armRRef = useRef()
  const hpLeftRef = useRef()
  const hpRightRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) groupRef.current.position.y = -1.5 + Math.sin(t * 0.55) * 0.022
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.3) * 0.1 + Math.sin(t * 0.7) * 0.05
      headRef.current.rotation.x = -0.06 + Math.sin(t * 0.25) * 0.04
    }
    if (armLRef.current) armLRef.current.rotation.z = 0.48 + Math.sin(t * 5.5) * 0.035
    if (armRRef.current) armRRef.current.rotation.z = -0.48 + Math.sin(t * 5.5 + 0.5) * 0.035

    // RGB headphone pulse
    const hpI = 0.5 + Math.sin(t * 3) * 0.3
    if (hpLeftRef.current) hpLeftRef.current.material.emissiveIntensity = hpI
    if (hpRightRef.current) hpRightRef.current.material.emissiveIntensity = hpI
  })

  return (
    <group ref={groupRef} position={[0, -1.5, -2.05]}>
      <pointLight position={[0, 0.5, 0.6]} color="#00b4d8" intensity={1.2} distance={3} />

      {/* Torso */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.56, 0.68, 0.3]} />
        <meshStandardMaterial color="#6a1fd0" emissive="#3a0a80" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.56, 0.16]}>
        <boxGeometry args={[0.3, 0.09, 0.02]} />
        <meshStandardMaterial color="#8338ec" emissive="#8338ec" emissiveIntensity={0.5} />
      </mesh>
      {/* Side stripes */}
      <mesh position={[-0.22, 0.3, 0.16]}>
        <boxGeometry args={[0.04, 0.65, 0.02]} />
        <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.22, 0.3, 0.16]}>
        <boxGeometry args={[0.04, 0.65, 0.02]} />
        <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={0.8} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.83, 0]}>
        <mesh>
          <boxGeometry args={[0.43, 0.43, 0.39]} />
          <meshStandardMaterial color="#e8956d" />
        </mesh>
        {/* Hair top */}
        <mesh position={[0, 0.23, 0]}>
          <boxGeometry args={[0.45, 0.13, 0.41]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Hair front spike */}
        <mesh position={[0, 0.3, 0.2]}>
          <boxGeometry args={[0.38, 0.12, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.1, 0.34, 0.22]}>
          <boxGeometry args={[0.1, 0.08, 0.06]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.1, 0.04, 0.21]}>
          <boxGeometry args={[0.09, 0.065, 0.02]} />
          <meshStandardMaterial color="#0d0d1e" />
        </mesh>
        <mesh position={[0.1, 0.04, 0.21]}>
          <boxGeometry args={[0.09, 0.065, 0.02]} />
          <meshStandardMaterial color="#0d0d1e" />
        </mesh>
        {/* Eye glow pupils */}
        <mesh position={[-0.1, 0.04, 0.22]}>
          <boxGeometry args={[0.045, 0.032, 0.01]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.1, 0.04, 0.22]}>
          <boxGeometry args={[0.045, 0.032, 0.01]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
        </mesh>
        {/* Smirk */}
        <mesh position={[0.04, -0.09, 0.21]}>
          <boxGeometry args={[0.1, 0.02, 0.01]} />
          <meshStandardMaterial color="#c06040" />
        </mesh>

        {/* Headphones */}
        <mesh ref={hpLeftRef} position={[-0.25, 0.1, 0]}>
          <boxGeometry args={[0.065, 0.24, 0.09]} />
          <meshStandardMaterial color="#0d0d1e" metalness={0.8} roughness={0.15} emissive="#ff0055" emissiveIntensity={0.5} />
        </mesh>
        <mesh ref={hpRightRef} position={[0.25, 0.1, 0]}>
          <boxGeometry args={[0.065, 0.24, 0.09]} />
          <meshStandardMaterial color="#0d0d1e" metalness={0.8} roughness={0.15} emissive="#0055ff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[0.58, 0.065, 0.065]} />
          <meshStandardMaterial color="#0d0d1e" metalness={0.8} roughness={0.1} />
        </mesh>
        <pointLight position={[0, 0.1, 0]} color="#00d4ff" intensity={0.5} distance={1.4} />
      </group>

      {/* Left arm */}
      <group ref={armLRef} position={[-0.36, 0.35, 0]}>
        <mesh position={[0, -0.19, 0.1]}>
          <boxGeometry args={[0.145, 0.4, 0.165]} />
          <meshStandardMaterial color="#6a1fd0" emissive="#3a0a80" emissiveIntensity={0.2} />
        </mesh>
        {/* Controller */}
        <mesh position={[-0.02, -0.44, 0.19]}>
          <boxGeometry args={[0.24, 0.11, 0.11]} />
          <meshStandardMaterial color="#0a0a18" roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[-0.08, -0.44, 0.255]}>
          <boxGeometry args={[0.065, 0.045, 0.01]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.04, -0.44, 0.255]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={armRRef} position={[0.36, 0.35, 0]}>
        <mesh position={[0, -0.19, 0.1]}>
          <boxGeometry args={[0.145, 0.4, 0.165]} />
          <meshStandardMaterial color="#6a1fd0" emissive="#3a0a80" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.02, -0.44, 0.19]}>
          <boxGeometry args={[0.24, 0.11, 0.11]} />
          <meshStandardMaterial color="#0a0a18" roughness={0.6} metalness={0.4} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.16, -0.24, 0.15]} rotation={[0.9, 0.22, 0.38]}>
        <boxGeometry args={[0.17, 0.52, 0.17]} />
        <meshStandardMaterial color="#0e0e28" />
      </mesh>
      <mesh position={[0.16, -0.24, 0.15]} rotation={[0.9, -0.22, -0.38]}>
        <boxGeometry args={[0.17, 0.52, 0.17]} />
        <meshStandardMaterial color="#0e0e28" />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.27, -0.4, 0.31]}>
        <boxGeometry args={[0.19, 0.13, 0.24]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0.27, -0.4, 0.31]}>
        <boxGeometry args={[0.19, 0.13, 0.24]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Shoe soles glow */}
      <mesh position={[-0.27, -0.465, 0.31]}>
        <boxGeometry args={[0.18, 0.01, 0.23]} />
        <meshBasicMaterial color="#00b4d8" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.27, -0.465, 0.31]}>
        <boxGeometry args={[0.18, 0.01, 0.23]} />
        <meshBasicMaterial color="#00b4d8" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

// ─── Nova AI Robot ────────────────────────────────────────────────────────────
function NovaAI({ hoveredPlanet }) {
  const groupRef = useRef()
  const headRef = useRef()
  const eyeRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y = -0.95 + Math.sin(t * 1.1) * 0.09
      groupRef.current.rotation.y = Math.sin(t * 0.45) * 0.25
    }
    if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.75) * 0.35
    if (eyeRef.current) eyeRef.current.material.emissiveIntensity = 2 + Math.sin(t * 4) * 0.5
  })

  return (
    <group ref={groupRef} position={[1.3, -0.95, -1.7]}>
      <pointLight color="#00ffcc" intensity={1.2} distance={2.5} />

      {/* Legs */}
      {[-0.1, 0.1].map((x, i) => (
        <mesh key={i} position={[x, -0.28, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.22, 6]} />
          <meshStandardMaterial color="#051a18" emissive="#00ffcc" emissiveIntensity={0.15} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Feet */}
      {[-0.1, 0.1].map((x, i) => (
        <mesh key={i} position={[x, -0.42, 0.04]}>
          <boxGeometry args={[0.1, 0.05, 0.14]} />
          <meshStandardMaterial color="#051a18" emissive="#00ffcc" emissiveIntensity={0.2} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.16, 0.42, 8]} />
        <meshStandardMaterial color="#051a18" emissive="#00ffcc" emissiveIntensity={0.25} metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Body panel lines */}
      <mesh position={[0, 0.05, 0.14]}>
        <boxGeometry args={[0.12, 0.08, 0.01]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, -0.05, 0.14]}>
        <boxGeometry args={[0.18, 0.02, 0.01]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.4} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.1, 8]} />
        <meshStandardMaterial color="#031210" emissive="#00ffcc" emissiveIntensity={0.2} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.4, 0]}>
        <mesh>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial color="#051a18" emissive="#00ffcc" emissiveIntensity={0.3} metalness={0.8} roughness={0.15} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 0, 0.13]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.2, 0.07, 0.02]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1} transparent opacity={0.8} />
        </mesh>
        {/* Eyes (2 dots) */}
        <mesh ref={eyeRef} position={[-0.055, 0.02, 0.14]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2.5} />
        </mesh>
        <mesh position={[0.055, 0.02, 0.14]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2.5} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.008, 0.012, 0.16, 6]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={4} />
        </mesh>
      </group>

      {/* Arms */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 0.22, 0.05, 0]} rotation={[0, 0, side * 0.65]}>
          <cylinderGeometry args={[0.032, 0.032, 0.24, 6]} />
          <meshStandardMaterial color="#051a18" emissive="#00ffcc" emissiveIntensity={0.2} metalness={0.85} roughness={0.15} />
        </mesh>
      ))}
      {/* Hands */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 0.32, -0.06, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1} />
        </mesh>
      ))}

      {/* Nova AI speech bubble */}
      {hoveredPlanet && (
        <Html position={[0.4, 0.6, 0]} center>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,20,18,0.95), rgba(0,40,36,0.95))',
            border: '1px solid #00ffcc',
            borderRadius: 10,
            padding: '10px 14px',
            color: '#00ffcc',
            fontFamily: 'monospace',
            fontSize: 11,
            whiteSpace: 'nowrap',
            boxShadow: '0 0 20px #00ffcc44, 0 0 40px #00ffcc22',
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: 3, letterSpacing: 1 }}>◈ NOVA AI</div>
            <div style={{ color: '#88ffee', fontSize: 10, marginBottom: 2 }}>
              → {hoveredPlanet.name}
            </div>
            <div style={{ color: '#55ccaa', fontSize: 9, maxWidth: 150, lineHeight: 1.4 }}>
              {hoveredPlanet.description}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// ─── Camera Rig ───────────────────────────────────────────────────────────────
function CameraRig({ phase }) {
  const { camera } = useThree()
  const progress = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMouse = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useFrame((_, delta) => {
    mouse.current.x += (target.current.x - mouse.current.x) * 0.06
    mouse.current.y += (target.current.y - mouse.current.y) * 0.06

    if (phase === 0) {
      progress.current = Math.min(progress.current + delta / 5, 1)
      const p = easeInOutCubic(progress.current)

      let tx, ty, tz, lx, ly, lz
      if (p < 0.35) {
        const t = p / 0.35
        tx = 0; ty = 2 - 1.5 * t; tz = 90 - 55 * t
        lx = 0; ly = -0.5; lz = 0
      } else if (p < 0.65) {
        const t = (p - 0.35) / 0.3
        tx = -0.3 * t; ty = 0.5 - 0.3 * t; tz = 35 - 22 * t
        lx = 0; ly = 0; lz = -5 * t
      } else {
        const t = (p - 0.65) / 0.35
        tx = -0.3 - 0.2 * t; ty = 0.2 + 1.0 * t; tz = 13 - 8 * t
        lx = 0; ly = -0.5 * t; lz = -5 - 2 * t
      }

      camera.position.x += (tx - camera.position.x) * 0.07
      camera.position.y += (ty - camera.position.y) * 0.07
      camera.position.z += (tz - camera.position.z) * 0.07
      camera.lookAt(lx, ly, lz)
    } else {
      const bx = -0.5, by = 1.2, bz = 5
      camera.position.x += (bx + mouse.current.x * 0.55 - camera.position.x) * 0.035
      camera.position.y += (by - mouse.current.y * 0.32 - camera.position.y) * 0.035
      camera.position.z += (bz - camera.position.z) * 0.035
      camera.lookAt(0, -0.2, -2)
    }
  })

  return null
}

// ─── Project Modal ────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  if (!project) return null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, animation: 'fadeIn 0.3s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'linear-gradient(135deg, rgba(6,6,20,0.98), rgba(14,4,28,0.98))', border: `1px solid ${project.color}`, borderRadius: 22, padding: '48px', maxWidth: 520, width: '90vw', boxShadow: `0 0 80px ${project.color}55, 0 0 160px ${project.color}18, inset 0 1px 0 ${project.color}22`, animation: 'slideUp 0.45s cubic-bezier(0.34,1.56,0.64,1)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: `1px solid #ffffff22`, color: '#fff', fontSize: 18, cursor: 'pointer', opacity: 0.5, lineHeight: 1, width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>

        <div style={{ fontSize: 64, textAlign: 'center', marginBottom: 18, filter: 'drop-shadow(0 0 20px currentColor)' }}>{project.icon}</div>
        <h2 style={{ color: project.color, fontFamily: 'monospace', fontSize: 30, textAlign: 'center', margin: '0 0 8px', textShadow: `0 0 30px ${project.color}, 0 0 60px ${project.color}44`, letterSpacing: 2 }}>{project.name}</h2>
        <div style={{ color: '#555', fontFamily: 'monospace', fontSize: 11, textAlign: 'center', letterSpacing: 3, marginBottom: 22 }}>{project.category.toUpperCase()}</div>

        <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`, margin: '0 auto 22px' }} />

        <p style={{ color: '#bbb', textAlign: 'center', fontSize: 15, lineHeight: 1.75, marginBottom: 30 }}>{project.description}</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
          {project.tech.map(t => (
            <span key={t} style={{ background: `${project.color}14`, border: `1px solid ${project.color}50`, color: project.color, padding: '6px 16px', borderRadius: 20, fontSize: 12, fontFamily: 'monospace', letterSpacing: 1 }}>{t}</span>
          ))}
        </div>

        {project.url !== '#' ? (
          <a href={project.url} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', padding: '16px 32px', background: `linear-gradient(135deg, ${project.color}, ${project.color}88)`, color: '#fff', textDecoration: 'none', borderRadius: 14, fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 3, boxShadow: `0 0 30px ${project.color}55`, fontSize: 13 }}>
            OPEN PROJECT →
          </a>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px', color: '#333', fontFamily: 'monospace', fontSize: 13, letterSpacing: 3, border: '1px dashed #222', borderRadius: 14 }}>COMING SOON...</div>
        )}
      </div>
    </div>
  )
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
export default function MakScene() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [hoveredPlanet, setHoveredPlanet] = useState(null)
  const [cameraPhase, setCameraPhase] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setCameraPhase(1), 6000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 2, 90], fov: 58 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.4 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000005']} />
        <fog attach="fog" args={['#00000f', 35, 160]} />

        <ambientLight intensity={0.06} />

        <Suspense fallback={null}>
          <CameraRig phase={cameraPhase} />

          {/* Space environment */}
          <DeepStars />
          <GalaxyDisc />
          <ShootingStar />
          <ShootingStar />

          {/* Nebula clouds */}
          <NebulaCloud color="#7b2d8b" position={[-20, 6, -38]} scale={14} />
          <NebulaCloud color="#00b4d8" position={[22, -4, -45]} scale={18} />
          <NebulaCloud color="#e63946" position={[10, 10, -55]} scale={10} />
          <NebulaCloud color="#2d6a4f" position={[-28, -2, -28]} scale={15} />
          <NebulaCloud color="#f4a261" position={[35, 5, -60]} scale={20} />

          {/* Scene */}
          <GamingRoom />
          <GamerBoy />
          <NovaAI hoveredPlanet={hoveredPlanet} />

          {/* Planets */}
          {planets.map(p => (
            <Planet key={p.id} data={p} onHover={setHoveredPlanet} onClick={setSelectedPlanet} cameraPhase={cameraPhase} />
          ))}

          {/* Post-processing */}
          <EffectComposer>
            <Bloom
              intensity={1.8}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
              blendFunction={BlendFunction.ADD}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0008, 0.0008]}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Opening overlay */}
      {cameraPhase === 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ color: 'rgba(0,212,255,0.7)', fontFamily: 'monospace', fontSize: 13, letterSpacing: 6, animation: 'pulse 2s ease infinite' }}>
            ENTERING THE UNIVERSE
          </div>
          <div style={{ marginTop: 20, width: 200, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)', animation: 'fadeIn 2s ease' }} />
        </div>
      )}

      {/* HUD */}
      {cameraPhase === 1 && (
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: 11, letterSpacing: 4, pointerEvents: 'none', animation: 'fadeIn 1.5s ease' }}>
          MOVE MOUSE · CLICK PLANETS TO EXPLORE
        </div>
      )}

      <ProjectModal project={selectedPlanet} onClose={() => setSelectedPlanet(null)} />

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(50px) scale(0.88) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes pulse { 0%,100% { opacity:0.5 } 50% { opacity:1 } }
      `}</style>
    </div>
  )
}
