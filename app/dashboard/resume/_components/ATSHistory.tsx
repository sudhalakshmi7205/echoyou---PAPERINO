'use me'
'use client'

import React, { useState } from 'react'
import { History, Star, Download, Trash2, TrendingUp, TrendingDown, ArrowRight, FileText, Briefcase } from 'lucide-react'

export interface ATSHistoryRecord {
  id: string
  resumeId: string
  targetRole: string
  jobDescription: string
  matchScore: number
  formatScore: number
  keywordScore: number
  missingKeywords: string[]
  feedback: any
  createdAt: Date
}

interface ATSHistoryProps {
  history: ATSHistoryRecord[]
  activeId?: string
  onSelectScan: (scan: ATSHistoryRecord) => void
  onDeleteScan: (id: string, e: React.MouseEvent) => void
  resumes: Array<{ id: string; fileName: string; fileUrl?: string }>
}

export default function ATSHistory({
  history,
  activeId,
  onSelectScan,
  onDeleteScan,
  resumes
}: ATSHistoryProps) {
  const [filterRole, setFilterRole] = useState<string>('all')

  // Group history records by targetRole / Job Description
  const groupedByJD = history.reduce<Record<string, ATSHistoryRecord[]>>((acc, record) => {
    const key = record.targetRole || 'General Resume Scan'
    if (!acc[key]) acc[key] = []
    acc[key].push(record)
    return acc
  }, {})

  // Compute best match per JD group
  const bestMatchIdMap: Record<string, string> = {}
  Object.entries(groupedByJD).forEach(([key, records]) => {
    if (records.length > 0) {
      const best = [...records].sort((a, b) => b.matchScore - a.matchScore)[0]
      bestMatchIdMap[key] = best.id
    }
  })

  // Download handler with custom filename e.g. Resume_78%_GoogleSWE.pdf
  const handleDownloadOriginal = (record: ATSHistoryRecord, e: React.MouseEvent) => {
    e.stopPropagation()
    const resumeObj = resumes.find(r => r.id === record.resumeId)
    const downloadUrl = resumeObj?.fileUrl || '/api/resume/download'
    const safeRole = record.targetRole.replace(/[^a-zA-Z0-9]/g, '_')
    const customFilename = `Resume_${record.matchScore}%_${safeRole}.pdf`

    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = customFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const jdKeys = Object.keys(groupedByJD)

  return (
    <div className="p-6 rounded-3xl bg-[#081311] border border-[#0f766e]/30 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <History className="w-4 h-4 text-[#2dd4bf]" />
            <span>Jobscan Resume Version History</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Scans grouped by Target Role & Job Description. Compare version improvements against identical JD requirements.</p>
        </div>

        {/* Filter Dropdown */}
        {jdKeys.length > 1 && (
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-[#04120f] border border-[#2dd4bf]/30 rounded-xl px-3 py-1.5 text-xs text-[#2dd4bf] font-bold focus:outline-none"
          >
            <option value="all">All Job Descriptions ({history.length} scans)</option>
            {jdKeys.map((key) => (
              <option key={key} value={key}>
                {key} ({groupedByJD[key].length})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-1">
        {jdKeys
          .filter(key => filterRole === 'all' || filterRole === key)
          .map((jdKey) => {
            const records = groupedByJD[jdKey]
            const sortedRecords = [...records].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            return (
              <div key={jdKey} className="space-y-3 p-4 rounded-2xl bg-[#04120f]/60 border border-[#0f766e]/30">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-[#2dd4bf]" />
                    <span>{jdKey}</span>
                    <span className="text-[10px] text-zinc-400 font-mono font-normal">({records.length} versions checked)</span>
                  </h4>
                </div>

                <div className="space-y-2">
                  {sortedRecords.map((record, index) => {
                    const isBest = bestMatchIdMap[jdKey] === record.id
                    const isActive = activeId === record.id

                    // Calculate delta against previous version in the same JD group
                    const prevRecord = sortedRecords[index + 1]
                    const delta = prevRecord ? record.matchScore - prevRecord.matchScore : null

                    return (
                      <div
                        key={record.id}
                        onClick={() => onSelectScan(record)}
                        className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 overflow-hidden ${
                          isActive
                            ? 'bg-[#0f766e]/30 border-[#2dd4bf] shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                            : 'bg-white/[0.02] border-white/10 hover:border-[#2dd4bf]/40'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3 min-w-0 max-w-full">
                          {/* Score Badge */}
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center font-mono font-black text-xs sm:text-sm border shrink-0 ${
                            record.matchScore >= 85
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : record.matchScore >= 70
                              ? 'bg-[#2dd4bf]/20 text-[#2dd4bf] border-[#2dd4bf]/40'
                              : record.matchScore >= 50
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            <span>{record.matchScore}%</span>
                          </div>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="text-xs font-bold text-white truncate max-w-[150px] sm:max-w-xs">
                                {resumes.find(r => r.id === record.resumeId)?.fileName || 'Candidate Resume'}
                              </span>

                              {isBest && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold flex items-center gap-1 shrink-0">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>⭐ Best Match</span>
                                </span>
                              )}

                              {delta !== null && delta !== 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-1 shrink-0 ${
                                  delta > 0
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}>
                                  {delta > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                                  <span>{delta > 0 ? `+${delta}% ↑` : `${delta}% ↓`}</span>
                                </span>
                              )}
                            </div>

                            <p className="text-[10px] text-zinc-400 font-mono">
                              Checked on {(() => {
                                const d = new Date(record.createdAt)
                                return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`
                              })()}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            onClick={(e) => handleDownloadOriginal(record, e)}
                            title="Download Stored Original PDF/DOCX"
                            className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-[#2dd4bf]/20 border border-white/10 text-zinc-300 hover:text-[#2dd4bf] transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => onDeleteScan(record.id, e)}
                            title="Delete scan from history"
                            className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/10 text-zinc-400 hover:text-rose-400 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

        {history.length === 0 && (
          <div className="text-center py-8 text-zinc-400 text-xs">
            <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            No previous ATS history records found.
          </div>
        )}
      </div>
    </div>
  )
}
