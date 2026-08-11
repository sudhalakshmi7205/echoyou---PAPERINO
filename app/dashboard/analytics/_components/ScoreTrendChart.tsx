'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ScoreTrendChart({ data }: { data: any[] }) {
  const formattedData = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
        <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
        <YAxis stroke="#9CA3AF" domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="overall" name="Overall" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4, fill: '#22D3EE' }} />
        <Line type="monotone" dataKey="technical" name="Technical" stroke="#A855F7" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
