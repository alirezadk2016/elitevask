'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useUniverseStore } from '../state/universeStore'
import { galaxies, getGalaxyById } from '../data/universe'

// Camera positions per level
const UNIVERSE_POS = new THREE.Vector3(0, 18, 58)
const UNIVERSE_TARGET = new THREE.Vector3(0, 0, 0)

function getGalaxyPos(galaxyId) {
  const g = getGalaxyById(galaxyId)
  if (!g) return UNIVERSE_POS.clone()
  const [x, y, z] = g.position
  // Camera sits in front of the galaxy
  return new THREE.Vector3(x * 0.35, y + 6, z + 28)
}

function getGalaxyTarget(galaxyId) {
  const g = getGalaxyById(galaxyId)
  if (!g) return UNIVERSE_TARGET.clone()
  const [x, y, z] = g.position
  return new THREE.Vector3(x, y, z)
}

// Planet lives at orbitRadius along X inside galaxy's local space
function getPlanetPos(galaxyId) {
  const g = getGalaxyById(galaxyId)
  if (!g) return UNIVERSE_POS.clone()
  const [x, y, z] = g.position
  return new THREE.Vector3(x * 0.3 + 6, y + 2, z + 14)
}

export default function CameraRig({ mouseX, mouseY }) {
  const { camera } = useThree()
  const level          = useUniverseStore(s => s.level)
  const activeGalaxyId = useUniverseStore(s => s.activeGalaxyId)
  const goBack         = useUniverseStore(s => s.goBack)
  const prevLevel      = useRef('universe')
  const targetPos      = useRef(UNIVERSE_POS.clone())
  const targetLook     = useRef(UNIVERSE_TARGET.clone())
  const currentLook    = useRef(UNIVERSE_TARGET.clone())
  const tweenRef       = useRef(null)

  // Set initial camera
  useEffect(() => {
    camera.position.copy(UNIVERSE_POS)
    camera.lookAt(UNIVERSE_TARGET)
  }, [])

  // Fly camera on level/galaxy change
  useEffect(() => {
    let newPos, newTarget, duration

    if (level === 'universe') {
      newPos    = UNIVERSE_POS.clone()
      newTarget = UNIVERSE_TARGET.clone()
      duration  = 2.2
    } else if (level === 'galaxy') {
      newPos    = getGalaxyPos(activeGalaxyId)
      newTarget = getGalaxyTarget(activeGalaxyId)
      duration  = prevLevel.current === 'universe' ? 2.0 : 1.4
    } else if (level === 'planet') {
      newPos    = getPlanetPos(activeGalaxyId)
      newTarget = getGalaxyTarget(activeGalaxyId)
      duration  = 1.6
    }

    if (!newPos) return

    // Kill running tween
    if (tweenRef.current) tweenRef.current.kill()

    const posProxy  = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
    const lookProxy = { x: currentLook.current.x, y: currentLook.current.y, z: currentLook.current.z }

    tweenRef.current = gsap.timeline()
      .to(posProxy, {
        x: newPos.x, y: newPos.y, z: newPos.z,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => camera.position.set(posProxy.x, posProxy.y, posProxy.z),
      }, 0)
      .to(lookProxy, {
        x: newTarget.x, y: newTarget.y, z: newTarget.z,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => {
          currentLook.current.set(lookProxy.x, lookProxy.y, lookProxy.z)
          camera.lookAt(currentLook.current)
        },
      }, 0)

    targetPos.current  = newPos
    targetLook.current = newTarget
    prevLevel.current  = level
  }, [level, activeGalaxyId])

  // Mouse parallax drift on idle
  useFrame(() => {
    if (!tweenRef.current?.isActive()) {
      const drift = level === 'universe' ? 3.5 : 1.2
      camera.position.x += (targetPos.current.x + mouseX * drift - camera.position.x) * 0.025
      camera.position.y += (targetPos.current.y + mouseY * drift - camera.position.y) * 0.025
      camera.lookAt(currentLook.current)
    }
  })

  // Right-click = go back one level
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); goBack() }
    window.addEventListener('contextmenu', handler)
    return () => window.removeEventListener('contextmenu', handler)
  }, [goBack])

  return null
}
