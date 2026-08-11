'use client'
import { Flame } from 'lucide-react'

export default function StreakCounter({ streak }: { streak: number }) {
  const isHot = streak >= 3

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 h-full flex flex-col items-center justify-center relative overflow-hidden">
      {isHot && (
        <div className="absolute inset-0 bg-orange-500/10 animate-pulse mix-blend-screen" />
      )}
      
      <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center mb-4 ${isHot ? 'bg-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.4)]' : 'bg-gray-800'}`}>
        <Flame className={`w-12 h-12 ${isHot ? 'text-orange-500' : 'text-gray-500'}`} />
      </div>
      
      <div className="text-4xl font-black text-white relative z-10">{streak}</div>
      <div className="text-sm text-gray-400 uppercase tracking-widest mt-1 relative z-10">Day Streak</div>
      
      {isHot && (
        <div className="mt-4 text-xs font-medium text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 relative z-10">
          You're on fire!
        </div>
      )}
    </div>
  )
}
