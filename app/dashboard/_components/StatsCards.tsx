import { TrendingUp, Award, Clock, Target } from 'lucide-react'

export default function StatsCards({ interviews }: { interviews: any[] }) {
  const completedInterviews = interviews.filter(i => i.status === 'completed')
  const totalInterviews = completedInterviews.length
  
  const avgScore = completedInterviews.length > 0
    ? completedInterviews
        .filter(i => i.score !== null)
        .reduce((sum, i) => sum + i.score, 0) / completedInterviews.filter(i => i.score !== null).length
    : 0

  const totalMinutes = completedInterviews.reduce((sum, i) => sum + (i.duration || 0), 0)

  const stats = [
    {
      label: 'Completed Interviews',
      value: totalInterviews.toString(),
      icon: <Target className="w-5 h-5 text-cyan-400" />,
      color: 'bg-cyan-400/10 border border-cyan-400/20'
    },
    {
      label: 'Average Score',
      value: avgScore > 0 ? `${Math.round(avgScore)}%` : '-',
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-400/10 border border-emerald-400/20'
    },
    {
      label: 'Time Practicing',
      value: `${totalMinutes} min`,
      icon: <Clock className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-400/10 border border-purple-400/20'
    },
    {
      label: 'Highest Score',
      value: completedInterviews.length > 0 ? `${Math.max(...completedInterviews.map(i => i.score || 0))}%` : '-',
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
      color: 'bg-blue-400/10 border border-blue-400/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#111620] border border-gray-800/60 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className={`p-3 rounded-xl ${stat.color}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-100">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}
