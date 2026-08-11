'use client'

import { TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function PerformanceOverview({ interviews }: { interviews: any[] }) {
  // Filter for completed interviews with a score
  const completedInterviews = [...interviews]
    .filter(i => i.status === 'completed' && i.score !== null)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const data = completedInterviews.map((i, index) => ({
    name: `Int ${index + 1}`,
    date: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: Math.round(i.score || 0)
  }))

  return (
    <div className="bg-[#111620]/60 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-sm p-6 h-full flex flex-col min-h-[300px]">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-gray-100">Performance Trend</h2>
      </div>
      
      {data.length < 2 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/30 p-4 text-center">
          <p className="text-sm text-gray-500 font-medium">Complete at least 2 interviews to see your trend.</p>
        </div>
      ) : (
        <div className="flex-1 w-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#f3f4f6' }}
                itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                cursor={{ stroke: '#374151', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#a855f7" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0B0E14', stroke: '#a855f7', strokeWidth: 2 }} 
                activeDot={{ r: 6, fill: '#06b6d4', stroke: '#06b6d4', strokeWidth: 0 }} 
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
