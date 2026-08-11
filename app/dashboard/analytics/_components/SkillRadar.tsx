'use client'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function SkillRadar({ data }: { data: any }) {
  const chartData = [
    { subject: 'Technical', A: data.technical, fullMark: 100 },
    { subject: 'Communication', A: data.communication, fullMark: 100 },
    { subject: 'Prob. Solving', A: data.problemSolving, fullMark: 100 },
    { subject: 'Confidence', A: data.confidence, fullMark: 100 },
    { subject: 'Behavioural', A: data.behavioural, fullMark: 100 },
    { subject: 'Resume', A: data.resumeKnowledge, fullMark: 100 },
  ]
  
  if (data.coding > 0) {
    chartData.push({ subject: 'Coding', A: data.coding, fullMark: 100 })
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
          itemStyle={{ color: '#A855F7' }}
        />
        <Radar name="Score" dataKey="A" stroke="#A855F7" fill="#A855F7" fillOpacity={0.4} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
