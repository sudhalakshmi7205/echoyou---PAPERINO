'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface OrbitalUniverseViewProps {
  onSelectUniverse: (universe: 'role' | 'dsa' | 'cs') => void
}

const UNIVERSES = [
  {
    id: 'role' as const,
    title: 'ROLE-BASED',
    subtitle: 'CAREER PATHS & TECH STACKS',
    glowColor: 'rgba(0, 210, 255, 0.5)',
    borderColor: 'border-cyan-500/60',
    subtitleColor: 'text-cyan-400',
    angleOffset: 0 // 0 degrees (Right/Top)
  },
  {
    id: 'dsa' as const,
    title: 'DSA PREP',
    subtitle: 'ALGORITHMS & 24 PATTERNS',
    glowColor: 'rgba(0, 255, 102, 0.5)',
    borderColor: 'border-emerald-500/60',
    subtitleColor: 'text-emerald-400',
    angleOffset: 120 // 120 degrees
  },
  {
    id: 'cs' as const,
    title: 'CORE CS',
    subtitle: 'OS, DBMS, CN & SYSTEM DESIGN',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    borderColor: 'border-purple-500/60',
    subtitleColor: 'text-purple-400',
    angleOffset: 240 // 240 degrees
  }
]

export default function OrbitalUniverseView({ onSelectUniverse }: OrbitalUniverseViewProps) {
  const [angle, setAngle] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  // Continuous smooth orbital rotation
  useEffect(() => {
    if (isPaused || selected) return
    const interval = setInterval(() => {
      setAngle(prev => (prev + 0.3) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [isPaused, selected])

  const handleSelect = (id: 'role' | 'dsa' | 'cs') => {
    setSelected(id)
    setTimeout(() => {
      onSelectUniverse(id)
    }, 400)
  }

  // Radius of orbit in pixels
  const ORBIT_RADIUS = 220

  return (
    <div className="w-full h-full min-h-[calc(100vh-64px)] bg-[#06080D] text-white relative flex items-center justify-center overflow-hidden select-none font-sans p-4 sm:p-6">
      
      {/* Background Dark Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#2a344a 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* 📱 MOBILE VIEW OPTIONS (Clean responsive cards view on phone screens) */}
      <div className="block md:hidden w-full max-w-sm space-y-6 relative z-30 my-auto">
        {/* Core Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            ECHOROADMAP
          </h1>
          <p className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
            Choose Your AI Learning Track
          </p>
        </div>

        {/* Option Cards */}
        <div className="space-y-3.5">
          {UNIVERSES.map(u => (
            <div
              key={u.id}
              onClick={() => handleSelect(u.id)}
              className={`p-4 rounded-2xl bg-[#0D111A]/95 border-2 ${u.borderColor} flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-95 shadow-xl`}
              style={{ boxShadow: `0 0 25px ${u.glowColor}` }}
            >
              <div>
                <h2 className="text-base font-black text-white tracking-wider uppercase">
                  {u.title}
                </h2>
                <p className={`text-[11px] font-extrabold ${u.subtitleColor} tracking-wider uppercase mt-1`}>
                  {u.subtitle}
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white uppercase tracking-wider shrink-0">
                Explore &rarr;
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🖥️ DESKTOP 3D ORBITAL VIEW (Hidden on mobile screens) */}
      <div className="hidden md:flex relative w-[560px] h-[560px] items-center justify-center">
        
        {/* SVG Orbital Track Circle */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <circle
            cx="280"
            cy="280"
            r={ORBIT_RADIUS}
            fill="none"
            stroke="#1F293D"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
        </svg>

        {/* Center Main Core Orb (EchoRoadmap) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-20 w-64 h-64 rounded-full bg-[#0D111A]/90 border-2 border-purple-500/60 shadow-[0_0_60px_rgba(139,92,246,0.35)] flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl"
        >
          {/* Double Pulse Ring */}
          <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-ping opacity-25 pointer-events-none" />
          <div className="absolute -inset-1 rounded-full border border-purple-500/40 pointer-events-none" />

          {/* Lightning Bolt Icon */}
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>

          {/* Core Title & Subtitle */}
          <h1 className="text-xl font-black text-white tracking-widest uppercase">
            ECHOROADMAP
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mt-1">
            AI LEARNING UNIVERSE
          </p>
        </motion.div>

        {/* 3 Orbiting Universe Spheres */}
        {UNIVERSES.map(u => {
          const currentAngleRad = ((angle + u.angleOffset) * Math.PI) / 180
          const x = Math.cos(currentAngleRad) * ORBIT_RADIUS
          const y = Math.sin(currentAngleRad) * ORBIT_RADIUS

          const isSelected = selected === u.id

          return (
            <motion.div
              key={u.id}
              onClick={() => handleSelect(u.id)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              animate={{
                x: isSelected ? 0 : x,
                y: isSelected ? 0 : y,
                scale: isSelected ? 1.25 : 1
              }}
              transition={{
                x: { duration: selected ? 0.4 : 0 },
                y: { duration: selected ? 0.4 : 0 },
                scale: { duration: 0.2 }
              }}
              className={`absolute z-30 w-44 h-44 rounded-full bg-[#0D111A]/90 border-2 ${u.borderColor} flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-shadow hover:scale-105 backdrop-blur-xl shadow-2xl`}
              style={{
                boxShadow: `0 0 40px ${u.glowColor}`
              }}
            >
              <h2 className="text-sm font-black text-white tracking-wider uppercase">
                {u.title}
              </h2>
              <p className={`text-[9px] font-extrabold ${u.subtitleColor} tracking-wider uppercase mt-1.5`}>
                {u.subtitle}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
