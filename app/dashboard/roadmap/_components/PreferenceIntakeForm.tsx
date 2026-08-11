'use client'

import React, { useState } from 'react'
import CustomDatePicker from './CustomDatePicker'

export interface UserPreferences {
  targetRole: string
  duration: string
  startDate: string
  language: string
  companyTier?: string
  dsaLevel?: string
  coreCsConfidence?: string
  timeframe?: string
}

interface PreferenceIntakeFormProps {
  initialPreferences?: Partial<UserPreferences>
  onSubmit: (prefs: UserPreferences) => void
  onBackToLanding?: () => void
}

const TARGET_ROLES = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Developer',
  'SDE-1',
  'Data Analyst',
  'ML Engineer',
  'Android Developer',
  'DevOps Engineer'
]

const DURATIONS = [
  { id: '1 Month', label: '1 Month', desc: 'Accelerated Core Path' },
  { id: '2 Months', label: '2 Months', desc: 'Balanced Mastery' },
  { id: '3 Months', label: '3 Months', desc: 'Comprehensive Prep' },
  { id: '6 Months', label: '6 Months', desc: 'In-Depth Foundation' },
  { id: '12 Months', label: '12 Months', desc: 'Complete Career Track' }
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

export default function PreferenceIntakeForm({ initialPreferences, onSubmit, onBackToLanding }: PreferenceIntakeFormProps) {
  const [targetRole, setTargetRole] = useState(initialPreferences?.targetRole || 'Full Stack Developer')
  const [duration, setDuration] = useState(initialPreferences?.duration || '3 Months')
  const [startDate, setStartDate] = useState(initialPreferences?.startDate || new Date().toISOString().split('T')[0])
  const [language, setLanguage] = useState(initialPreferences?.language || 'JavaScript')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      targetRole,
      duration,
      startDate,
      language
    })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#06080D] text-white flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
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
        className="w-full max-w-2xl bg-[#0D111A]/90 border border-cyan-500/30 p-8 rounded-3xl backdrop-blur-2xl shadow-[0_0_50px_rgba(0,210,255,0.15)] space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <div>
            <h1 className="text-xl font-black tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              Role Preference Setup
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Customize your role roadmap duration, start date, and language preferences.
            </p>
          </div>

          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="text-xs font-mono px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-cyan-500/40 text-zinc-400 hover:text-cyan-300 transition-all bg-white/5"
            >
              &larr; Solar System
            </button>
          )}
        </div>

        {/* 1. Target Role */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block font-mono">
            1. Target Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TARGET_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setTargetRole(role)}
                className={`p-3 text-xs text-left font-bold rounded-xl border transition-all ${
                  targetRole === role
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                    : 'bg-white/5 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Preparation Duration */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-purple-400 block font-mono">
            2. Preparation Duration
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {DURATIONS.map((dur) => (
              <button
                key={dur.id}
                type="button"
                onClick={() => setDuration(dur.id)}
                className={`p-3 text-xs text-left font-bold rounded-xl border transition-all ${
                  duration === dur.id
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-white/5 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div>{dur.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Learning Start Date */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 block font-mono">
            3. When are you planning to start learning?
          </label>
          <CustomDatePicker
            selectedDate={startDate}
            onChange={(dateStr) => setStartDate(dateStr)}
          />
        </div>

        {/* 4. Programming Language Preference */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block font-mono">
            4. Primary Programming Language
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                  language === lang
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
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
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(0,210,255,0.4)]"
          >
            Generate Role Roadmap &rarr;
          </button>
        </div>
      </form>
    </div>
  )
}
