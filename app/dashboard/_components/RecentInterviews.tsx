'use client'

import { useState } from 'react'
import { PlayCircle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default function RecentInterviews({ interviews }: { interviews: any[] }) {
  const [tab, setTab] = useState<'all' | 'completed' | 'draft'>('all')

  const filtered = interviews.filter(i => {
    if (tab === 'all') return true
    return i.status === tab
  })

  return (
    <div className="bg-[#111620] border border-gray-800/60 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800/60 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-100">Recent Interviews</h2>
        <div className="flex bg-[#0B0E14] p-1 rounded-lg border border-gray-800">
          <button 
            onClick={() => setTab('all')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${tab === 'all' ? 'bg-[#1A2235] font-semibold text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            All
          </button>
          <button 
            onClick={() => setTab('completed')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${tab === 'completed' ? 'bg-[#1A2235] font-semibold text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Completed
          </button>
          <button 
            onClick={() => setTab('draft')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${tab === 'draft' ? 'bg-[#1A2235] font-semibold text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Drafts
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-800/60">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No interviews found in this category.
          </div>
        ) : (
          filtered.map(interview => (
            <Link 
              key={interview.id} 
              href={`/interview/${interview.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#1A2235]/40 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border transition-colors ${
                  interview.status === 'completed' ? 'bg-cyan-950/30 text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/50' : 
                  interview.status === 'in_progress' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/50' : 
                  'bg-gray-900 text-gray-500 border-gray-800'
                }`}>
                  {interview.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : 
                   interview.status === 'in_progress' ? <PlayCircle className="w-5 h-5" /> : 
                   <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors">{interview.role}</h3>
                  <p className="text-sm text-gray-500 capitalize">{interview.type.replace('_', ' ')} • {interview.difficulty}</p>
                </div>
              </div>
              <div className="text-right">
                {interview.score !== null ? (
                  <span className="font-bold text-gray-100">{Math.round(interview.score)}%</span>
                ) : (
                  <span className="text-sm text-gray-500 capitalize">{interview.status.replace('_', ' ')}</span>
                )}
                <p className="text-xs text-gray-500 mt-1" suppressHydrationWarning>{new Date(interview.createdAt).toLocaleDateString()}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
