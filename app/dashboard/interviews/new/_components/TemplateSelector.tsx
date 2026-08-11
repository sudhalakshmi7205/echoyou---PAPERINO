'use client'

import { InterviewTemplate } from '@prisma/client'
import { Bookmark, Clock, Play } from 'lucide-react'

export default function TemplateSelector({ templates }: { templates: InterviewTemplate[] }) {
  if (!templates || templates.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">Pre-built Templates</h3>
      </div>
      <div className="space-y-3">
        {templates.map(t => (
          <button 
            key={t.id} 
            className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors group flex items-start justify-between"
          >
            <div>
              <div className="font-medium text-sm text-gray-900">{t.name}</div>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                <span className="capitalize">{t.type.replace('_', ' ')}</span>
                <span>&bull;</span>
                <span>{t.duration}m</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-3.5 h-3.5 text-purple-600 ml-0.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
