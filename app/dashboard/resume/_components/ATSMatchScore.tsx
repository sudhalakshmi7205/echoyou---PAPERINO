'use client'
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight } from 'lucide-react'

export default function ATSMatchScore({ analysis }: { analysis: any }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-400'
    if (score >= 60) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  return (
    <div className="bg-[#111620] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-48 h-48 fill-cyan-500">
          <path d="M50 0 C22.4 0 0 22.4 0 50 C0 77.6 22.4 100 50 100 C77.6 100 100 77.6 100 50 C100 22.4 77.6 0 50 0 Z M50 90 C27.9 90 10 72.1 10 50 C10 27.9 27.9 10 50 10 C72.1 10 90 27.9 90 50 C90 72.1 72.1 90 50 90 Z M45 25 L45 55 L70 70 L75 60 L55 48 L55 25 L45 25 Z" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        
        {/* Main Score Circle */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1F2937" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" 
                stroke="currentColor" 
                strokeWidth="8" 
                strokeDasharray={`${(analysis.matchScore / 100) * 283} 283`}
                className={`transition-all duration-1000 ease-out ${getScoreColor(analysis.matchScore)} drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(analysis.matchScore)}`}>{analysis.matchScore}%</span>
              <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Match Score</span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">ATS Analysis Results</h2>
            <p className="text-gray-400 text-sm line-clamp-2">Targeting: {analysis.targetRole}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2230] rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Format Score</span>
                <span className={`text-sm font-bold ${getScoreColor(analysis.formatScore)}`}>{analysis.formatScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${getScoreBg(analysis.formatScore)}`} style={{ width: `${analysis.formatScore}%` }} />
              </div>
            </div>
            
            <div className="bg-[#1A2230] rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Keyword Score</span>
                <span className={`text-sm font-bold ${getScoreColor(analysis.keywordScore)}`}>{analysis.keywordScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${getScoreBg(analysis.keywordScore)}`} style={{ width: `${analysis.keywordScore}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Missing Keywords */}
        <div className="bg-[#1A2230]/50 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords?.length > 0 ? (
              analysis.missingKeywords.map((kw: string, i: number) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">Perfect keyword match!</span>
            )}
          </div>
        </div>

        {/* Actionable Steps */}
        <div className="bg-[#1A2230]/50 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            Actionable Steps
          </h3>
          <ul className="space-y-3">
            {analysis.feedback?.actionableSteps?.map((step: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <ChevronRight className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
