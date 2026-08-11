'use client'

import { CheckCircle2, XCircle, FileText, Briefcase, Building, Calendar, ArrowUp, ArrowDown } from 'lucide-react'

interface MatchRateHeroProps {
  score: number
  matchBand: string
  statusLevel: string
  explanation: string
  disclaimer?: string
  resumeName: string
  targetRole: string
  companyName?: string
  dateAnalyzed: string
  prevScore?: number | null
  searchabilityPassed: boolean
  formattingPassed: boolean
  hardSkillsPassed: boolean
  softSkillsPassed: boolean
  recruiterTipsPassed: boolean
  onScanAgain: () => void
}

export default function MatchRateHero({
  score,
  matchBand,
  statusLevel,
  explanation,
  disclaimer = 'This is a guidance estimate — actual ATS behavior varies by company.',
  resumeName,
  targetRole,
  companyName,
  dateAnalyzed,
  prevScore,
  searchabilityPassed,
  formattingPassed,
  hardSkillsPassed,
  softSkillsPassed,
  recruiterTipsPassed,
  onScanAgain
}: MatchRateHeroProps) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const Badge = ({ passed, label }: { passed: boolean; label: string }) => (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
      passed 
        ? 'bg-[#2dd4bf]/12 border-[#0f766e]/40 text-[#2dd4bf]' 
        : 'bg-rose-900/20 border-rose-500/30 text-rose-400'
    }`}>
      {passed ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
      <span className="truncate">{label}</span>
    </div>
  )

  const scoreDiff = prevScore !== null && prevScore !== undefined ? score - prevScore : 0
  
  return (
    <div className="bg-[#0f2b26] border border-[#2dd4bf]/20 rounded-3xl p-8 flex flex-col items-center relative overflow-hidden shadow-xl shadow-[#0f766e]/20">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#2dd4bf]/8 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-[#2dd4bf]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      {/* Target Info Bar */}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs text-zinc-400 mb-8 w-full max-w-4xl border-b border-[#2dd4bf]/15 pb-4 relative z-10">
        <div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#0f766e]" /> <span className="truncate max-w-[200px]">{resumeName}</span></div>
        <span className="text-[#0f766e]">•</span>
        <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-[#0f766e]" /> <span className="truncate max-w-[200px]">{targetRole}</span></div>
        {companyName && (
          <>
            <span className="text-[#0f766e]">•</span>
            <div className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-[#0f766e]" /> <span className="truncate max-w-[150px]">{companyName}</span></div>
          </>
        )}
        <span className="text-[#0f766e]">•</span>
        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#0f766e]" /> {dateAnalyzed}</div>
      </div>

      {/* Hero Content */}
      <div className="flex flex-col md:flex-row items-center gap-12 w-full max-w-4xl justify-between relative z-10">
        
        {/* Left side: Gauge */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform absolute inset-0" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-[#0f766e]/20"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-[#2dd4bf] transition-all duration-1000 ease-out"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                style={{ strokeDasharray: circumference, strokeDashoffset }}
              />
            </svg>
            <div className="text-4xl font-bold text-white z-10">{score}%</div>
          </div>
          <div className="mt-4 text-lg font-medium text-white">Match Rate</div>
          <div className="mt-2 px-4 py-1.5 rounded-full bg-[#0d2420] text-[#2dd4bf] text-sm font-semibold border border-[#0f766e]/40 shadow-inner">
            {matchBand}
          </div>
          
          {scoreDiff !== 0 && (
            <div className={`mt-3 flex items-center gap-1 text-sm font-medium ${scoreDiff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {scoreDiff > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(scoreDiff)}% {scoreDiff > 0 ? '↑ from last scan' : '↓'}
            </div>
          )}
        </div>

        {/* Right side: Summary & Action */}
        <div className="flex flex-col flex-1 gap-6 min-w-0">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">{statusLevel}</h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{explanation}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Badge passed={searchabilityPassed} label="Searchability" />
            <Badge passed={formattingPassed} label="Formatting" />
            <Badge passed={hardSkillsPassed} label="Hard Skills" />
            <Badge passed={softSkillsPassed} label="Soft Skills" />
            <Badge passed={recruiterTipsPassed} label="Recruiter Tips" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-6 border-t border-[#2dd4bf]/15">
            <span className="italic text-zinc-500 text-xs md:text-sm max-w-sm">{disclaimer}</span>
            <button 
              onClick={onScanAgain}
              className="shrink-0 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0f766e] to-[#2dd4bf] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#0f766e]/20"
            >
              Scan Again
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
