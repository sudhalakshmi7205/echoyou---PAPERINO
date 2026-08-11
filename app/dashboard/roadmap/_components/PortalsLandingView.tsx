'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Zap, BookOpen, Target, Crown } from 'lucide-react'

export default function PortalsLandingView({
  onSelectUniverse,
  activeUniverse
}: {
  onSelectUniverse: (universe: 'role' | 'dsa' | 'cs') => void
  activeUniverse: 'role' | 'dsa' | 'cs'
}) {
  const portals = [
    {
      id: 'role',
      title: 'Role-Based Universe',
      tagline: 'Custom Placement Path',
      description: 'AI-personalized curriculum tailored specifically to your target role, company interview pattern (Google, Amazon, TCS, Zoho), language, and duration.',
      icon: '🪐',
      color: 'from-purple-600 via-indigo-600 to-purple-900',
      borderColor: 'border-purple-500/50 hover:border-purple-400',
      shadowColor: 'hover:shadow-[0_0_50px_rgba(168,85,247,0.4)]',
      stats: '15+ Roles • Company Customized'
    },
    {
      id: 'dsa',
      title: 'DSA Universe',
      tagline: 'Data Structures & Algorithms',
      description: 'Master 24 fundamental algorithmic patterns, NeetCode 75/150/250 problem paths, and language-specific video tutorials in one optimized journey.',
      icon: '⚡',
      color: 'from-cyan-600 via-teal-600 to-blue-900',
      borderColor: 'border-cyan-500/50 hover:border-cyan-400',
      shadowColor: 'hover:shadow-[0_0_50px_rgba(34,211,238,0.4)]',
      stats: '24 Patterns • NeetCode 75/150/250'
    },
    {
      id: 'cs',
      title: 'Core CS Universe',
      tagline: 'Computer Science Subjects',
      description: 'Deep dive into OS, CN, DBMS, OOP, System Design, Linux, Git, REST APIs, and microservice architectures with Gate Smashers & Neso notes.',
      icon: '💻',
      color: 'from-emerald-600 via-green-600 to-teal-900',
      borderColor: 'border-emerald-500/50 hover:border-emerald-400',
      shadowColor: 'hover:shadow-[0_0_50px_rgba(16,185,129,0.4)]',
      stats: '6 Core Subjects • System Design'
    }
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 relative">
      
      {/* Header Title Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold shadow-lg shadow-purple-500/10">
          <Sparkles className="w-4 h-4 text-cyan-400" /> EchoRoadmap V2: AI Learning Universe
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Select Your <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Learning Portal</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto">
          Enter an interactive, AI-guided galaxy designed to transform beginners into job-ready engineering candidates.
        </p>
      </div>

      {/* 3 Giant AI Portals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {portals.map((portal) => {
          const isSelected = activeUniverse === portal.id
          return (
            <motion.div
              key={portal.id}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => onSelectUniverse(portal.id as any)}
              className={`relative rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[380px] bg-[#111620]/90 ${portal.borderColor} ${portal.shadowColor} ${
                isSelected ? 'ring-2 ring-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.3)]' : ''
              }`}
            >
              {/* Portal Background Glass Glow */}
              <div className={`absolute -top-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-br ${portal.color} opacity-20 blur-3xl pointer-events-none`} />

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-xl">
                    {portal.icon}
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {portal.stats}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">{portal.tagline}</span>
                  <h3 className="text-2xl font-black text-white">{portal.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{portal.description}</p>
                </div>
              </div>

              {/* Action Button inside Portal */}
              <div className="pt-6 relative z-10 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">
                  {isSelected ? 'Currently Exploring ⭐' : 'Enter Universe'}
                </span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
