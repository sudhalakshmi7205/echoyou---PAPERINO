import { Globe, TrendingUp, Users } from 'lucide-react'

export default function GlobalRanking({ interviews, profile }: { interviews: any[], profile: any }) {
  // Calculate average score to determine a realistic "mock" ranking
  const completedInterviews = interviews.filter(i => i.status === 'completed' && i.score !== null)
  let avgScore = 0
  if (completedInterviews.length > 0) {
    avgScore = completedInterviews.reduce((sum, i) => sum + i.score, 0) / completedInterviews.length
  }

  // Determine percentile based on score
  let percentile = 60 // default
  if (avgScore > 90) percentile = 5
  else if (avgScore > 80) percentile = 15
  else if (avgScore > 70) percentile = 30
  else if (avgScore > 0) percentile = 45

  const role = profile?.role || 'Software Engineer'

  return (
    <div className="bg-[#111620]/60 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-sm p-6 relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700" />
      
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-bold text-gray-100">Global Ranking</h2>
      </div>

      {completedInterviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-gray-800 flex items-center justify-center mb-3">
            <span className="text-gray-600 font-bold text-xl">?</span>
          </div>
          <p className="text-sm text-gray-400">Complete an interview to see your global standing.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative mb-6 mt-2">
            {/* Outer Ring */}
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-800"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="351"
                strokeDashoffset={351 - (351 * (100 - percentile)) / 100}
                className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-3xl font-black text-white">Top</span>
              <div className="text-2xl font-bold text-cyan-400">{percentile}%</div>
            </div>
          </div>

          <div className="w-full space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Among {role}s</span>
              </div>
              <span className="text-sm font-medium text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Rising
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
