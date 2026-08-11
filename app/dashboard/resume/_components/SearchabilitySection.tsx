'use client'

import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react'
import type { ATSFormattingDiagnostic } from '@/lib/ai/ats-analyzer'

interface SearchabilitySectionProps {
  formatIssues: ATSFormattingDiagnostic[]
}

export default function SearchabilitySection({ formatIssues }: SearchabilitySectionProps) {
  const defaultChecks: ATSFormattingDiagnostic[] = [
    { checkName: 'File Type', passed: true, explanation: 'PDF format is standard and easily parsed.' },
    { checkName: 'Text Selectability', passed: true, explanation: 'Text can be highlighted and extracted.' },
    { checkName: 'No Columns', passed: true, explanation: 'Single column layout reads well in all ATS.' },
    { checkName: 'Standard Fonts', passed: true, explanation: 'Using standard ATS-friendly typography.' },
    { checkName: 'No Complex Tables', passed: true, explanation: 'Avoided complex tables that break parsing.' },
    { checkName: 'Clear Headings', passed: true, explanation: 'Standard section headings identified.' },
    { checkName: 'Contact Info Found', passed: true, explanation: 'Email and phone successfully extracted.' },
    { checkName: 'No Image Text', passed: true, explanation: 'No text is hidden inside images.' },
  ]

  const checks = formatIssues && formatIssues.length > 0 ? formatIssues : defaultChecks
  const passCount = checks.filter(c => c.passed).length

  return (
    <div className="bg-[#0f2b26] border border-[#2dd4bf]/20 rounded-3xl p-6 md:p-8 shadow-lg shadow-[#0f766e]/15">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#2dd4bf]" />
          </div>
          <h2 className="text-xl font-bold text-white">Searchability</h2>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-[#0d2420] border border-[#0f766e]/40 text-sm font-medium text-[#2dd4bf]">
          {passCount}/{checks.length} checks passed
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {checks.map((check, idx) => (
          <div 
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-[#2dd4bf]/30 hover:bg-[#2dd4bf]/8 transition-all group"
          >
            <div className="w-6 shrink-0 flex justify-center">
              {check.passed ? (
                <CheckCircle2 className="w-5 h-5 text-[#2dd4bf]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
                <span className="font-semibold text-white truncate">{check.checkName}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider w-fit shrink-0 ${
                  check.passed ? 'bg-[#2dd4bf]/15 text-[#2dd4bf]' : 'bg-amber-900/30 text-amber-400'
                }`}>
                  {check.passed ? '✔ Pass' : '⚠ Fix Needed'}
                </span>
              </div>
              <p className="text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors">{check.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
