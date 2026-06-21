import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useUniverseStore } from '../state/universeStore'

export default function PlanetNode({ planet, galaxyId }) {
  const {
    id, name, color, atmosphereColor, ringColor,
    size, orbitRadius, orbitSpeed, icon, category, flagship,
  } = planet

  const orbitRef  = useRef()
  const meshRef   = useRef()
  const [hovered, setHovered] = useState(false)

  const level = useUniverseStore(s => s.level)
  const enterPlanet = useUniverseStore(s => s.enterPlanet)
  const setHoveredStore = useUniverseStore(s => s.setHovered)
  const clearHovered = useUniverseStore(s => s.clearHovered)

  const visible = level === 'galaxy'

  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed * 0.003
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004
      const t = hovered ? 1.12 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.1)
    }
  })

  const col = new THREE.Color(color)
  const atmColor = new THREE.Color(color)

  return (
    <group visible={visible}>
      {/* Orbit ring (visual guide) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbit group — rotates to move planet around */}
      <group ref={orbitRef}>
        <group position={[orbitRadius, 0, 0]}>
          {/* Atmosphere glow */}
          <mesh>
            <sphereGeometry args={[size * 1.35, 16, 16]} />
            <meshBasicMaterial color={col} transparent opacity={hovered ? 0.18 : 0.07} side={THREE.BackSide} />
          </mesh>

          {/* Planet body */}
          <mesh
            ref={meshRef}
            onClick={() => enterPlanet(id, `${name} — ${category}`)}
            onPointerOver={() => {
              setHovered(true)
              setHoveredStore(id, `${name}: ${category}`)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              setHovered(false)
              clearHovered()
              document.body.style.cursor = 'none'
            }}
          >
            <sphereGeometry args={[size, 48, 48]} />
            <meshStandardMaterial
              color={col}
              emissive={col}
              emissiveIntensity={hovered ? 0.8 : 0.25}
              roughness={0.55}
              metalness={flagship ? 0.7 : 0.2}
            />
          </mesh>

          {/* Saturn-style ring for ringed planets */}
          {ringColor && (
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <ringGeometry args={[size * 1.4, size * 2.1, 64]} />
              <meshBasicMaterial
                color={new THREE.Color(ringColor)}
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Flagship crown indicator */}
          {flagship && (
            <mesh position={[0, size * 1.8, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshBasicMaterial color="#ffd700" />
            </mesh>
          )}

          {/* Label */}
          <Html center distanceFactor={20} style={{ pointerEvents: 'none' }}>
            <div style={{
              textAlign: 'center',
              opacity: hovered ? 1 : 0.6,
              transition: 'opacity 0.25s',
            }}>
              <div style={{ fontSize: 14 }}>{icon}</div>
              <div style={{
                color: color,
                fontFamily: 'Inter, sans-serif',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textShadow: `0 0 10px ${color}`,
                marginTop: 2,
              }}>
                {name}
              </div>
              {flagship && (
                <div style={{
                  color: '#ffd700',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 7,
                  letterSpacing: '0.15em',
                  marginTop: 1,
                }}>
                  FLAGSHIP
                </div>
              )}
            </div>
          </Html>
        </group>
      </group>
    </group>
  )
}
