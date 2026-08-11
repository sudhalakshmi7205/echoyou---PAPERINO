'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

function SphereEntity({ phase, onPhaseComplete }: { phase: string, onPhaseComplete: (p: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const [exploded, setExploded] = useState(false)

  // Use useMemo to generate random particles once to avoid massive re-renders
  const particleCount = 2000
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const vel = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      // Start in a tight sphere cluster
      const r = Math.random() * 2
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      
      // Explode outwards rapidly
      vel[i * 3] = pos[i * 3] * (Math.random() * 15 + 5)
      vel[i * 3 + 1] = pos[i * 3 + 1] * (Math.random() * 15 + 5)
      vel[i * 3 + 2] = pos[i * 3 + 2] * (Math.random() * 15 + 5)
    }
    return [pos, vel]
  }, [])

  useFrame((state, delta) => {
    if (phase === 'rolling' && meshRef.current) {
      // Roll into view from deep Z space
      meshRef.current.position.z += delta * 40
      meshRef.current.rotation.x += delta * 8
      meshRef.current.rotation.y += delta * 4
      
      if (meshRef.current.position.z >= 0) {
        meshRef.current.position.z = 0
        onPhaseComplete('rolling')
      }
    } else if (phase === 'zooming' && meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(2.5, 2.5, 2.5), 0.08)
      meshRef.current.rotation.x += delta * 2
      if (meshRef.current.scale.x > 2.45) {
        onPhaseComplete('zooming')
      }
    } else if (phase === 'blast') {
      if (!exploded) setExploded(true)
    }
    
    // Continuous rotation while text is showing
    if (phase === 'text' && meshRef.current) {
      meshRef.current.rotation.x += delta * 1.5
      meshRef.current.rotation.y += delta * 1.5
    }

    // Particle explosion physics
    if (exploded && particlesRef.current) {
      const positionsArray = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        positionsArray[i * 3] += velocities[i * 3] * delta
        positionsArray[i * 3 + 1] += velocities[i * 3 + 1] * delta
        positionsArray[i * 3 + 2] += velocities[i * 3 + 2] * delta
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      
      const mat = particlesRef.current.material as THREE.PointsMaterial
      if (mat.opacity > 0) mat.opacity -= delta * 1.2
      if (mat.opacity <= 0) onPhaseComplete('blast')
    }
  })

  return (
    <>
      {!exploded && (
        <mesh ref={meshRef} position={[0, 0, -80]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#a855f7" 
            emissive="#a855f7"
            emissiveIntensity={1.2}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
      {exploded && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            color="#06b6d4"
            transparent
            opacity={1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </>
  )
}

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState('rolling') // rolling -> zooming -> text -> blast
  
  function handlePhaseComplete(completedPhase: string) {
    if (completedPhase === 'rolling') setPhase('zooming')
    if (completedPhase === 'zooming') {
      setPhase('text')
      // Hold text for 2 seconds, then trigger blast
      setTimeout(() => setPhase('blast'), 2000)
    }
    if (completedPhase === 'blast') {
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E14] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#a855f7" />
        <SphereEntity phase={phase} onPhaseComplete={handlePhaseComplete} />
      </Canvas>
      
      <AnimatePresence>
        {phase === 'text' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-tighter drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">
              EchoYou
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
