'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import CenterHubSphere from './CenterHubSphere'
import OrbitingPlanetSpheres from './OrbitingPlanetSpheres'

interface Roadmap3DUniverseCanvasProps {
  onSelectUniverse: (universe: 'role' | 'dsa' | 'cs') => void
}

function SceneContent({ onSelectUniverse }: Roadmap3DUniverseCanvasProps) {
  const groupRef = useRef<THREE.Group>(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to [-1, 1]
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      pointerRef.current = { x, y }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Parallax camera tilt effect (max ±8° = ±0.14 rad)
  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetRotationY = pointerRef.current.x * 0.14
      const targetRotationX = -pointerRef.current.y * 0.14

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, delta * 2)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, delta * 2)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Main Hub Sphere */}
      <CenterHubSphere />

      {/* 3 Orbiting Spheres (Role-Based, DSA Prep, Core CS) */}
      <OrbitingPlanetSpheres onSelectUniverse={onSelectUniverse} />
    </group>
  )
}

export default function Roadmap3DUniverseCanvas({ onSelectUniverse }: Roadmap3DUniverseCanvasProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs font-mono">Initializing 3D Space...</div>
  }

  return (
    <div className="w-full h-full min-h-[calc(100vh-64px)] bg-black relative overflow-hidden select-none">
      {/* Top Banner Guide */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none space-y-1">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
          EchoRoadmap AI Learning Universe
        </h2>
        <p className="text-[11px] text-zinc-500 font-mono">
          Click an orbiting universe to begin your personalized roadmap path
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 2.5, 9], fov: 50 }}
        className="w-full h-full bg-black"
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#000000']} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#A855F7" />

        {/* Background Subtle Stars & Space Particles */}
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={0.8}
        />

        {/* Main 3D Orbital Scene */}
        <SceneContent onSelectUniverse={onSelectUniverse} />
      </Canvas>
    </div>
  )
}
