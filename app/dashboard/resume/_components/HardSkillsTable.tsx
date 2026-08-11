'use client'

import React from 'react'
import { Code2, Check, X, Zap } from 'lucide-react'

interface HardSkillsTableProps {
  matchedKeywords: string[]
  criticalMissing: string[]
  niceToHaveMissing: string[]
  partialKeywords: { keyword: string; matchedAs: string; note: string }[]
}

export default function HardSkillsTable({
  matchedKeywords,
  criticalMissing,
  niceToHaveMissing,
  partialKeywords
}: HardSkillsTableProps) {
  const totalSkills = matchedKeywords.length + criticalMissing.length + niceToHaveMissing.length + partialKeywords.length
  
  return (
    <div className="bg-[#0f2b26] border border-[#2dd4bf]/20 rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#2dd4bf]/15 rounded-xl">
          <Code2 className="w-6 h-6 text-[#2dd4bf]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Hard Skills</h2>
          <p className="text-zinc-400 text-sm">
            {matchedKeywords.length} of {totalSkills} skills found
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2dd4bf]/15 text-xs uppercase tracking-wider text-zinc-400">
              <th className="py-4 pl-4 pr-2 font-medium">Skills</th>
              <th className="py-4 px-2 font-medium">In JD</th>
              <th className="py-4 px-2 font-medium">In Resume</th>
              <th className="py-4 px-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2dd4bf]/10">
            {matchedKeywords.map((skill, idx) => (
              <tr key={`matched-${idx}`} className="bg-[#2dd4bf]/5 border-l-2 border-l-[#2dd4bf]">
                <td className="py-4 pl-4 pr-2 text-white font-medium">{skill}</td>
                <td className="py-4 px-2"><Check className="w-5 h-5 text-[#2dd4bf]" /></td>
                <td className="py-4 px-2"><Check className="w-5 h-5 text-[#2dd4bf]" /></td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-[#2dd4bf]/10 text-[#2dd4bf]">
                    Found
                  </span>
                </td>
              </tr>
            ))}
            
            {partialKeywords.map((item, idx) => (
              <tr key={`partial-${idx}`} className="bg-amber-500/5 border-l-2 border-l-amber-500">
                <td className="py-4 pl-4 pr-2">
                  <div className="text-white font-medium">{item.keyword}</div>
                  <div className="text-xs text-zinc-500 mt-1">Matched as "{item.matchedAs}"</div>
                </td>
                <td className="py-4 px-2"><Check className="w-5 h-5 text-amber-500" /></td>
                <td className="py-4 px-2"><Zap className="w-5 h-5 text-amber-500" /></td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-500">
                    Partial
                  </span>
                </td>
              </tr>
            ))}

            {criticalMissing.map((skill, idx) => (
              <tr key={`critical-${idx}`} className="bg-rose-500/5 border-l-2 border-l-rose-500">
                <td className="py-4 pl-4 pr-2 text-white font-medium">{skill}</td>
                <td className="py-4 px-2"><Check className="w-5 h-5 text-zinc-500" /></td>
                <td className="py-4 px-2"><X className="w-5 h-5 text-rose-500" /></td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-rose-500/10 text-rose-500">
                    Missing
                  </span>
                </td>
              </tr>
            ))}

            {niceToHaveMissing.map((skill, idx) => (
              <tr key={`nice-${idx}`} className="bg-rose-500/5 border-l-2 border-l-rose-500">
                <td className="py-4 pl-4 pr-2 text-white font-medium">{skill}</td>
                <td className="py-4 px-2"><Check className="w-5 h-5 text-zinc-500" /></td>
                <td className="py-4 px-2"><X className="w-5 h-5 text-rose-500" /></td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-rose-500/10 text-rose-500">
                    Missing
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-[#2dd4bf]/20 flex justify-center items-center text-sm text-zinc-400 gap-2">
        <span className="text-[#2dd4bf] font-medium">{matchedKeywords.length} matched</span>
        <span>&middot;</span>
        <span className="text-rose-500 font-medium">{criticalMissing.length + niceToHaveMissing.length} missing</span>
        <span>&middot;</span>
        <span className="text-amber-500 font-medium">{partialKeywords.length} partial</span>
      </div>
    </div>
  )
}
