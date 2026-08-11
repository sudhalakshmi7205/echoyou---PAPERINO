'use client'

import { Crown, Award, Zap, ShieldCheck } from 'lucide-react'

export const RANKS = [
  { level: 1, title: 'DSA Rookie', icon: '🌱', minXP: 0 },
  { level: 2, title: 'Algorithm Explorer', icon: '🔍', minXP: 500 },
  { level: 3, title: 'Tree Master', icon: '🌲', minXP: 1200 },
  { level: 4, title: 'Graph Ninja', icon: '🥷', minXP: 2200 },
  { level: 5, title: 'DP Wizard', icon: '🧙‍♂️', minXP: 3500 },
  { level: 6, title: 'Placement Hero', icon: '🦸‍♂️', minXP: 5000 },
  { level: 7, title: 'Google Challenger', icon: '👑', minXP: 7500 }
]

export default function GamificationRanksBadge({ totalXP }: { totalXP: number }) {
  const currentRank = [...RANKS].reverse().find(r => totalXP >= r.minXP) || RANKS[0]

  return (
    <div className="flex items-center gap-2 bg-[#111620] border border-purple-500/40 px-3.5 py-1.5 rounded-xl shadow-lg shadow-purple-500/10">
      <span className="text-base">{currentRank.icon}</span>
      <div>
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Rank Title</span>
        <span className="text-xs font-black text-white flex items-center gap-1">
          {currentRank.title}
        </span>
      </div>
    </div>
  )
}
