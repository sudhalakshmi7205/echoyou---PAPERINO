'use client'
import { useState } from 'react'

export default function ImprovementPlan({ plan }: { plan: any }) {
  const [activeTab, setActiveTab] = useState<'30' | '60' | '90' | 'resources'>('30')

  if (!plan) return null

  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Improvement Plan</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: '30', label: '30 days' },
          { id: '60', label: '60 days' },
          { id: '90', label: '90 days' },
          { id: 'resources', label: 'Resources' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeTab === tab.id 
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' 
                : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-800 min-h-[120px]">
        {activeTab === '30' && (
          <div className="text-sm text-gray-300 leading-relaxed">{plan.thirtyDay || "No specific 30-day plan provided."}</div>
        )}
        {activeTab === '60' && (
          <div className="text-sm text-gray-300 leading-relaxed">{plan.sixtyDay || "No specific 60-day plan provided."}</div>
        )}
        {activeTab === '90' && (
          <div className="text-sm text-gray-300 leading-relaxed">{plan.ninetyDay || "No specific 90-day plan provided."}</div>
        )}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            {plan.resources?.map((r: any, i: number) => (
              <div key={i} className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/50">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-medium text-indigo-300 text-sm">{r.title}</div>
                  <div className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-gray-800 text-gray-400">{r.type}</div>
                </div>
                <div className="text-xs text-gray-400 leading-relaxed">{r.reason}</div>
              </div>
            ))}
            {(!plan.resources || plan.resources.length === 0) && (
              <div className="text-sm text-gray-500 italic">No specific resources recommended.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
