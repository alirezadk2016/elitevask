import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useUniverseStore } from '../state/universeStore'

const DISC_PARTICLES = 3000

export default function GalaxyNode({ galaxy }) {
  const { position, color, glowColor, name, subtitle, icon, id, description, planets } = galaxy
  const meshRef   = useRef()
  const discRef   = useRef()
  const haloRef   = useRef()
  const [hovered, setHovered] = useState(false)

  const enterGalaxy = useUniverseStore(s => s.enterGalaxy)
  const activeGalaxyId = useUniverseStore(s => s.activeGalaxyId)
  const level = useUniverseStore(s => s.level)

  const visible = level === 'universe'

  // Disc particle positions (flat spiral)
  const discPositions = useMemo(() => {
    const pos = new Float32Array(DISC_PARTICLES * 3)
    for (let i = 0; i < DISC_PARTICLES; i++) {
      const angle = (i / DISC_PARTICLES) * Math.PI * 12
      const r     = 0.5 + (i / DISC_PARTICLES) * 4.5
      const spread = (Math.random() - 0.5) * 0.4
      pos[i * 3]     = Math.cos(angle) * r + spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      pos[i * 3 + 2] = Math.sin(angle) * r + spread
    }
    return pos
  }, [])

  useFrame((_, delta) => {
    if (discRef.current) discRef.current.rotation.y += delta * 0.06
    if (meshRef.current) {
      const t = hovered ? 1.18 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.08)
    }
    if (haloRef.current) {
      haloRef.current.material.opacity = hovered ? 0.22 : 0.07
    }
  })

  const col = new THREE.Color(color)
  const glow = new THREE.Color(glowColor)

  return (
    <group position={position} visible={visible}>
      {/* Halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[3.2, 16, 16]} />
        <meshBasicMaterial color={glow} transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>

      {/* Galaxy disc particles */}
      <points ref={discRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[discPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={col}
          size={0.06}
          transparent
          opacity={hovered ? 0.9 : 0.55}
          sizeAttenuation
        />
      </points>

      {/* Core glow sphere */}
      <mesh
        ref={meshRef}
        onClick={() => enterGalaxy(id, `${name} — ${description}`)}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'none' }}
      >
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color={col}
          emissive={col}
          emissiveIntensity={hovered ? 2.8 : 1.4}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Core atmosphere */}
      <mesh>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshBasicMaterial color={col} transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* HTML label */}
      <Html center distanceFactor={28} style={{ pointerEvents: 'none' }}>
        <div style={{
          textAlign: 'center',
          transition: 'opacity 0.3s',
          opacity: hovered ? 1 : 0.55,
        }}>
          <div style={{ fontSize: 18, marginBottom: 3 }}>{icon}</div>
          <div style={{
            color: color,
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: `0 0 12px ${color}`,
          }}>
            {name}
          </div>
          {hovered && (
            <div style={{
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 9,
              marginTop: 2,
              letterSpacing: '0.05em',
            }}>
              {planets.length} planet{planets.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
