'use client'
import { Trophy, TrendingUp, Target, Award } from 'lucide-react'

export default function StatsSummary({ stats, xp, mostImproved }: { stats: any, xp: number, mostImproved: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
        <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
        <div className="text-3xl font-bold text-white">{stats.avgScore}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Avg Score</div>
      </div>
      
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
        <Award className="w-8 h-8 text-purple-400 mb-2" />
        <div className="text-3xl font-bold text-white">{xp}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total XP</div>
      </div>
      
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
        <Target className="w-8 h-8 text-green-400 mb-2" />
        <div className="text-3xl font-bold text-white">{stats.hireRate}%</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Hire Rate</div>
      </div>
      
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
        <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
        <div className="text-lg font-bold text-white leading-tight">{mostImproved}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Most Improved</div>
      </div>
    </div>
  )
}
