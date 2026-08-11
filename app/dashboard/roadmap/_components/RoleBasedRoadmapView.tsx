'use client'

import React, { useState } from 'react'
import { UserPreferences } from './PreferenceIntakeForm'
import NodeDetailModal from './NodeDetailModal'
import { exportRoadmapToPdf } from './RoadmapPdfExporter'

interface RoleBasedRoadmapViewProps {
  preferences: UserPreferences
  studentName?: string
  onEditPreferences: () => void
}

interface CircuitMilestone {
  id: string
  badgeNumber: string
  title: string
  timelineDays: number
  timelineLabel: string
  subtopics: string[]
  description: string
  category: 'frontend' | 'backend' | 'tools' | 'projects' | 'core'
}

export default function RoleBasedRoadmapView({ preferences, studentName = 'Student', onEditPreferences }: RoleBasedRoadmapViewProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<CircuitMilestone | null>(null)
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({})
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  // Calculate duration multiplier in total days
  const getDurationDays = (durationStr: string): number => {
    switch (durationStr) {
      case '1 Month': return 30
      case '2 Months': return 60
      case '3 Months': return 90
      case '6 Months': return 180
      case '12 Months': return 365
      default: return 30
    }
  }

  const totalDays = getDurationDays(preferences.duration)

  // Generate 6 simplified essential milestone stages with explicit timelines
  const getEssentialMilestones = (): CircuitMilestone[] => {
    const role = preferences.targetRole || 'Full Stack Developer'
    const lang = preferences.language || 'JavaScript'

    // Calculate proportional timeline allocation (total 100%)
    // Stage 1: 15%, Stage 2: 20%, Stage 3: 15%, Stage 4A: 20%, Stage 4B: 15%, Stage 5: 15%
    const d1 = Math.max(3, Math.round(totalDays * 0.15))
    const d2 = Math.max(4, Math.round(totalDays * 0.20))
    const d3 = Math.max(3, Math.round(totalDays * 0.15))
    const d4a = Math.max(4, Math.round(totalDays * 0.20))
    const d4b = Math.max(3, Math.round(totalDays * 0.15))
    const d5 = Math.max(3, Math.round(totalDays * 0.15))

    return [
      {
        id: 'stage_1',
        badgeNumber: '1',
        title: 'WHAT IS WEB & COMPUTING',
        timelineDays: d1,
        timelineLabel: `Timeline: ${d1} Days (Week 1)`,
        subtopics: [
          'How Websites Work & HTTP Model',
          'Front-End vs Back-End Architecture',
          `Code Editor Setup & ${lang} Environment`
        ],
        description: `Understand client-server architecture, web protocols, and set up your ${lang} development environment.`,
        category: 'core'
      },
      {
        id: 'stage_2',
        badgeNumber: '2',
        title: 'BASIC FRONT-END',
        timelineDays: d2,
        timelineLabel: `Timeline: ${d2} Days (Week 1–2)`,
        subtopics: [
          'HTML5 Structure & Semantic Tags',
          'CSS3 Styling, Flexbox & Grid',
          `JavaScript / ${lang} Core Syntax`
        ],
        description: 'Build structured web layouts, style responsive interfaces, and write core interactive scripts.',
        category: 'frontend'
      },
      {
        id: 'stage_3',
        badgeNumber: '03',
        title: 'CORE TOOLS & VCS',
        timelineDays: d3,
        timelineLabel: `Timeline: ${d3} Days (Week 2–3)`,
        subtopics: [
          'Package Managers (npm / yarn)',
          'Build Tools & Bundlers (Vite)',
          'Version Control (Git & GitHub)'
        ],
        description: 'Manage project dependencies, configure modern build pipelines, and push code to GitHub repositories.',
        category: 'tools'
      },
      {
        id: 'stage_4a',
        badgeNumber: '4A',
        title: 'ADVANCED FRONT-END',
        timelineDays: d4a,
        timelineLabel: `Timeline: ${d4a} Days (Week 3–4)`,
        subtopics: [
          'React.js Component Architecture',
          'Responsive UI Frameworks (Tailwind CSS)',
          'State Management & API Fetching'
        ],
        description: 'Construct modern, high-performance web applications using React components and modern CSS utility frameworks.',
        category: 'frontend'
      },
      {
        id: 'stage_4b',
        badgeNumber: '4B',
        title: 'BASIC BACK-END & DB',
        timelineDays: d4b,
        timelineLabel: `Timeline: ${d4b} Days (Week 4–5)`,
        subtopics: [
          `Server Development (${lang} / Node.js)`,
          'RESTful API Endpoints & JSON Data',
          'Database Integration (PostgreSQL / MongoDB)'
        ],
        description: `Build backend API servers, process requests, and persist user data securely in SQL/NoSQL databases.`,
        category: 'backend'
      },
      {
        id: 'stage_5',
        badgeNumber: '5',
        title: 'PORTFOLIO & INTERVIEW PREP',
        timelineDays: d5,
        timelineLabel: `Timeline: ${d5} Days (Final Phase)`,
        subtopics: [
          `Deploy Production ${role} App`,
          'Resume Polish & GitHub Showcase',
          'Technical Coding & Mock Interviews'
        ],
        description: 'Ship 2 real-world capstone projects, optimize your technical resume, and clear interview coding rounds.',
        category: 'projects'
      }
    ]
  }

  const milestones = getEssentialMilestones()
  const completedCount = Object.values(completedMilestones).filter(Boolean).length

  const handleToggleDone = (id: string) => {
    setCompletedMilestones(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleExportPdf = async () => {
    setIsExportingPdf(true)
    await exportRoadmapToPdf({
      containerId: 'circuit-roadmap-view',
      studentName,
      roadmapTitle: `${preferences.targetRole} Simplified Roadmap`,
      completedCount,
      totalCount: milestones.length
    })
    setIsExportingPdf(false)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#06080D] text-white p-6 md:p-10 font-sans relative overflow-hidden select-none">
      
      {/* Background Dark Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#2a344a 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Main Header Banner */}
      <div className="w-full max-w-4xl mx-auto space-y-6 mb-12 relative z-10 border-b border-zinc-800 pb-8 text-center">
        
        {/* Navigation & Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onEditPreferences}
            className="text-xs font-mono px-4 py-2 rounded-xl border border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-white bg-white/5 transition-all"
          >
            &larr; Solar System
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
              Essential Roadmap Track
            </span>
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] disabled:opacity-50"
            >
              {isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 uppercase tracking-wider">
            {preferences.targetRole} Roadmap
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Track Duration: <span className="text-purple-400 font-bold">{preferences.duration}</span> ({totalDays} Days) | Language: <span className="text-amber-300 font-bold">{preferences.language}</span> | Start: <span className="text-emerald-400 font-bold">{preferences.startDate}</span>
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="inline-flex items-center gap-4 bg-[#0D111A]/90 border border-zinc-800 px-6 py-2.5 rounded-full backdrop-blur-xl">
          <span className="text-xs font-mono text-zinc-300">
            Progress: <strong className="text-[#00FF66]">{completedCount}/{milestones.length}</strong> Milestones Cleared
          </span>
          <div className="w-32 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${(completedCount / milestones.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Vertical Circuit Path Flowchart Container (Matching Reference Image 3) */}
      <div id="circuit-roadmap-view" className="w-full max-w-4xl mx-auto relative z-10 pb-16">
        
        {/* SVG Dual-Tone Glowing Central Circuit Line */}
        <div className="absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-2 pointer-events-none hidden md:block">
          <svg className="w-full h-full overflow-visible">
            <line
              x1="4"
              y1="0"
              x2="4"
              y2="100%"
              stroke="#00D2FF"
              strokeWidth="3"
              strokeDasharray="8 6"
              className="opacity-70"
            />
            <line
              x1="4"
              y1="0"
              x2="4"
              y2="100%"
              stroke="#3B82F6"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Vertical List of Circuit Milestones (Alternating 3-Column Grid) */}
        <div className="space-y-12 relative">
          {milestones.map((m, index) => {
            const isDone = Boolean(completedMilestones[m.id])
            
            // Sequential Lock Logic: Unlocked if index === 0 OR previous stage is completed
            const isUnlocked = index === 0 || Boolean(completedMilestones[milestones[index - 1].id])
            const isEven = index % 2 === 0

            return (
              <div 
                key={m.id}
                className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6"
              >
                {/* Col 1 (Left Card Slot on Desktop) */}
                <div className="w-full flex justify-end order-2 md:order-1">
                  {isEven ? (
                    <MilestoneCard 
                      milestone={m}
                      isDone={isDone}
                      isUnlocked={isUnlocked}
                      onToggleDone={() => {
                        if (isUnlocked || isDone) handleToggleDone(m.id)
                      }}
                    />
                  ) : (
                    <div className="hidden md:block w-full" />
                  )}
                </div>

                {/* Col 2 (Center Circular Badge on Central Line) */}
                <div className="relative z-20 flex justify-center order-1 md:order-2 shrink-0">
                  <div 
                    onClick={() => {
                      if (isUnlocked || isDone) handleToggleDone(m.id)
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-base transition-all border-2 shadow-2xl ${
                      isDone
                        ? 'bg-[#0A3A1B] border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer'
                        : isUnlocked
                        ? 'bg-white border-cyan-400 text-black shadow-[0_0_25px_rgba(0,210,255,0.4)] hover:scale-110 cursor-pointer'
                        : 'bg-[#0D111A] border-zinc-600 text-zinc-300 cursor-not-allowed'
                    }`}
                  >
                    {isDone ? '✓' : isUnlocked ? m.badgeNumber : '🔒'}
                  </div>
                </div>

                {/* Col 3 (Right Card Slot on Desktop) */}
                <div className="w-full flex justify-start order-3 md:order-3">
                  {!isEven ? (
                    <MilestoneCard 
                      milestone={m}
                      isDone={isDone}
                      isUnlocked={isUnlocked}
                      onToggleDone={() => {
                        if (isUnlocked || isDone) handleToggleDone(m.id)
                      }}
                    />
                  ) : (
                    <div className="hidden md:block w-full" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Inner Component for Milestone Card Box (Matching Image 3 layout)
function MilestoneCard({ 
  milestone, 
  isDone, 
  isUnlocked,
  onToggleDone 
}: { 
  milestone: CircuitMilestone
  isDone: boolean
  isUnlocked: boolean
  onToggleDone: () => void 
}) {
  return (
    <div
      className={`group border rounded-2xl p-5 space-y-3 transition-all backdrop-blur-xl shadow-xl ${
        isDone
          ? 'bg-[#0A3A1B]/70 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
          : isUnlocked
          ? 'bg-[#0D111A]/95 border-cyan-500/40 hover:border-cyan-400'
          : 'bg-[#0D111A]/95 border-zinc-800'
      }`}
    >
      {/* Title & Timeline Allocation Badge */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-800/80 pb-2.5 gap-2">
        <h3 className="text-sm font-black uppercase tracking-wider text-white">
          {milestone.title}
        </h3>

        {/* Prominent Task Timeline Badge */}
        <span className="text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
          ⏱️ {milestone.timelineLabel}
        </span>
      </div>

      {/* Subtopic Bullet List */}
      <div className="space-y-1.5 text-xs text-zinc-300">
        {milestone.subtopics.map((sub, i) => (
          <div key={i} className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-cyan-400 font-bold">&gt;</span>
            <span className="text-zinc-300">{sub}</span>
          </div>
        ))}
      </div>

      {/* Direct Mark Completed Toggle */}
      <div className="pt-2 flex justify-between items-center border-t border-zinc-800/40">
        <button
          onClick={onToggleDone}
          disabled={!isUnlocked && !isDone}
          className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-lg border transition-all ${
            isDone
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : isUnlocked
              ? 'bg-white/5 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20 cursor-pointer'
              : 'bg-zinc-900 text-zinc-400 border-zinc-700 cursor-not-allowed'
          }`}
        >
          {isDone ? 'Completed ✓' : isUnlocked ? 'Mark Completed' : 'Locked 🔒'}
        </button>

        {!isUnlocked && !isDone && (
          <span className="text-[10px] font-mono text-zinc-400 italic">
            Complete previous stage first
          </span>
        )}
      </div>
    </div>
  )
}
