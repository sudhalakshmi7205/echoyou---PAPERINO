'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Swords, X, CheckCircle2, AlertCircle, Play, ShieldAlert, Award } from 'lucide-react'

export default function PhaseBossGateModal({
  phaseTitle,
  company,
  onClose,
  onPassBossBattle
}: {
  phaseTitle: string
  company: string
  onClose: () => void
  onPassBossBattle: () => void
}) {
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [attemptScore, setAttemptScore] = useState<number | null>(null)

  const handleStartBattle = async () => {
    setIsEvaluating(true)
    setTimeout(() => {
      setIsEvaluating(false)
      const score = Math.floor(Math.random() * 25) + 78 // Mock score >= 70
      setAttemptScore(score)
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-[#111620] border border-purple-500/60 w-full max-w-xl rounded-3xl p-8 space-y-6 relative shadow-[0_0_60px_rgba(168,85,247,0.4)] text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-cyan-400 mx-auto flex items-center justify-center text-white font-bold shadow-2xl shadow-purple-500/30">
          <Swords className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black text-purple-400 uppercase tracking-widest block">Phase Gate Boss Battle</span>
          <h3 className="text-2xl font-black text-white">{phaseTitle} AI Checkpoint</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            To unlock the next phase, complete this 5-minute company-specific AI mock interview for <strong className="text-white">{company}</strong>. Score 70%+ to pass!
          </p>
        </div>

        {attemptScore === null ? (
          <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-5 space-y-4">
            <div className="text-xs font-bold text-gray-300 flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-400" /> Pass Criteria: Score 70 / 100 Minimum
            </div>

            <button
              onClick={handleStartBattle}
              disabled={isEvaluating}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isEvaluating ? (
                <>Evaluating AI Interview Response...</>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Start Boss Interview Gate
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-[#0D1117] border border-emerald-500/40 rounded-2xl p-6 space-y-4">
            <div className="text-3xl font-black text-emerald-400">{attemptScore} / 100</div>
            <div className="text-xs text-emerald-300 font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> PASSED! Next Phase Unlocked (+500 XP)
            </div>

            <button
              onClick={() => {
                onPassBossBattle()
                onClose()
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/25"
            >
              Claim Victory & Continue →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
