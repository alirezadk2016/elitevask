'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { planets } from './projects'

// ─── Space Particles ──────────────────────────────────────────────────────────
function SpaceParticles() {
  const ref = useRef()
  const positions = useRef(null)
  const colors = useRef(null)

  if (!positions.current) {
    const count = 8000
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 40 + Math.random() * 80
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      // white to blue-ish
      const t = Math.random()
      col[i * 3] = 0.7 + t * 0.3
      col[i * 3 + 1] = 0.8 + t * 0.2
      col[i * 3 + 2] = 1.0
    }
    positions.current = pos
    colors.current = col
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors.current, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.3} sizeAttenuation vertexColors transparent opacity={0.85} />
    </points>
  )
}

// ─── Nebula ───────────────────────────────────────────────────────────────────
function Nebula({ color, position, scale }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.001
    ref.current.rotation.x += 0.0005
    const s = scale + Math.sin(state.clock.elapsedTime * 0.4) * scale * 0.05
    ref.current.scale.setScalar(s)
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.04} wireframe />
    </mesh>
  )
}

// ─── Planet ───────────────────────────────────────────────────────────────────
function Planet({ data, onHover, onClick, cameraPhase }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const lightRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const x = Math.sin(t * data.orbitSpeed) * data.orbitRadius
    const y = Math.sin(t * 0.3 + data.id) * 2
    const z = Math.cos(t * data.orbitSpeed) * data.orbitRadius * 0.4 - 20
    groupRef.current.position.set(x, y, z)

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      const targetIntensity = hovered ? 1.5 : 0.3
      meshRef.current.material.emissiveIntensity += (targetIntensity - meshRef.current.material.emissiveIntensity) * 0.1
      const targetScale = hovered ? 1.2 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }

    if (lightRef.current) {
      lightRef.current.intensity += ((hovered ? 2 : 0) - lightRef.current.intensity) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[data.size * 1.6, 0.02, 8, 64]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.15} />
      </mesh>

      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => {
          setHovered(true)
          onHover(data)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={() => {
          setHovered(false)
          onHover(null)
          document.body.style.cursor = 'auto'
        }}
        onClick={() => {
          if (cameraPhase === 1) onClick(data)
        }}
        scale={[data.size, data.size, data.size]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.emissive}
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Glow light */}
      <pointLight ref={lightRef} color={data.color} intensity={0} distance={8} />

      {/* Hover label */}
      {hovered && (
        <Html position={[0, data.size * 1.6 + 0.5, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.85)',
            border: `1px solid ${data.color}`,
            borderRadius: 8,
            padding: '10px 16px',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: 13,
            whiteSpace: 'nowrap',
            boxShadow: `0 0 20px ${data.color}44`,
            pointerEvents: 'none',
          }}>
            <div style={{ color: data.color, fontWeight: 'bold', marginBottom: 4 }}>
              {data.icon} {data.name}
            </div>
            <div style={{ color: '#aaa', fontSize: 11, marginBottom: 6 }}>{data.category}</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {data.tech.map(t => (
                <span key={t} style={{
                  background: `${data.color}22`,
                  border: `1px solid ${data.color}55`,
                  color: data.color,
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontSize: 10,
                }}>{t}</span>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// ─── Gaming Room ──────────────────────────────────────────────────────────────
function GamingRoom() {
  const rgbLightsRef = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const rgbColors = [
      new THREE.Color('#ff0040'),
      new THREE.Color('#0040ff'),
      new THREE.Color('#00ff80'),
      new THREE.Color('#8000ff'),
    ]
    rgbLightsRef.current.forEach((light, i) => {
      if (!light) return
      const c = rgbColors[i % rgbColors.length]
      const next = rgbColors[(i + 1) % rgbColors.length]
      const blend = (Math.sin(t * 0.5 + i * 1.5) + 1) * 0.5
      light.color.lerpColors(c, next, blend)
      light.intensity = 1.5 + Math.sin(t * 2 + i) * 0.5
    })
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#08080f" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Floor grid lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.19, 0]}>
        <planeGeometry args={[14, 10, 14, 10]} />
        <meshBasicMaterial color="#1a1a3a" wireframe transparent opacity={0.3} />
      </mesh>
      {/* RGB floor strips */}
      {[-2.5, -0.8, 0.8, 2.5].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -2.18, 0]}>
          <planeGeometry args={[0.04, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#00b4d8' : '#7b2d8b'} transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[0, 0.9, -5]}>
        <planeGeometry args={[14, 6.5]} />
        <meshStandardMaterial color="#060610" />
      </mesh>

      {/* Large window in back wall - transparent to show space */}
      <mesh position={[0, 1.2, -4.95]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#000030" transparent opacity={0.15} />
      </mesh>
      {/* Window frame */}
      <mesh position={[0, 1.2, -4.9]}>
        <boxGeometry args={[8.1, 0.12, 0.1]} />
        <meshStandardMaterial color="#222244" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, -4.9]}>
        <boxGeometry args={[0.12, 4.1, 0.1]} />
        <meshStandardMaterial color="#222244" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 3.2, -4.9]}>
        <boxGeometry args={[8.1, 0.12, 0.1]} />
        <meshStandardMaterial color="#222244" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.8, -4.9]}>
        <boxGeometry args={[8.1, 0.12, 0.1]} />
        <meshStandardMaterial color="#222244" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-4, 1.2, -4.9]}>
        <boxGeometry args={[0.12, 4.1, 0.1]} />
        <meshStandardMaterial color="#222244" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[4, 1.2, -4.9]}>
        <boxGeometry args={[0.12, 4.1, 0.1]} />
        <meshStandardMaterial color="#222244" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-7, 0.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 6.5]} />
        <meshStandardMaterial color="#060610" />
      </mesh>
      <mesh position={[7, 0.9, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 6.5]} />
        <meshStandardMaterial color="#060610" />
      </mesh>

      {/* Desk */}
      <mesh position={[0, -0.8, -3.5]}>
        <boxGeometry args={[3.5, 0.08, 1.2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Desk legs */}
      {[[-1.6, -0.5], [1.6, -0.5], [-1.6, 0.5], [1.6, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, -1.5, -3.5 + z]}>
          <boxGeometry args={[0.08, 1.4, 0.08]} />
          <meshStandardMaterial color="#111122" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Monitors - left */}
      <mesh position={[-1.3, -0.1, -3.9]}>
        <boxGeometry args={[1.1, 0.7, 0.05]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#0a0a2a" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-1.3, -0.1, -3.88]}>
        <planeGeometry args={[1.0, 0.62]} />
        <meshStandardMaterial color="#000510" emissive="#001830" emissiveIntensity={1} />
      </mesh>
      {/* Monitor left stand */}
      <mesh position={[-1.3, -0.52, -3.82]}>
        <cylinderGeometry args={[0.05, 0.05, 0.36, 8]} />
        <meshStandardMaterial color="#111122" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Monitors - center (main) */}
      <mesh position={[0, -0.02, -4.0]}>
        <boxGeometry args={[1.6, 1.0, 0.06]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#0a0a2a" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.02, -3.97]}>
        <planeGeometry args={[1.5, 0.92]} />
        <meshStandardMaterial color="#000210" emissive="#001020" emissiveIntensity={1.2} />
      </mesh>
      {/* Center monitor text */}
      <Html position={[0, -0.02, -3.94]} center transform>
        <div style={{
          textAlign: 'center',
          pointerEvents: 'none',
          width: 180,
        }}>
          <div style={{
            color: '#00b4d8',
            fontFamily: 'monospace',
            fontSize: 11,
            fontWeight: 'bold',
            letterSpacing: 2,
            textShadow: '0 0 10px #00b4d8',
            lineHeight: 1.5,
          }}>
            EXPLORE MY UNIVERSE
          </div>
          <div style={{
            color: '#ffffff44',
            fontFamily: 'monospace',
            fontSize: 7,
            marginTop: 4,
            letterSpacing: 1,
          }}>
            {'[ GALAXY PORTFOLIO ]'}
          </div>
        </div>
      </Html>
      {/* Center monitor stand */}
      <mesh position={[0, -0.56, -3.92]}>
        <cylinderGeometry args={[0.06, 0.06, 0.44, 8]} />
        <meshStandardMaterial color="#111122" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Monitors - right */}
      <mesh position={[1.3, -0.1, -3.9]}>
        <boxGeometry args={[1.1, 0.7, 0.05]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#0a0a2a" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.3, -0.1, -3.88]}>
        <planeGeometry args={[1.0, 0.62]} />
        <meshStandardMaterial color="#100505" emissive="#200010" emissiveIntensity={1} />
      </mesh>
      {/* Monitor right stand */}
      <mesh position={[1.3, -0.52, -3.82]}>
        <cylinderGeometry args={[0.05, 0.05, 0.36, 8]} />
        <meshStandardMaterial color="#111122" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, -0.74, -3.3]}>
        <boxGeometry args={[1.0, 0.04, 0.35]} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.8} />
      </mesh>
      {/* Mouse */}
      <mesh position={[0.7, -0.74, -3.3]}>
        <boxGeometry args={[0.14, 0.04, 0.22]} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.8} />
      </mesh>

      {/* Gaming chair back */}
      <mesh position={[0, -0.2, -1.8]}>
        <boxGeometry args={[0.7, 1.2, 0.12]} />
        <meshStandardMaterial color="#0a0a1e" />
      </mesh>
      {/* Chair seat */}
      <mesh position={[0, -0.9, -2.2]}>
        <boxGeometry args={[0.7, 0.1, 0.6]} />
        <meshStandardMaterial color="#0a0a1e" />
      </mesh>
      {/* Chair armrests */}
      <mesh position={[-0.42, -0.7, -2.2]}>
        <boxGeometry args={[0.1, 0.16, 0.5]} />
        <meshStandardMaterial color="#080814" />
      </mesh>
      <mesh position={[0.42, -0.7, -2.2]}>
        <boxGeometry args={[0.1, 0.16, 0.5]} />
        <meshStandardMaterial color="#080814" />
      </mesh>
      {/* Chair base */}
      <mesh position={[0, -1.1, -2.2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.28, -2.2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.06, 16]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Decorative knick-knacks */}
      <mesh position={[-1.9, -0.72, -3.3]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-2.1, -0.72, -3.3]}>
        <boxGeometry args={[0.08, 0.16, 0.08]} />
        <meshStandardMaterial color="#7b2d8b" emissive="#7b2d8b" emissiveIntensity={0.5} />
      </mesh>

      {/* RGB ambient lights */}
      {[
        { pos: [-6, 1, -2], color: '#ff0040' },
        { pos: [6, 1, -2], color: '#0040ff' },
        { pos: [-6, 1, 2], color: '#00ff80' },
        { pos: [6, 1, 2], color: '#8000ff' },
      ].map(({ pos, color }, i) => (
        <pointLight
          key={i}
          ref={(el) => { rgbLightsRef.current[i] = el }}
          position={pos}
          color={color}
          intensity={1.5}
          distance={10}
        />
      ))}

      {/* Monitor glow lights */}
      <pointLight position={[0, 0.5, -3.5]} color="#00b4d8" intensity={1.5} distance={4} />
      <pointLight position={[-1.3, 0.2, -3.5]} color="#0040ff" intensity={0.8} distance={3} />
      <pointLight position={[1.3, 0.2, -3.5]} color="#ff0040" intensity={0.8} distance={3} />
    </group>
  )
}

// ─── Gamer Boy ────────────────────────────────────────────────────────────────
function GamerBoy() {
  const groupRef = useRef()
  const headRef = useRef()
  const armLRef = useRef()
  const armRRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y = -1.5 + Math.sin(t * 0.6) * 0.025
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.35) * 0.12
      headRef.current.rotation.x = -0.08 + Math.sin(t * 0.28) * 0.04
    }
    if (armLRef.current) armLRef.current.rotation.z = 0.5 + Math.sin(t * 6) * 0.04
    if (armRRef.current) armRRef.current.rotation.z = -0.5 + Math.sin(t * 6 + 0.4) * 0.04
  })

  return (
    <group ref={groupRef} position={[0, -1.5, -2.0]}>
      {/* Body glow */}
      <pointLight position={[0, 0.3, 0.5]} color="#00b4d8" intensity={0.6} distance={2.5} />

      {/* Torso */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.55, 0.65, 0.3]} />
        <meshStandardMaterial color="#8338ec" />
      </mesh>
      {/* Hoodie stripe */}
      <mesh position={[0, 0.55, 0.16]}>
        <boxGeometry args={[0.28, 0.08, 0.02]} />
        <meshStandardMaterial color="#6a20d0" />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.82, 0]}>
        <mesh>
          <boxGeometry args={[0.42, 0.42, 0.38]} />
          <meshStandardMaterial color="#f4a261" />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.44, 0.12, 0.4]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>
        <mesh position={[0, 0.28, 0.18]}>
          <boxGeometry args={[0.36, 0.1, 0.08]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.1, 0.04, 0.2]}>
          <boxGeometry args={[0.08, 0.06, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <mesh position={[0.1, 0.04, 0.2]}>
          <boxGeometry args={[0.08, 0.06, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Eye glow */}
        <mesh position={[-0.1, 0.04, 0.21]}>
          <boxGeometry args={[0.04, 0.03, 0.01]} />
          <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.1, 0.04, 0.21]}>
          <boxGeometry args={[0.04, 0.03, 0.01]} />
          <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={2} />
        </mesh>
        {/* RGB Headphones */}
        <mesh position={[-0.24, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.22, 0.08]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} emissive="#ff0040" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0.24, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.22, 0.08]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} emissive="#0040ff" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.56, 0.06, 0.06]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Headphone glow light */}
        <pointLight position={[0, 0.1, 0]} color="#00b4d8" intensity={0.4} distance={1.2} />
      </group>

      {/* Left arm */}
      <group ref={armLRef} position={[-0.35, 0.35, 0]}>
        <mesh position={[0, -0.18, 0.1]}>
          <boxGeometry args={[0.14, 0.38, 0.16]} />
          <meshStandardMaterial color="#8338ec" />
        </mesh>
        {/* Controller */}
        <mesh position={[-0.02, -0.42, 0.18]}>
          <boxGeometry args={[0.22, 0.1, 0.1]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[-0.08, -0.42, 0.24]}>
          <boxGeometry args={[0.06, 0.04, 0.02]} />
          <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={armRRef} position={[0.35, 0.35, 0]}>
        <mesh position={[0, -0.18, 0.1]}>
          <boxGeometry args={[0.14, 0.38, 0.16]} />
          <meshStandardMaterial color="#8338ec" />
        </mesh>
        <mesh position={[0.02, -0.42, 0.18]}>
          <boxGeometry args={[0.22, 0.1, 0.1]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.6} metalness={0.3} />
        </mesh>
      </group>

      {/* Legs (sitting) */}
      <mesh position={[-0.16, -0.22, 0.14]} rotation={[0.9, 0.25, 0.4]}>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0.16, -0.22, 0.14]} rotation={[0.9, -0.25, -0.4]}>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.26, -0.38, 0.3]}>
        <boxGeometry args={[0.18, 0.12, 0.22]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.26, -0.38, 0.3]}>
        <boxGeometry args={[0.18, 0.12, 0.22]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  )
}

// ─── Nova AI Robot ────────────────────────────────────────────────────────────
function NovaAI({ hoveredPlanet }) {
  const groupRef = useRef()
  const headRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y = -1.0 + Math.sin(t * 1.2) * 0.08
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[1.2, -1.0, -1.6]}>
      {/* Glow */}
      <pointLight position={[0, 0, 0]} color="#00ffcc" intensity={0.8} distance={2} />

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.4, 8]} />
        <meshStandardMaterial color="#0a1a1a" emissive="#00ffcc" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.32, 0]}>
        <mesh>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#0a1a1a" emissive="#00ffcc" emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.05, 0.02, 0.12]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.05, 0.02, 0.12]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={3} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.12, 6]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* Arms */}
      <mesh position={[-0.2, 0.05, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.03, 0.03, 0.22, 6]} />
        <meshStandardMaterial color="#0a1a1a" emissive="#00ffcc" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 0.05, 0]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.03, 0.03, 0.22, 6]} />
        <meshStandardMaterial color="#0a1a1a" emissive="#00ffcc" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hover tooltip when planet is hovered */}
      {hoveredPlanet && (
        <Html position={[0.3, 0.5, 0]} center>
          <div style={{
            background: 'rgba(0,20,20,0.9)',
            border: '1px solid #00ffcc',
            borderRadius: 8,
            padding: '8px 12px',
            color: '#00ffcc',
            fontFamily: 'monospace',
            fontSize: 11,
            whiteSpace: 'nowrap',
            boxShadow: '0 0 15px #00ffcc44',
            pointerEvents: 'none',
            maxWidth: 160,
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: 2 }}>NOVA AI</div>
            <div style={{ color: '#aaffee', fontSize: 10 }}>
              Analyzing: {hoveredPlanet.name}
            </div>
            <div style={{ color: '#88ccbb', fontSize: 9, marginTop: 3 }}>
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
  const progressRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useFrame((state, delta) => {
    if (phase === 0) {
      progressRef.current = Math.min(progressRef.current + delta / 4, 1)
      const p = progressRef.current

      let tx, ty, tz, lx, ly, lz
      if (p < 0.4) {
        const t = p / 0.4
        tx = 0; ty = 2 - t; tz = 90 - 50 * t
        lx = 0; ly = 0; lz = 0
      } else if (p < 0.7) {
        const t = (p - 0.4) / 0.3
        tx = 0; ty = 1 - 0.5 * t; tz = 40 - 25 * t
        lx = 0; ly = 0; lz = 0
      } else {
        const t = (p - 0.7) / 0.3
        tx = -0.5 * t; ty = 0.5 + 0.7 * t; tz = 15 - 10 * t
        lx = 0; ly = 0; lz = -2 * t
      }

      camera.position.x += (tx - camera.position.x) * 0.08
      camera.position.y += (ty - camera.position.y) * 0.08
      camera.position.z += (tz - camera.position.z) * 0.08
      const lookTarget = new THREE.Vector3(lx, ly, lz)
      camera.lookAt(lookTarget)
    } else {
      // Exploration phase - mouse parallax
      const baseX = -0.5
      const baseY = 1.2
      const baseZ = 5

      const targetX = baseX + mouseRef.current.x * 0.5
      const targetY = baseY - mouseRef.current.y * 0.3

      camera.position.x += (targetX - camera.position.x) * 0.04
      camera.position.y += (targetY - camera.position.y) * 0.04
      camera.position.z += (baseZ - camera.position.z) * 0.04
      camera.lookAt(0, 0, -2)
    }
  })

  return null
}

// ─── Project Modal ────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(135deg, rgba(8,8,24,0.97), rgba(16,4,32,0.97))`,
          border: `1px solid ${project.color}`,
          borderRadius: 20,
          padding: '44px',
          maxWidth: 500,
          width: '90vw',
          boxShadow: `0 0 60px ${project.color}55, 0 0 120px ${project.color}22, inset 0 0 60px rgba(0,0,0,0.5)`,
          animation: 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none',
            color: '#fff', fontSize: 28, cursor: 'pointer',
            opacity: 0.5, lineHeight: 1,
          }}
        >×</button>

        <div style={{ fontSize: 60, textAlign: 'center', marginBottom: 16 }}>
          {project.icon}
        </div>
        <h2 style={{
          color: project.color,
          fontFamily: 'monospace',
          fontSize: 28,
          textAlign: 'center',
          margin: '0 0 6px',
          textShadow: `0 0 24px ${project.color}`,
        }}>
          {project.name}
        </h2>
        <div style={{
          color: '#666',
          fontFamily: 'monospace',
          fontSize: 12,
          textAlign: 'center',
          letterSpacing: 2,
          marginBottom: 20,
        }}>
          {project.category}
        </div>
        <p style={{
          color: '#ccc',
          textAlign: 'center',
          fontSize: 15,
          lineHeight: 1.7,
          marginBottom: 28,
        }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
          {project.tech.map((t) => (
            <span key={t} style={{
              background: `${project.color}18`,
              border: `1px solid ${project.color}55`,
              color: project.color,
              padding: '5px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontFamily: 'monospace',
            }}>{t}</span>
          ))}
        </div>

        {project.url !== '#' ? (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '15px 32px',
              background: `linear-gradient(90deg, ${project.color}, ${project.color}aa)`,
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 12,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              letterSpacing: 2,
              boxShadow: `0 0 24px ${project.color}44`,
            }}
          >
            OPEN PROJECT →
          </a>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '15px',
            color: '#555',
            fontFamily: 'monospace',
            fontSize: 13,
            letterSpacing: 2,
          }}>
            COMING SOON...
          </div>
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
    const t = setTimeout(() => setCameraPhase(1), 5000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 2, 90], fov: 60 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <color attach="background" args={['#000008']} />
        <fog attach="fog" args={['#000015', 30, 150]} />

        <ambientLight intensity={0.08} />
        <pointLight position={[0, 10, 0]} color="#ffffff" intensity={0.3} distance={40} />

        <Suspense fallback={null}>
          <CameraRig phase={cameraPhase} />
          <SpaceParticles />

          {/* Nebulas */}
          <Nebula color="#7b2d8b" position={[-18, 4, -30]} scale={10} />
          <Nebula color="#00b4d8" position={[20, -5, -40]} scale={14} />
          <Nebula color="#e63946" position={[8, 8, -50]} scale={8} />
          <Nebula color="#2d6a4f" position={[-25, -3, -20]} scale={12} />

          <GamingRoom />
          <GamerBoy />
          <NovaAI hoveredPlanet={hoveredPlanet} />

          {planets.map(p => (
            <Planet
              key={p.id}
              data={p}
              onHover={setHoveredPlanet}
              onClick={setSelectedPlanet}
              cameraPhase={cameraPhase}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* HUD */}
      {cameraPhase === 1 && (
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'monospace',
          fontSize: 12,
          letterSpacing: 3,
          pointerEvents: 'none',
          animation: 'fadeIn 1s ease',
        }}>
          MOVE MOUSE TO EXPLORE · CLICK PLANETS TO DISCOVER
        </div>
      )}

      {/* Opening sequence overlay */}
      {cameraPhase === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'rgba(0,180,216,0.6)',
          fontFamily: 'monospace',
          fontSize: 11,
          letterSpacing: 4,
          pointerEvents: 'none',
          animation: 'fadeIn 2s ease',
        }}>
          ENTERING THE UNIVERSE...
        </div>
      )}

      <ProjectModal project={selectedPlanet} onClose={() => setSelectedPlanet(null)} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.9) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}
