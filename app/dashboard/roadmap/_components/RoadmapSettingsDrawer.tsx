'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, Save, ArrowLeft, Plus, Minus } from 'lucide-react'

export interface RoadmapSettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  preferences: {
    universe: string
    language: string
    role?: string
    company?: string
    dailyHours: number
    duration?: string
    goal: string
    experience?: string
    learningStyle: string
    startDate: string
    dsaDifficulty?: string
    dsaTarget?: string
    csSubjects?: string[]
  }
  onSave: (updatedPreferences: any) => void
  onChangeUniverse: () => void
}

export function RoadmapSettingsDrawer({
  isOpen,
  onClose,
  preferences,
  onSave,
  onChangeUniverse
}: RoadmapSettingsDrawerProps) {
  const [formData, setFormData] = useState(preferences)

  useEffect(() => {
    if (isOpen) {
      setFormData(preferences)
    }
  }, [isOpen, preferences])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const isRoleUniverse = formData.universe === 'role' || formData.universe === 'Role & Career'
  const isDsaUniverse = formData.universe === 'dsa' || formData.universe === 'DSA & Coding'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[420px] max-w-full z-50 bg-[#0B0E14]/95 backdrop-blur-2xl border-l border-white/[0.08] flex flex-col shadow-[0_0_50px_rgba(138,92,255,0.15)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-medium text-white">Roadmap Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Universe (Display only) */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Universe</label>
                <div className="bg-[#1a1f2e]/50 border border-white/5 rounded-xl p-3 text-gray-400 cursor-not-allowed">
                  {formData.universe}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Primary Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                >
                  <option value="">Select Language</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Go">Go</option>
                  <option value="C#">C#</option>
                  <option value="Rust">Rust</option>
                </select>
              </div>

              {/* Role & Company (If Role Universe) */}
              {isRoleUniverse && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Target Role</label>
                    <input
                      type="text"
                      value={formData.role || ''}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50"
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Target Company / Tier</label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50"
                      placeholder="e.g. FAANG, Startup"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Experience Level</label>
                    <select
                      value={formData.experience || ''}
                      onChange={(e) => handleChange('experience', e.target.value)}
                      className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </>
              )}

              {/* DSA specific */}
              {isDsaUniverse && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">DSA Difficulty</label>
                    <select
                      value={formData.dsaDifficulty || ''}
                      onChange={(e) => handleChange('dsaDifficulty', e.target.value)}
                      className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </>
              )}

              {/* Daily Hours */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Daily Commitment (Hours)</label>
                <div className="flex items-center gap-4 bg-[#1a1f2e] border border-white/10 rounded-xl p-2">
                  <button 
                    onClick={() => handleChange('dailyHours', Math.max(1, formData.dailyHours - 1))}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center text-white font-medium">
                    {formData.dailyHours} hr{formData.dailyHours !== 1 ? 's' : ''}
                  </span>
                  <button 
                    onClick={() => handleChange('dailyHours', Math.min(24, formData.dailyHours + 1))}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Timeline</label>
                <select
                  value={formData.duration || ''}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                >
                  <option value="1 Month">1 Month</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>

              {/* Goal */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Primary Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => handleChange('goal', e.target.value)}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                >
                  <option value="Placement">Placement / Job Hunt</option>
                  <option value="Internship">Internship</option>
                  <option value="Switch Company">Switch Company</option>
                  <option value="Skill Up">Skill Up / Upskill</option>
                </select>
              </div>

              {/* Learning Style */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Learning Style</label>
                <select
                  value={formData.learningStyle}
                  onChange={(e) => handleChange('learningStyle', e.target.value)}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                >
                  <option value="Mixed">Mixed (Videos + Reading)</option>
                  <option value="Videos">Video Tutorials</option>
                  <option value="Reading">Documentation / Reading</option>
                  <option value="Interactive">Interactive Coding</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/[0.08] space-y-4 bg-[#0B0E14] shrink-0">
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(138,92,255,0.3)]"
              >
                <Save className="w-4 h-4" />
                Save & Regenerate Roadmap
              </button>
              
              <button
                onClick={onChangeUniverse}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Universe
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
