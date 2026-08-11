'use client'

import { useMemo } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { format, parseISO, subDays } from 'date-fns'
import { Code2, Target, Brain, TrendingUp, AlertTriangle, Zap, Calendar as CalendarIcon, Clock } from 'lucide-react'

export default function AnalyticsDashboard({ interviews }: { interviews: any[] }) {
  
  // Calculate Averages for Radar Chart
  const radarData = useMemo(() => {
    if (!interviews.length) return []
    const reports = interviews.map(i => i.report).filter(Boolean)
    if (!reports.length) return []

    const avg = (key: string) => reports.reduce((acc, r) => acc + (r[key] || 0), 0) / reports.length

    return [
      { subject: 'Coding', A: Math.round(avg('codingScore') || avg('technicalScore')), fullMark: 100 },
      { subject: 'Comm.', A: Math.round(avg('communicationScore')), fullMark: 100 },
      { subject: 'DSA', A: Math.round(avg('problemSolvingScore')), fullMark: 100 },
      { subject: 'Resume', A: Math.round(avg('resumeKnowledgeScore')), fullMark: 100 },
      { subject: 'Confidence', A: Math.round(avg('confidenceScore')), fullMark: 100 },
    ]
  }, [interviews])

  // Trend Line Graph
  const trendData = useMemo(() => {
    return interviews.filter(i => i.report).map((i, idx) => ({
      name: `Int ${idx + 1}`,
      score: i.report.overallScore,
      date: format(new Date(i.createdAt), 'MMM dd'),
      confidence: i.report.confidenceScore
    }))
  }, [interviews])

  // Language Usage Pie Chart
  const languageData = useMemo(() => {
    const langs = interviews.reduce((acc: any, i) => {
      const l = i.language || 'English'
      acc[l] = (acc[l] || 0) + 1
      return acc
    }, {})
    return Object.keys(langs).map(name => ({ name, value: langs[name] }))
  }, [interviews])
  const COLORS = ['#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#10b981']

  // Heatmap Data (mocking last 30 days)
  const heatmapData = useMemo(() => {
    const days = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = subDays(now, i)
      const dateStr = format(d, 'yyyy-MM-dd')
      const count = interviews.filter(int => format(new Date(int.createdAt), 'yyyy-MM-dd') === dateStr).length
      days.push({ date: dateStr, count })
    }
    return days
  }, [interviews])

  // Weak/Strong Areas
  const { strengths, weaknesses } = useMemo(() => {
    const s = new Set<string>()
    const w = new Set<string>()
    interviews.forEach(i => {
      if (i.report) {
        i.report.strengths?.slice(0,2).forEach((str: string) => s.add(str))
        i.report.weaknesses?.slice(0,2).forEach((wk: string) => w.add(wk))
      }
    })
    return { strengths: Array.from(s).slice(0, 4), weaknesses: Array.from(w).slice(0, 4) }
  }, [interviews])

  if (!interviews.length) {
    return <div className="text-gray-400 text-center py-20">Take some interviews to see your analytics!</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Radar Chart */}
      <div className="bg-[#111620] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" /> Skill Breakdown
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#1f2937" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Skills" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="bg-[#111620] border border-gray-800 rounded-2xl p-6 shadow-xl lg:col-span-2 group hover:border-purple-500/30 transition-colors">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" /> Performance Trend
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" stroke="#4b5563" tick={{fill: '#9ca3af'}} />
              <YAxis domain={[0, 100]} stroke="#4b5563" tick={{fill: '#9ca3af'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111620', borderColor: '#1f2937', color: '#fff' }}
                itemStyle={{ color: '#a855f7' }}
              />
              <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-[#111620] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-400" /> Practice Calendar
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {heatmapData.map((day, i) => (
            <div 
              key={i} 
              className={`w-full aspect-square rounded-sm ${
                day.count === 0 ? 'bg-gray-800/50' :
                day.count === 1 ? 'bg-emerald-900/60' :
                day.count === 2 ? 'bg-emerald-500/60' : 'bg-emerald-400'
              }`}
              title={`${day.date}: ${day.count} interviews`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Weak & Strong Areas */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111620] border border-red-500/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Weak Areas to Improve
          </h3>
          <ul className="space-y-3">
            {weaknesses.length > 0 ? weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                {w}
              </li>
            )) : <li className="text-gray-500 text-sm">No weak areas identified yet!</li>}
          </ul>
        </div>
        <div className="bg-[#111620] border border-emerald-500/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" /> Your Strengths
          </h3>
          <ul className="space-y-3">
            {strengths.length > 0 ? strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                {s}
              </li>
            )) : <li className="text-gray-500 text-sm">Keep practicing to find your strengths.</li>}
          </ul>
        </div>
      </div>

      {/* Confidence Growth */}
      <div className="bg-[#111620] border border-gray-800 rounded-2xl p-6 shadow-xl lg:col-span-2 group hover:border-pink-500/30 transition-colors">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-400" /> Confidence Growth
        </h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" stroke="#4b5563" tick={{fill: '#9ca3af'}} />
              <YAxis domain={[0, 100]} stroke="#4b5563" tick={{fill: '#9ca3af'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111620', borderColor: '#1f2937', color: '#fff' }}
                itemStyle={{ color: '#ec4899' }}
              />
              <Line type="monotone" dataKey="confidence" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Language / Stack Pie */}
      <div className="bg-[#111620] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col items-center">
        <h3 className="text-lg font-bold text-white mb-2 self-start flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" /> Language Usage
        </h3>
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111620', borderColor: '#1f2937', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {languageData.map((lang, idx) => (
            <div key={lang.name} className="flex items-center gap-1.5 text-xs text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              {lang.name}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
