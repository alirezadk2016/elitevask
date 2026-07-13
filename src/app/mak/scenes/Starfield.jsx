import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const STAR_COUNT = 20000

export default function Starfield() {
  const ref = useRef()

  const { positions, sizes, colors } = useMemo(() => {
    const pos   = new Float32Array(STAR_COUNT * 3)
    const sz    = new Float32Array(STAR_COUNT)
    const col   = new Float32Array(STAR_COUNT * 3)
    const palette = [
      [1, 1, 1],
      [0.8, 0.9, 1],
      [1, 0.95, 0.8],
      [0.7, 0.85, 1],
      [1, 0.8, 0.9],
    ]
    for (let i = 0; i < STAR_COUNT; i++) {
      // Spherical shell — stars far from origin so camera never reaches them
      const r     = 120 + Math.random() * 180
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      sz[i] = 0.4 + Math.random() * 1.6
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3]     = c[0]
      col[i * 3 + 1] = c[1]
      col[i * 3 + 2] = c[2]
    }
    return { positions: pos, sizes: sz, colors: col }
  }, [])

  // Slow parallax drift — PHASE 2: tie to mouse/camera direction
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes, 1]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.9}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        fog={false}
      />
    </points>
  )
}
