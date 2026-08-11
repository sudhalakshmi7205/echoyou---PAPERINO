'use client'

import { motion } from 'framer-motion'
import { BrainCircuit, MessageSquareText, Lightbulb, Code2 } from 'lucide-react'

export default function NeuralUnlocks({ profile }: { profile: any }) {
  
  // Calculate dynamic unlocks based on actual user performance (Points & Interviews)
  const UNLOCKS = [
    {
      id: 'ai_mastery',
      title: 'AI Mastery',
      icon: BrainCircuit,
      color: 'from-cyan-400 to-blue-600',
      shadow: 'rgba(6, 182, 212, 0.5)',
      description: 'Unlocked by completing 10 technical interviews with AI.',
      unlocked: profile.interviewsCompleted >= 10,
    },
    {
      id: 'communication_expert',
      title: 'Communication Expert',
      icon: MessageSquareText,
      color: 'from-purple-400 to-pink-600',
      shadow: 'rgba(192, 38, 211, 0.5)',
      description: 'Unlocked by scoring 90%+ in communication (15,000+ XP).',
      unlocked: profile.points >= 15000,
    },
    {
      id: 'problem_solver',
      title: 'Problem Solver',
      icon: Lightbulb,
      color: 'from-yellow-400 to-orange-600',
      shadow: 'rgba(250, 204, 21, 0.5)',
      description: 'Unlocked by providing optimal solutions (30,000+ XP).',
      unlocked: profile.points >= 30000,
    },
    {
      id: 'algorithm_hunter',
      title: 'Algorithm Hunter',
      icon: Code2,
      color: 'from-emerald-400 to-green-600',
      shadow: 'rgba(52, 211, 153, 0.5)',
      description: 'Unlocked by solving Hard coding challenges (50,000+ XP).',
      unlocked: profile.points >= 50000,
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <BrainCircuit className="w-6 h-6 text-cyan-400" />
        Neural Unlocks
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {UNLOCKS.map((unlock, index) => {
          const Icon = unlock.icon
          return (
            <motion.div
              key={unlock.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: unlock.unlocked ? 1.05 : 1 }}
              className={`relative group p-6 rounded-2xl border transition-all duration-500 overflow-hidden ${
                unlock.unlocked 
                  ? 'bg-[#111620] border-gray-700 cursor-pointer' 
                  : 'bg-[#0B0E14] border-gray-800 opacity-60 cursor-not-allowed'
              }`}
              style={{
                boxShadow: unlock.unlocked ? `0 0 0 rgba(0,0,0,0)` : 'none'
              }}
            >
              {/* Animated Background Glow on Hover */}
              {unlock.unlocked && (
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${unlock.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
              )}

              {/* Holographic scanning line effect */}
              {unlock.unlocked && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-50 group-hover:animate-scan" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                
                {/* Icon Container with glowing ring */}
                <div className="relative">
                  {unlock.unlocked && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className={`absolute -inset-4 rounded-full bg-gradient-to-r ${unlock.color} opacity-20 blur-md`}
                    />
                  )}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gray-900 border-2 ${
                    unlock.unlocked ? 'border-transparent' : 'border-gray-700'
                  } relative z-10`}
                  style={{
                    boxShadow: unlock.unlocked ? `0 0 20px ${unlock.shadow}` : 'none',
                    borderColor: unlock.unlocked ? 'transparent' : ''
                  }}>
                    <Icon className={`w-8 h-8 ${unlock.unlocked ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                </div>

                <div>
                  <h3 className={`font-bold text-lg mb-2 ${unlock.unlocked ? 'text-white' : 'text-gray-500'}`}>
                    {unlock.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {unlock.unlocked ? unlock.description : 'Locked. Keep practicing to unlock.'}
                  </p>
                </div>

              </div>
            </motion.div>
          )
        })}
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200px); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  )
}
