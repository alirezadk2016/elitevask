import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useUniverseStore } from '../state/universeStore'

// Iridescent surface shader — shifts hue based on view angle (liquid glass)
const iridescentVert = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  void main() {
    vUv     = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const iridescentFrag = `
  uniform vec3  uColor;
  uniform float uTime;
  uniform float uHover;
  varying vec3  vNormal;
  varying vec3  vViewDir;
  varying vec2  vUv;

  vec3 hueShift(vec3 c, float h) {
    float angle = h * 3.14159265;
    vec3 k = vec3(0.57735);
    return c * cos(angle) + cross(k, c) * sin(angle) + k * dot(k, c) * (1.0 - cos(angle));
  }

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.5);
    float shift   = fresnel * (0.4 + uHover * 0.35) + uTime * 0.04;
    vec3  iri     = hueShift(uColor, shift);
    vec3  final   = mix(uColor, iri, fresnel * (0.5 + uHover * 0.5));
    float emission = 0.25 + fresnel * 0.4 + uHover * 0.3;
    gl_FragColor  = vec4(final * (1.0 + emission), 1.0);
  }
`

export default function PlanetNode({ planet }) {
  const {
    id, name, color, ringColor,
    size, orbitRadius, orbitSpeed, icon, category, flagship, stack,
  } = planet

  const orbitRef  = useRef()
  const meshRef   = useRef()
  const atmRef    = useRef()
  const [hovered, setHovered] = useState(false)
  const t = useRef(0)

  const level         = useUniverseStore(s => s.level)
  const enterPlanet   = useUniverseStore(s => s.enterPlanet)
  const setHoveredStore = useUniverseStore(s => s.setHovered)
  const clearHovered  = useUniverseStore(s => s.clearHovered)

  const visible = level === 'galaxy'

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uTime:  { value: 0 },
    uHover: { value: 0 },
  }), [color])

  // Orbit trail positions for subtle motion blur look
  const trailPositions = useMemo(() => {
    const pos = new Float32Array(120 * 3)
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2
      pos[i * 3]     = Math.cos(a) * orbitRadius
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = Math.sin(a) * orbitRadius
    }
    return pos
  }, [orbitRadius])

  useFrame((_, delta) => {
    t.current += delta
    if (orbitRef.current) orbitRef.current.rotation.y += orbitSpeed * 0.003
    if (meshRef.current)  meshRef.current.rotation.y  += 0.003

    // Atmosphere pulse — each planet has unique phase
    if (atmRef.current) {
      const base  = hovered ? 0.22 : 0.07
      const pulse = Math.sin(t.current * 1.4 + orbitRadius) * 0.04
      atmRef.current.material.opacity = base + pulse
      const scl = 1.35 + Math.sin(t.current * 0.9 + orbitRadius) * 0.025
      atmRef.current.scale.setScalar(scl)
    }

    // Iridescent shader time + hover lerp
    uniforms.uTime.value  = t.current
    uniforms.uHover.value += (hovered ? 1 : 0 - uniforms.uHover.value) * 0.08
  })

  const col = new THREE.Color(color)

  return (
    <group visible={visible}>
      {/* Orbit ring */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trailPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.025} transparent opacity={0.15} sizeAttenuation />
      </points>

      <group ref={orbitRef}>
        <group position={[orbitRadius, 0, 0]}>
          {/* Atmosphere glow — pulsing */}
          <mesh ref={atmRef}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshBasicMaterial
              color={col}
              transparent
              opacity={0.07}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Outer atmosphere haze */}
          <mesh>
            <sphereGeometry args={[size * 1.7, 12, 12]} />
            <meshBasicMaterial
              color={col}
              transparent
              opacity={0.03}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Planet body — iridescent shader */}
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
            <sphereGeometry args={[size, 64, 64]} />
            <shaderMaterial
              vertexShader={iridescentVert}
              fragmentShader={iridescentFrag}
              uniforms={uniforms}
            />
          </mesh>

          {/* Ring system */}
          {ringColor && (
            <>
              <mesh rotation={[Math.PI / 3.2, 0, 0.3]}>
                <ringGeometry args={[size * 1.45, size * 2.2, 80]} />
                <meshBasicMaterial
                  color={new THREE.Color(ringColor)}
                  transparent opacity={0.35}
                  side={THREE.DoubleSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
              <mesh rotation={[Math.PI / 3.2, 0, 0.3]}>
                <ringGeometry args={[size * 2.22, size * 2.6, 80]} />
                <meshBasicMaterial
                  color={new THREE.Color(ringColor)}
                  transparent opacity={0.12}
                  side={THREE.DoubleSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            </>
          )}

          {/* Flagship crown — gold point light */}
          {flagship && (
            <pointLight color="#ffd700" intensity={2} distance={8} />
          )}

          {/* Label */}
          <Html center distanceFactor={22} style={{ pointerEvents: 'none', userSelect: 'none' }}>
            <div style={{
              textAlign: 'center',
              opacity: hovered ? 1 : 0.55,
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
            }}>
              <div style={{ fontSize: 12, marginBottom: 2 }}>
                {/* Inline SVG icons per stack category */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill={color} style={{ verticalAlign: 'middle' }}>
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div style={{
                color: color,
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textShadow: `0 0 14px ${color}`,
              }}>
                {name}
              </div>
              {flagship && (
                <div style={{
                  color: '#ffd700',
                  fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                  fontSize: 7,
                  letterSpacing: '0.18em',
                  textShadow: '0 0 8px #ffd700',
                  marginTop: 1,
                }}>
                  FLAGSHIP
                </div>
              )}
              {hovered && (
                <div style={{
                  display: 'flex', gap: 3, justifyContent: 'center', marginTop: 4, flexWrap: 'wrap', maxWidth: 120,
                }}>
                  {stack?.slice(0, 3).map(s => (
                    <span key={s} style={{
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: 7,
                      background: `${color}18`,
                      border: `1px solid ${color}44`,
                      borderRadius: 3,
                      padding: '1px 5px',
                      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                    }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </Html>
        </group>
      </group>
    </group>
  )
}
