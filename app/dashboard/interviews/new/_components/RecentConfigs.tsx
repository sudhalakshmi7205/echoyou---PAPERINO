'use client'

import { Clock, RefreshCcw } from 'lucide-react'

export default function RecentConfigs({ interviews }: { interviews: any[] }) {
  if (!interviews || interviews.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Recent Configs</h3>
      </div>
      <div className="space-y-3">
        {interviews.map(i => (
          <button 
            key={i.id} 
            className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group flex items-start justify-between"
          >
            <div>
              <div className="font-medium text-sm text-gray-900 truncate max-w-[180px]">{i.role}</div>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                <span className="capitalize">{i.difficulty}</span>
                <span>&bull;</span>
                <span className="capitalize">{i.type.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <RefreshCcw className="w-3.5 h-3.5 text-gray-600" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
