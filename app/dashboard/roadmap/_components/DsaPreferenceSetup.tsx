'use client'

import React, { useState } from 'react'

export interface DsaPreferences {
  level: 'Beginner' | 'Intermediate' | 'Pro'
  language: string
}

interface DsaPreferenceSetupProps {
  initialPreferences?: Partial<DsaPreferences>
  onSubmit: (prefs: DsaPreferences) => void
  onBack: () => void
}

const LEVELS = [
  {
    id: 'Beginner' as const,
    label: 'Beginner',
    desc: '2–3 foundational pattern problems per pattern. Focuses on basic syntax & array/string mechanics.'
  },
  {
    id: 'Intermediate' as const,
    label: 'Intermediate',
    desc: '4–5 core interview pattern problems per pattern. Standard technical round difficulty.'
  },
  {
    id: 'Pro' as const,
    label: 'Pro',
    desc: '6+ hard & multi-pattern problem variations per pattern. Product-company level prep.'
  }
]

const LANGUAGES = [
  'Java',
  'Python',
  'C++',
  'JavaScript',
  'TypeScript',
  'Go',
  'C#'
]

export default function DsaPreferenceSetup({ initialPreferences, onSubmit, onBack }: DsaPreferenceSetupProps) {
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Pro'>(initialPreferences?.level || 'Beginner')
  const [language, setLanguage] = useState(initialPreferences?.language || 'Java')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ level, language })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#06080D] text-white flex items-center justify-center p-6 font-sans relative overflow-hidden select-none">
      
      {/* Background Dark Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#2a344a 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[#0D111A]/90 border border-emerald-500/30 p-8 rounded-3xl backdrop-blur-2xl shadow-[0_0_50px_rgba(0,255,102,0.15)] space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <div>
            <h1 className="text-xl font-black tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              DSA Preference Setup
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Select your comfort level and preferred language to generate pattern-segregated roadmaps.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="text-xs font-mono px-3.5 py-1.5 rounded-xl border border-zinc-800 hover:border-emerald-500/40 text-zinc-400 hover:text-emerald-300 transition-all bg-white/5"
          >
            &larr; Overview
          </button>
        </div>

        {/* 1. Comfort Level */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 block font-mono">
            1. Select Your DSA Comfort Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setLevel(lvl.id)}
                className={`p-4 text-xs text-left rounded-2xl border transition-all ${
                  level === lvl.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(0,255,102,0.3)]'
                    : 'bg-white/5 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="font-black text-sm text-white mb-1">{lvl.label}</div>
                <div className="text-[10px] text-zinc-400 font-mono leading-relaxed">{lvl.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Programming Language */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block font-mono">
            2. Primary Programming Language
          </label>
          <div className="flex flex-wrap gap-2.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                  language === lang
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                    : 'bg-white/5 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(0,255,102,0.3)]"
          >
            Generate DSA Pattern Roadmap &rarr;
          </button>
        </div>
      </form>
    </div>
  )
}
