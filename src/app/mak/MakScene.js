'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Text, Html, Environment } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { projects } from './projects'

// ─── Floating Stars Particles ──────────────────────────────────────────────
function SpaceParticles() {
  const ref = useRef()
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05
  })
  return (
    <group ref={ref}>
      <Stars radius={80} depth={60} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

// ─── Nebula / Space Fog ────────────────────────────────────────────────────
function NebulaSphere({ color, position, scale }) {
  const ref = useRef()
  useFrame((state) => {
    ref.current.rotation.y += 0.002
    ref.current.rotation.x += 0.001
    const s = scale + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    ref.current.scale.setScalar(s)
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.04} wireframe />
    </mesh>
  )
}

// ─── Glass Door Portal ─────────────────────────────────────────────────────
function GlassDoor({ project, position, rotation, onClick, isSelected }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.05
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = hovered || isSelected
        ? 0.35 + Math.sin(t * 3) * 0.1
        : 0.12 + Math.sin(t * 1.5) * 0.04
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Glow back panel */}
      <mesh ref={glowRef} position={[0, 0, -0.05]}>
        <planeGeometry args={[1.6, 2.4]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.12} />
      </mesh>

      {/* Glass door frame */}
      <mesh
        ref={meshRef}
        onClick={() => onClick(project)}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        <boxGeometry args={[1.4, 2.2, 0.04]} />
        <meshPhysicalMaterial
          color={hovered || isSelected ? project.color : '#a8d8ea'}
          transparent
          opacity={hovered || isSelected ? 0.6 : 0.25}
          roughness={0}
          metalness={0.1}
          transmission={0.8}
          thickness={0.5}
          reflectivity={1}
          envMapIntensity={2}
        />
      </mesh>

      {/* Door handle */}
      <mesh position={[0.5, 0, 0.06]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color={project.color} metalness={1} roughness={0} />
      </mesh>

      {/* Icon on door */}
      <Text
        position={[0, 0.4, 0.06]}
        fontSize={0.35}
        anchorX="center"
        anchorY="middle"
      >
        {project.icon}
      </Text>

      {/* Project title */}
      <Text
        position={[0, -0.1, 0.06]}
        fontSize={0.1}
        color={hovered || isSelected ? project.color : 'white'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceMono-Regular.ttf"
        maxWidth={1.2}
      >
        {project.title}
      </Text>

      {/* Door frame border lines */}
      <lineSegments position={[0, 0, 0.03]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.4, 2.2, 0.04)]} />
        <lineBasicMaterial color={project.color} transparent opacity={hovered ? 1 : 0.5} />
      </lineSegments>
    </group>
  )
}

// ─── Gamer Boy Character ───────────────────────────────────────────────────
function GamerBoy() {
  const groupRef = useRef()
  const headRef = useRef()
  const armLRef = useRef()
  const armRRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y = -1.5 + Math.sin(t * 0.6) * 0.03
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.4) * 0.15
      headRef.current.rotation.x = -0.1 + Math.sin(t * 0.3) * 0.05
    }
    if (armLRef.current) {
      armLRef.current.rotation.z = 0.6 + Math.sin(t * 8) * 0.05
    }
    if (armRRef.current) {
      armRRef.current.rotation.z = -0.6 + Math.sin(t * 8 + 0.5) * 0.05
    }
  })

  const skinColor = '#f4a261'
  const shirtColor = '#8338ec'
  const pantsColor = '#1a1a2e'
  const hairColor = '#2d2d2d'
  const glowColor = '#00f5ff'

  return (
    <group ref={groupRef} position={[0, -1.5, 0.5]}>
      {/* Body glow base */}
      <pointLight position={[0, 0, 0.5]} color={glowColor} intensity={0.8} distance={3} />

      {/* Torso */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.55, 0.65, 0.3]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      {/* Hoodie detail */}
      <mesh position={[0, 0.55, 0.16]}>
        <boxGeometry args={[0.3, 0.1, 0.02]} />
        <meshStandardMaterial color="#6a2fc0" />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.82, 0]}>
        <mesh>
          <boxGeometry args={[0.42, 0.42, 0.4]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.44, 0.12, 0.42]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
        {/* Hair front spikes */}
        <mesh position={[0, 0.28, 0.2]}>
          <boxGeometry args={[0.38, 0.1, 0.08]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.1, 0.04, 0.21]}>
          <boxGeometry args={[0.08, 0.06, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <mesh position={[0.1, 0.04, 0.21]}>
          <boxGeometry args={[0.08, 0.06, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Eye glow */}
        <mesh position={[-0.1, 0.04, 0.22]}>
          <boxGeometry args={[0.04, 0.03, 0.01]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.1, 0.04, 0.22]}>
          <boxGeometry args={[0.04, 0.03, 0.01]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={2} />
        </mesh>
        {/* Headphones */}
        <mesh position={[-0.24, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.22, 0.08]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.24, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.22, 0.08]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.56, 0.06, 0.06]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Left arm */}
      <group ref={armLRef} position={[-0.35, 0.35, 0]}>
        <mesh position={[0, -0.18, 0.1]}>
          <boxGeometry args={[0.14, 0.38, 0.16]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        {/* Controller in hand */}
        <mesh position={[-0.02, -0.42, 0.18]}>
          <boxGeometry args={[0.22, 0.1, 0.1]} />
          <meshStandardMaterial color="#0d0d0d" />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={armRRef} position={[0.35, 0.35, 0]}>
        <mesh position={[0, -0.18, 0.1]}>
          <boxGeometry args={[0.14, 0.38, 0.16]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <mesh position={[0.02, -0.42, 0.18]}>
          <boxGeometry args={[0.22, 0.1, 0.1]} />
          <meshStandardMaterial color="#0d0d0d" />
        </mesh>
      </group>

      {/* Legs (cross-legged sitting) */}
      <mesh position={[-0.2, -0.22, 0.12]} rotation={[0.8, 0.3, 0.5]}>
        <boxGeometry args={[0.16, 0.52, 0.16]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>
      <mesh position={[0.2, -0.22, 0.12]} rotation={[0.8, -0.3, -0.5]}>
        <boxGeometry args={[0.16, 0.52, 0.16]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.3, -0.38, 0.28]}>
        <boxGeometry args={[0.2, 0.12, 0.24]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.3, -0.38, 0.28]}>
        <boxGeometry args={[0.2, 0.12, 0.24]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  )
}

// ─── Gaming Room Floor / Walls ──────────────────────────────────────────────
function Room() {
  return (
    <group>
      {/* Floor with grid glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
        <planeGeometry args={[20, 20, 30, 30]} />
        <meshStandardMaterial
          color="#050510"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.21, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#03030f" />
      </mesh>

      {/* Ambient glow strips on floor */}
      {[-3, -1, 1, 3].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -2.19, 0]}>
          <planeGeometry args={[0.05, 16]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#00f5ff' : '#8338ec'} transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[0, 0, -8]}>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color="#04040f" />
      </mesh>

      {/* Monitor setup on back wall (decorative) */}
      <mesh position={[0, 1.5, -7.9]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="#000814" emissive="#001833" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 1.5, -7.88]}>
        <planeGeometry args={[3.8, 2.3]} />
        <meshBasicMaterial color="#00060f" />
      </mesh>
      {/* Screen text */}
      <Text position={[0, 1.7, -7.85]} fontSize={0.18} color="#00f5ff" anchorX="center">
        MAK.DEV
      </Text>
      <Text position={[0, 1.3, -7.85]} fontSize={0.1} color="#8338ec" anchorX="center">
        {'< PORTFOLIO />'}
      </Text>
    </group>
  )
}

// ─── Camera Controller ─────────────────────────────────────────────────────
function CameraRig({ scrollY }) {
  const { camera } = useThree()
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetRef.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6
      targetRef.current.y = (e.clientY / window.innerHeight - 0.5) * -0.3
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    const scrollProgress = Math.min(scrollY / 800, 1)

    const baseX = 0
    const baseY = 0.5 - scrollProgress * 2
    const baseZ = 5 - scrollProgress * 3

    camera.position.x += (targetRef.current.x + baseX - camera.position.x) * 0.05
    camera.position.y += (targetRef.current.y + baseY - camera.position.y) * 0.05
    camera.position.z += (baseZ - camera.position.z) * 0.05
    camera.lookAt(0, -0.5, 0)
  })

  return null
}

// ─── Project Modal ─────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,30,0.95), rgba(20,5,40,0.95))',
          border: `1px solid ${project.color}`,
          borderRadius: 20,
          padding: '40px',
          maxWidth: 480,
          width: '90vw',
          boxShadow: `0 0 60px ${project.color}44, 0 0 120px ${project.color}22`,
          animation: 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none',
            color: '#fff', fontSize: 24, cursor: 'pointer',
            opacity: 0.6,
          }}
        >×</button>

        <div style={{ fontSize: 56, textAlign: 'center', marginBottom: 16 }}>
          {project.icon}
        </div>
        <h2 style={{
          color: project.color,
          fontFamily: 'monospace',
          fontSize: 28,
          textAlign: 'center',
          marginBottom: 8,
          textShadow: `0 0 20px ${project.color}`,
        }}>
          {project.title}
        </h2>
        <p style={{
          color: '#ccc',
          textAlign: 'center',
          fontSize: 15,
          lineHeight: 1.6,
          marginBottom: 24,
        }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
          {project.tech.map((t) => (
            <span key={t} style={{
              background: `${project.color}22`,
              border: `1px solid ${project.color}66`,
              color: project.color,
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontFamily: 'monospace',
            }}>{t}</span>
          ))}
        </div>

        {project.url !== '#' && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '14px 32px',
              background: `linear-gradient(90deg, ${project.color}, ${project.color}99)`,
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 12,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              letterSpacing: 1,
              boxShadow: `0 0 20px ${project.color}44`,
              transition: 'transform 0.2s',
            }}
          >
            OPEN PROJECT →
          </a>
        )}
        {project.url === '#' && (
          <div style={{
            textAlign: 'center',
            padding: '14px',
            color: '#666',
            fontFamily: 'monospace',
            fontSize: 13,
          }}>
            COMING SOON...
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Floating Title ─────────────────────────────────────────────────────────
function FloatingTitle() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 2.2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08
    }
  })
  return (
    <group ref={ref} position={[0, 2.2, 1]}>
      <Text
        fontSize={0.38}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceMono-Regular.ttf"
      >
        MAK's PORTFOLIO
      </Text>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.13}
        color="#8338ec"
        anchorX="center"
        anchorY="middle"
      >
        {'[ choose a door to explore ]'}
      </Text>
    </group>
  )
}

// ─── Main Scene ─────────────────────────────────────────────────────────────
export default function MakScene() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleWheel = (e) => {
      setScrollY((prev) => Math.max(0, Math.min(prev + e.deltaY, 800)))
    }
    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  // Arrange doors in a semicircle
  const doorPositions = projects.map((_, i) => {
    const total = projects.length
    const angle = ((i / total) * Math.PI * 1.2) - Math.PI * 0.6
    const radius = 4.5
    return {
      position: [Math.sin(angle) * radius, -0.3, -Math.cos(angle) * radius * 0.5 - 1],
      rotation: [0, -angle * 0.6, 0],
    }
  })

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#000005' }}
      >
        <fog attach="fog" args={['#000010', 10, 40]} />

        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 4, 2]} color="#8338ec" intensity={3} distance={15} />
        <pointLight position={[-6, 2, 0]} color="#00f5ff" intensity={2} distance={12} />
        <pointLight position={[6, 2, 0]} color="#ff006e" intensity={2} distance={12} />
        <spotLight
          position={[0, 6, 3]}
          angle={0.4}
          penumbra={0.5}
          intensity={4}
          color="#ffffff"
          castShadow
          target-position={[0, 0, 0]}
        />

        <Suspense fallback={null}>
          <CameraRig scrollY={scrollY} />
          <SpaceParticles />

          {/* Nebula decorations */}
          <NebulaSphere color="#8338ec" position={[-12, 3, -10]} scale={6} />
          <NebulaSphere color="#00f5ff" position={[12, -2, -15]} scale={8} />
          <NebulaSphere color="#ff006e" position={[5, 6, -20]} scale={5} />

          <Room />
          <FloatingTitle />
          <GamerBoy />

          {/* Glass Doors */}
          {projects.map((project, i) => (
            <GlassDoor
              key={project.id}
              project={project}
              position={doorPositions[i].position}
              rotation={doorPositions[i].rotation}
              onClick={setSelectedProject}
              isSelected={selectedProject?.id === project.id}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* HUD overlay */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff44',
        fontFamily: 'monospace',
        fontSize: 12,
        letterSpacing: 3,
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        SCROLL TO EXPLORE · CLICK DOORS TO VIEW PROJECTS
      </div>

      {/* Scroll progress bar */}
      <div style={{
        position: 'absolute',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 3,
        height: 120,
        background: '#ffffff11',
        borderRadius: 4,
      }}>
        <div style={{
          width: '100%',
          height: `${(scrollY / 800) * 100}%`,
          background: 'linear-gradient(180deg, #8338ec, #00f5ff)',
          borderRadius: 4,
          transition: 'height 0.1s',
        }} />
      </div>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.9) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}
