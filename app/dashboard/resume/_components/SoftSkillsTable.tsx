'use client'

import React from 'react'
import { Users, Check, X } from 'lucide-react'

interface SoftSkillsTableProps {
  matchedSoftSkills: string[]
  missingSoftSkills: string[]
}

export default function SoftSkillsTable({
  matchedSoftSkills,
  missingSoftSkills
}: SoftSkillsTableProps) {
  const totalSkills = matchedSoftSkills.length + missingSoftSkills.length
  
  return (
    <div className="bg-[#0f2b26] border border-[#2dd4bf]/20 rounded-3xl p-6 md:p-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#2dd4bf]/15 rounded-xl">
          <Users className="w-6 h-6 text-[#2dd4bf]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Soft Skills</h2>
          <p className="text-zinc-400 text-sm">
            {matchedSoftSkills.length} of {totalSkills} skills found
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
            {matchedSoftSkills.map((skill, idx) => (
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

            {missingSoftSkills.map((skill, idx) => (
              <tr key={`missing-${idx}`} className="bg-rose-500/5 border-l-2 border-l-rose-500">
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
        <span className="text-[#2dd4bf] font-medium">{matchedSoftSkills.length} matched</span>
        <span>&middot;</span>
        <span className="text-rose-500 font-medium">{missingSoftSkills.length} missing</span>
      </div>
    </div>
  )
}
