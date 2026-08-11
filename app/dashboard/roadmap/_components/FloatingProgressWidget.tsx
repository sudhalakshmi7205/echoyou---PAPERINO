'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bot, Sparkles } from 'lucide-react'

interface FloatingAiFabProps {
  onOpenAiMentor?: () => void
}

export default function FloatingProgressWidget({
  onOpenAiMentor
}: FloatingAiFabProps) {
  if (!onOpenAiMentor) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
      {/* Sleek Floating AI Assistant FAB Button (ChatGPT style) */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenAiMentor}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-400 text-white px-4 py-3 rounded-full shadow-[0_0_30px_rgba(138,92,255,0.5)] border border-purple-300/40 hover:shadow-[0_0_40px_rgba(138,92,255,0.7)] font-bold text-xs backdrop-blur-2xl transition-all"
        title="Open AI Mentor Assistant"
      >
        <Bot className="w-5 h-5 text-white animate-pulse" />
        <span className="font-extrabold tracking-wide hidden sm:inline">AI Mentor</span>
        <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
      </motion.button>
    </div>
  )
}
