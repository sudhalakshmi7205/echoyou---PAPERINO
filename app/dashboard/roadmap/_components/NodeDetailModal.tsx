'use client'

import React from 'react'

export interface RoadmapNodeData {
  id: string
  title: string
  description: string
  category: 'role' | 'dsa' | 'cs'
  status: 'locked' | 'unlocked' | 'in_progress' | 'done'
  parentId?: string
  branchParentId?: string
  resources?: { name: string; url: string; type: string }[]
  practiceLink?: string
}

interface NodeDetailModalProps {
  node: RoadmapNodeData
  onClose: () => void
  onToggleDone: (nodeId: string, currentStatus: string) => void
}

export default function NodeDetailModal({ node, onClose, onToggleDone }: NodeDetailModalProps) {
  const isDone = node.status === 'done'
  const isLocked = node.status === 'locked'

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 font-sans">
      <div className="bg-black border border-zinc-800 w-full max-w-lg p-6 space-y-6 relative text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xs font-mono px-2 py-1 border border-zinc-800 hover:border-zinc-700"
        >
          [ X ]
        </button>

        {/* Header */}
        <div className="space-y-2 pr-12">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
              isDone 
                ? 'bg-[#0A3A1B] text-[#00FF66] border-[#00FF66]' 
                : isLocked 
                ? 'bg-zinc-900 text-zinc-500 border-zinc-800' 
                : 'bg-black text-[#00FF66] border-[#00FF66]'
            }`}>
              {isDone ? 'Done' : isLocked ? 'Locked' : 'Active / Available'}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
              {node.category.toUpperCase()} NODE
            </span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">{node.title}</h2>
        </div>

        {/* Description */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 text-xs text-zinc-300 leading-relaxed">
          {node.description || 'Core technical concept for your interview preparation roadmap.'}
        </div>

        {/* Resources & Links */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Learning Resources & Practice
          </span>

          <div className="space-y-1.5 text-xs">
            {node.resources && node.resources.length > 0 ? (
              node.resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-black border border-zinc-800 hover:border-zinc-600 p-2.5 text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span className="font-mono text-[11px]">{res.name}</span>
                  <span className="text-[10px] text-[#00FF66] uppercase">{res.type} &rarr;</span>
                </a>
              ))
            ) : (
              <a
                href={node.practiceLink || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(node.title)}`}
                target="_blank"
                rel="noreferrer"
                className="block bg-black border border-zinc-800 hover:border-zinc-600 p-2.5 text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
              >
                <span className="font-mono text-[11px]">Practice {node.title} Problems</span>
                <span className="text-[10px] text-[#00FF66] uppercase">Open Link &rarr;</span>
              </a>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black border border-zinc-800 text-zinc-400 hover:text-white text-xs uppercase"
          >
            Close
          </button>

          {!isLocked && (
            <button
              onClick={() => onToggleDone(node.id, node.status)}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                isDone 
                  ? 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                  : 'bg-[#00FF66] text-black hover:bg-[#00DD55]'
              }`}
            >
              {isDone ? 'Mark as In Progress' : 'Mark as Done'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
