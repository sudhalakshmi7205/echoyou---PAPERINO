'use client'

import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'

interface LatestScanCardProps {
  score: number
  targetRole: string
  companyName?: string
  searchabilityPassed: boolean
  formattingPassed: boolean
  skillsMatchPassed: boolean
  recruiterTipsPassed: boolean
  onViewReport: () => void
}

export default function LatestScanCard({
  score,
  targetRole,
  companyName,
  searchabilityPassed,
  formattingPassed,
  skillsMatchPassed,
  recruiterTipsPassed,
  onViewReport
}: LatestScanCardProps) {
  // Score ring color logic
  let ringColor = 'border-rose-500 text-rose-500'
  if (score >= 85) ringColor = 'border-[#2dd4bf] text-[#2dd4bf]'
  else if (score >= 70) ringColor = 'border-[#0f766e] text-[#0f766e]'
  else if (score >= 50) ringColor = 'border-amber-500 text-amber-500'

  const Badge = ({ passed, label }: { passed: boolean; label: string }) => (
    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-[11px] border ${
      passed 
        ? 'bg-[#2dd4bf]/12 border-[#0f766e]/30 text-[#2dd4bf]' 
        : 'bg-rose-900/10 border-rose-500/30 text-rose-400'
    }`}>
      {passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      <span className="font-medium truncate">{label}</span>
    </div>
  )

  return (
    <div className="bg-[#0f2b26] border border-[#2dd4bf]/20 rounded-3xl p-6 flex flex-col gap-6 w-full shadow-lg shadow-[#0f766e]/15">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold flex items-center gap-2">✨ Latest Resume Scan</h3>
        <button 
          onClick={onViewReport}
          className="p-1.5 hover:bg-[#2dd4bf]/15 rounded-full transition-colors text-zinc-400 hover:text-[#2dd4bf]"
          aria-label="View Report"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full border-[3px] flex items-center justify-center font-bold text-lg shrink-0 ${ringColor}`}>
          {score}
        </div>
        <div className="min-w-0">
          <h4 className="text-white font-bold truncate">{targetRole}</h4>
          {companyName && <p className="text-zinc-400 text-sm truncate">{companyName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto">
        <Badge passed={searchabilityPassed} label="Searchability" />
        <Badge passed={formattingPassed} label="Formatting" />
        <Badge passed={skillsMatchPassed} label="Skills Match" />
        <Badge passed={recruiterTipsPassed} label="Recruiter Tips" />
      </div>
    </div>
  )
}
