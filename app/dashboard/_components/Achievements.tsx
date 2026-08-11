import { Medal, Trophy, Star } from 'lucide-react'

export default function Achievements({ achievements }: { achievements: any[] }) {
  const allMilestones = [
    { type: 'first_interview', label: 'First Interview', icon: <Medal className="w-5 h-5 text-gray-500" /> },
    { type: 'streak_3', label: '3-Day Streak', icon: <Star className="w-5 h-5 text-gray-500" /> },
    { type: 'score_80', label: 'Score > 80%', icon: <Trophy className="w-5 h-5 text-gray-500" /> },
  ]

  const earnedTypes = achievements.map(a => a.type)

  return (
    <div className="bg-[#111620]/60 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-sm p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h2 className="text-xl font-bold text-gray-100">Achievements</h2>
      </div>
      
      <div className="space-y-4">
        {allMilestones.map(milestone => {
          const isEarned = earnedTypes.includes(milestone.type)
          return (
            <div key={milestone.type} className={`flex items-center gap-3 p-3 rounded-xl border ${isEarned ? 'bg-amber-950/30 border-amber-500/30' : 'bg-[#0B0E14] border-gray-800 opacity-60'}`}>
              <div className={`p-2 rounded-lg ${isEarned ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800/80 text-gray-500'}`}>
                {isEarned ? <Trophy className="w-5 h-5 text-amber-400" /> : milestone.icon}
              </div>
              <span className={`font-medium ${isEarned ? 'text-amber-400' : 'text-gray-500'}`}>
                {milestone.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
