'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Map, ShieldCheck, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

function SplittingGlobe({ phase, onPhaseComplete }: { phase: string, onPhaseComplete: (p: string) => void }) {
  const leftHemisphere = useRef<THREE.Mesh>(null)
  const rightHemisphere = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current || !leftHemisphere.current || !rightHemisphere.current) return

    if (phase === 'rolling') {
      // Roll into view from deep Z space
      groupRef.current.position.z += delta * 25
      groupRef.current.rotation.x += delta * 4
      groupRef.current.rotation.y += delta * 2
      
      if (groupRef.current.position.z >= 0) {
        groupRef.current.position.z = 0
        groupRef.current.rotation.x = 0 // Level it out
        groupRef.current.rotation.y = 0
        onPhaseComplete('rolling')
      }
    } else if (phase === 'splitting') {
      // Split into two halves slowly
      const splitSpeed = 4
      if (leftHemisphere.current.position.x > -3) {
        leftHemisphere.current.position.x -= delta * splitSpeed
        rightHemisphere.current.position.x += delta * splitSpeed
        
        // Slight rotation to face the user a bit better
        leftHemisphere.current.rotation.y -= delta * 0.5
        rightHemisphere.current.rotation.y += delta * 0.5
      } else {
        onPhaseComplete('splitting')
      }
    } else if (phase === 'idle') {
      // Gentle floating animation
      const t = state.clock.getElapsedTime()
      leftHemisphere.current.position.y = Math.sin(t * 2) * 0.2
      rightHemisphere.current.position.y = Math.cos(t * 2) * 0.2
      
      leftHemisphere.current.rotation.x += delta * 0.2
      leftHemisphere.current.rotation.y += delta * 0.3
      
      rightHemisphere.current.rotation.x -= delta * 0.2
      rightHemisphere.current.rotation.y -= delta * 0.3
    }
  })

  // A detailed wireframe material looks amazing
  const material = new THREE.MeshStandardMaterial({
    color: "#06b6d4",
    emissive: "#06b6d4",
    emissiveIntensity: 0.8,
    wireframe: true,
    transparent: true,
    opacity: 0.8,
  })

  const rightMaterial = new THREE.MeshStandardMaterial({
    color: "#a855f7",
    emissive: "#a855f7",
    emissiveIntensity: 0.8,
    wireframe: true,
    transparent: true,
    opacity: 0.8,
  })

  return (
    <group ref={groupRef} position={[0, 0, -40]}>
      {/* Left Hemisphere - Phi Start 0, Phi Length PI */}
      <mesh ref={leftHemisphere} material={material}>
        <sphereGeometry args={[2, 32, 32, Math.PI / 2, Math.PI]} />
      </mesh>
      
      {/* Right Hemisphere - Phi Start PI, Phi Length PI */}
      <mesh ref={rightHemisphere} material={rightMaterial}>
        <sphereGeometry args={[2, 32, 32, -Math.PI / 2, Math.PI]} />
      </mesh>
    </group>
  )
}

export default function FeatureShowcase() {
  const [show, setShow] = useState(false)
  const [phase, setPhase] = useState<'rolling' | 'splitting' | 'idle' | 'closing'>('rolling')
  const [uiVisible, setUiVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (sessionStorage.getItem('featureShowcaseSeen') === 'true') {
      setShow(false)
      return
    }

    sessionStorage.setItem('featureShowcaseSeen', 'true')
    setShow(true)
  }, [])

  if (!show) return null

  function handlePhaseComplete(completedPhase: string) {
    if (completedPhase === 'rolling') {
      setPhase('splitting')
    }
    if (completedPhase === 'splitting') {
      setPhase('idle')
      setUiVisible(true)
    }
  }

  function handleClose() {
    setUiVisible(false)
    setPhase('closing')
    setTimeout(() => setShow(false), 800)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#0B0E14]/95 backdrop-blur-xl overflow-hidden flex items-center justify-center"
        >
          {/* 3D Canvas Layer */}
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={2} color="#06b6d4" />
              <pointLight position={[-10, -10, -10]} intensity={2} color="#a855f7" />
              <SplittingGlobe phase={phase} onPhaseComplete={handlePhaseComplete} />
            </Canvas>
          </div>

          {/* UI Layer */}
          <AnimatePresence>
            {uiVisible && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-center"
              >
                <div className="text-center mb-16">
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                    Supercharge Your Journey
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Master your career progression with ATS scoring and personalized roadmaps.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 w-full max-w-5xl">
                  {/* Left Feature: ATS Checker */}
                  <Link 
                    href="/dashboard/resume"
                    onClick={() => setShow(false)}
                    className="group relative flex flex-col items-center p-8 rounded-3xl bg-[#111620]/60 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all duration-500 backdrop-blur-md"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-20 h-20 rounded-2xl bg-cyan-950/50 border border-cyan-500/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <ShieldCheck className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      ATS Score Checker
                    </h3>
                    <p className="text-center text-gray-400 mb-6">
                      Analyze your resume against real job descriptions and beat the Applicant Tracking Systems.
                    </p>
                    <div className="mt-auto px-6 py-2 rounded-full bg-cyan-950/50 text-cyan-400 text-sm font-medium border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                      Try Now
                    </div>
                  </Link>

                  {/* Right Feature: Learning Roadmap */}
                  <Link 
                    href="/dashboard/roadmap"
                    onClick={() => setShow(false)}
                    className="group relative flex flex-col items-center p-8 rounded-3xl bg-[#111620]/60 border border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-500 backdrop-blur-md"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-20 h-20 rounded-2xl bg-purple-950/50 border border-purple-500/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Map className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                      EchoYou Roadmap
                    </h3>
                    <p className="text-center text-gray-400 mb-6">
                      Generate a personalized learning path to transition from your current role to your dream job.
                    </p>
                    <div className="mt-auto px-6 py-2 rounded-full bg-purple-950/50 text-purple-400 text-sm font-medium border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-black transition-colors">
                      Explore Roadmap
                    </div>
                  </Link>
                </div>

                <button
                  onClick={handleClose}
                  className="mt-16 group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <span className="border-b border-transparent group-hover:border-white transition-colors">
                    Skip to Dashboard
                  </span>
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
