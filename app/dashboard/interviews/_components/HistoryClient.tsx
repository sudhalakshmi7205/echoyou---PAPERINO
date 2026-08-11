'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Search, Calendar, Clock, Trophy, 
  ChevronRight, Play, CheckCircle2, AlertCircle, 
  Sparkles, Filter, Video, Code, Users, Cpu, FileText
} from 'lucide-react'

interface InterviewRecord {
  id: string
  role: string
  type: string
  difficulty: string
  status: string
  score: number | null
  duration: number | null
  createdAt: string | Date
  report?: any
}

export default function HistoryClient({ interviews }: { interviews: InterviewRecord[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')

  const totalSessions = interviews.length
  const completedSessions = interviews.filter(i => i.status === 'completed')
  const avgScore = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((acc, curr) => acc + (curr.score || curr.report?.overallScore || 0), 0) / completedSessions.length)
    : 0
  const highestScore = completedSessions.length > 0
    ? Math.max(...completedSessions.map(i => i.score || i.report?.overallScore || 0))
    : 0

  const filteredInterviews = interviews.filter(item => {
    const matchesSearch = item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || item.type.toLowerCase().includes(activeCategory.toLowerCase())
    const matchesStatus = activeStatus === 'all' || item.status === activeStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getCategoryBadge = (type: string) => {
    const t = type.toLowerCase()
    if (t.includes('technical')) return { label: 'Technical', icon: Code, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' }
    if (t.includes('hr')) return { label: 'HR Round', icon: Users, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' }
    if (t.includes('system')) return { label: 'System Design', icon: Cpu, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' }
    if (t.includes('resume')) return { label: 'Resume QA', icon: FileText, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' }
    return { label: type, icon: Video, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
  }

  return (
    <div className="min-h-screen bg-[#05060B] text-white p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* ⬅️ HEADER NAV & BACK BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 hover:text-cyan-300 transition-all mb-3 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-cyan-400" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            📜 My Interview History
            <span className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-full">
              {totalSessions} Total Logs
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Review your past AI mock interview performances, score breakdowns, and detailed evaluation feedback.</p>
        </div>

        <Link
          href="/dashboard/interviews/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start New Session</span>
        </Link>
      </div>

      {/* 📊 STATS SUMMARY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Total Sessions</p>
            <p className="text-2xl font-black text-white">{totalSessions}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black text-emerald-400">{completedSessions.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Average Score</p>
            <p className="text-2xl font-black text-cyan-400">{avgScore}%</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Highest Score</p>
            <p className="text-2xl font-black text-amber-400">{highestScore}%</p>
          </div>
        </div>
      </div>

      {/* 🔍 SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by role name (e.g. Java, React, System Design)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'All Rounds' },
            { id: 'technical', label: 'Technical' },
            { id: 'hr', label: 'HR Fit' },
            { id: 'system', label: 'System Design' },
            { id: 'resume', label: 'Resume QA' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                  : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 INTERVIEWS LIST / CARDS */}
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No interview records match your filter</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">Try resetting your search query or start a new AI interview practice session now.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInterviews.map((record) => {
            const cat = getCategoryBadge(record.type)
            const Icon = cat.icon
            const displayScore = record.score !== null ? record.score : record.report?.overallScore || 0
            const isPassed = displayScore >= 50

            return (
              <div 
                key={record.id}
                className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.04] to-black/40 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 space-y-5 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${cat.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </span>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                      record.status === 'completed' 
                        ? isPassed 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {record.status === 'completed' ? (isPassed ? 'Passed ✓' : 'Needs Practice') : 'In Progress'}
                    </span>
                  </div>

                  {/* Role Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {record.role}
                  </h3>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {record.duration && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{record.duration} mins</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score & Action Row */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Overall Score</span>
                    <p className={`text-2xl font-black ${
                      displayScore >= 75 ? 'text-emerald-400' : displayScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {record.status === 'completed' ? `${displayScore}%` : '--'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {record.status === 'completed' ? (
                      <Link
                        href={`/dashboard/interviews/${record.id}/report`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-all"
                      >
                        <span>View Report</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/interviews/${record.id}/session`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
                      >
                        <span>Resume</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
