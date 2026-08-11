'use client'
import { useMemo } from 'react'

export default function ActivityHeatmap({ data }: { data: Record<string, number> }) {
  // Generate last 90 days
  const days = useMemo(() => {
    const d = []
    for (let i = 89; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const key = date.toISOString().split('T')[0]
      d.push({
        date: key,
        count: data[key] || 0
      })
    }
    return d
  }, [data])

  function getColor(count: number) {
    if (count === 0) return 'bg-gray-800'
    if (count === 1) return 'bg-purple-900'
    if (count === 2) return 'bg-purple-700'
    if (count === 3) return 'bg-purple-500'
    return 'bg-cyan-400'
  }

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-1 min-w-[600px]">
        {/* We want a GitHub style grid, but a simple flex wrap or grid by weeks is fine. For simplicity, we'll just do a grid of 13 columns (approx 90 days) by 7 rows. */}
        {days.map((day, i) => (
          <div 
            key={i}
            className={`w-4 h-4 rounded-sm ${getColor(day.count)} transition-colors hover:ring-2 hover:ring-white`}
            title={`${day.date}: ${day.count} interviews`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-800" />
        <div className="w-3 h-3 rounded-sm bg-purple-900" />
        <div className="w-3 h-3 rounded-sm bg-purple-700" />
        <div className="w-3 h-3 rounded-sm bg-purple-500" />
        <div className="w-3 h-3 rounded-sm bg-cyan-400" />
        <span>More</span>
      </div>
    </div>
  )
}
