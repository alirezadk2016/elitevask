import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useUniverseStore } from '../state/universeStore'

const DISC_PARTICLES = 5000

// Fresnel rim-light shader — glows at silhouette edges like a real emission nebula
const fresnelVert = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vec4 mv   = modelViewMatrix * vec4(position, 1.0);
    vViewDir  = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const fresnelFrag = `
  uniform vec3  uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3  vNormal;
  varying vec3  vViewDir;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), uPower);
    gl_FragColor = vec4(uColor * uIntensity, f * 0.9);
  }
`

export default function GalaxyNode({ galaxy }) {
  const { position, color, glowColor, name, icon, id, description, planets } = galaxy
  const discRef  = useRef()
  const coreRef  = useRef()
  const halos    = useRef([])
  const [hovered, setHovered] = useState(false)
  const t = useRef(0)

  const enterGalaxy = useUniverseStore(s => s.enterGalaxy)
  const level       = useUniverseStore(s => s.level)
  const visible     = level === 'universe'

  // Spiral disc particles — 3 arms, color gradient from core to edge
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(DISC_PARTICLES * 3)
    const col = new Float32Array(DISC_PARTICLES * 3)
    const base = new THREE.Color(color)
    const edge = new THREE.Color(glowColor)

    for (let i = 0; i < DISC_PARTICLES; i++) {
      const arm   = Math.floor(Math.random() * 3)
      const frac  = i / DISC_PARTICLES
      const angle = (arm / 3) * Math.PI * 2 + frac * Math.PI * 5
      const r     = 0.5 + frac * 4.0
      const noise = (Math.random() - 0.5) * (r * 0.45)

      pos[i * 3]     = Math.cos(angle) * r + noise
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25
      pos[i * 3 + 2] = Math.sin(angle) * r + noise

      const c = new THREE.Color().lerpColors(base, edge, frac)
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [color, glowColor])

  const fresnelUniforms = useMemo(() => ({
    uColor:     { value: new THREE.Color(glowColor) },
    uPower:     { value: 2.8 },
    uIntensity: { value: 1.6 },
  }), [glowColor])

  useFrame((state, delta) => {
    t.current += delta
    if (discRef.current) discRef.current.rotation.y += delta * 0.05
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t.current * 1.8) * 0.04
      coreRef.current.scale.setScalar(hovered ? 1.2 * pulse : pulse)
    }
    // Multi-ring halos fade in/out
    halos.current.forEach((h, i) => {
      if (!h) return
      const base  = hovered ? 0.18 : 0.06
      const phase = Math.sin(t.current * 0.9 + i * 1.2) * 0.04
      h.material.opacity = base + phase
      h.scale.setScalar(1 + Math.sin(t.current * 0.5 + i) * 0.025)
    })
    if (fresnelUniforms.uIntensity) {
      fresnelUniforms.uIntensity.value = hovered
        ? 2.8 + Math.sin(t.current * 2) * 0.4
        : 1.6 + Math.sin(t.current * 1.2) * 0.2
    }
  })

  const baseColor = new THREE.Color(color)

  return (
    <group position={position} visible={visible}>
      {/* Layered pulsing halos */}
      {[2.0, 3.2, 4.5].map((r, i) => (
        <mesh key={i} ref={el => halos.current[i] = el}>
          <sphereGeometry args={[r, 12, 12]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>
      ))}

      {/* Fresnel rim glow shell */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <shaderMaterial
          vertexShader={fresnelVert}
          fragmentShader={fresnelFrag}
          uniforms={fresnelUniforms}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Spiral disc */}
      <points ref={discRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.18}
          transparent
          opacity={hovered ? 0.95 : 0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Core sphere */}
      <mesh
        ref={coreRef}
        onClick={() => enterGalaxy(id, `${name} — ${description}`)}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'none' }}
      >
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={hovered ? 6.0 : 3.5}
          roughness={0}
          metalness={0.2}
        />
      </mesh>

      {/* Label */}
      <Html center distanceFactor={30} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{
          textAlign: 'center',
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.35s ease',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}>
          <div style={{ fontSize: 16, marginBottom: 4 }}>
            {/* SVG star icon instead of emoji per skill checklist */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </div>
          <div style={{
            color: color,
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: `0 0 20px ${color}, 0 0 40px ${color}66`,
          }}>
            {name}
          </div>
          {hovered && (
            <div style={{
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              fontSize: 8,
              marginTop: 3,
              letterSpacing: '0.06em',
              animation: 'fadeInUp 0.25s ease',
            }}>
              {planets.length} planet{planets.length !== 1 ? 's' : ''} · Click to enter
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
