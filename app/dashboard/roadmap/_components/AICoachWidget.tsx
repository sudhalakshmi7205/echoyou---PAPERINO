'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, Target, Video, Code2, BookOpen, Clock, AlertTriangle, RefreshCw } from 'lucide-react'

export default function AICoachWidget({
  userName = 'Sudha',
  role = 'Software Engineer',
  company = 'Google',
  onRefreshGoal
}: {
  userName?: string
  role?: string
  company?: string
  onRefreshGoal?: () => void
}) {
  const [goals, setGoals] = useState({
    watchedVideos: 1,
    targetVideos: 2,
    solvedProblems: 3,
    targetProblems: 5,
    completedQuizzes: 0,
    targetQuizzes: 1,
    estimatedMinutes: 120
  })

  return (
    <div className="bg-[#111620]/90 border border-cyan-500/40 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_0_30px_rgba(34,211,238,0.15)] space-y-5 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-xl font-bold">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">AI Coach Briefing</h3>
              <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Target: {company}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Good Morning <span className="text-white font-bold">{userName}</span>! Here is your personalized goal for today.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30">
          <Clock className="w-3.5 h-3.5" /> Est. {goals.estimatedMinutes} Mins Study
        </div>
      </div>

      {/* Today's Goal Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D1117] border border-gray-800 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-red-400" /> Watch Videos
            </span>
            <span className="text-white font-bold">{goals.watchedVideos} / {goals.targetVideos}</span>
          </div>
          <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden p-0.5 border border-gray-800">
            <div className="bg-red-500 h-full rounded-full" style={{ width: `${(goals.watchedVideos / goals.targetVideos) * 100}%` }} />
          </div>
        </div>

        <div className="bg-[#0D1117] border border-gray-800 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Solve Problems
            </span>
            <span className="text-white font-bold">{goals.solvedProblems} / {goals.targetProblems}</span>
          </div>
          <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden p-0.5 border border-gray-800">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${(goals.solvedProblems / goals.targetProblems) * 100}%` }} />
          </div>
        </div>

        <div className="bg-[#0D1117] border border-gray-800 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Complete Quizzes
            </span>
            <span className="text-white font-bold">{goals.completedQuizzes} / {goals.targetQuizzes}</span>
          </div>
          <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden p-0.5 border border-gray-800">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(goals.completedQuizzes / goals.targetQuizzes) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
