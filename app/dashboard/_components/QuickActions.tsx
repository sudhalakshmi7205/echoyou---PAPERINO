import { Play, Settings, FileText, Code2, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function QuickActions() {
  const actions = [
    {
      label: 'New Technical Round',
      icon: <Code2 className="w-5 h-5 text-cyan-400" />,
      href: '/dashboard/interviews/new?type=technical',
    },
    {
      label: 'New Behavioural Round',
      icon: <Play className="w-5 h-5 text-emerald-400" />,
      href: '/dashboard/interviews/new?type=behavioural',
    },
    {
      label: 'Leaderboard',
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      href: '/dashboard/leaderboard',
    },
    {
      label: 'Resume Followup',
      icon: <FileText className="w-5 h-5 text-purple-400" />,
      href: '/dashboard/resume-followups',
    },
    {
      label: 'Account Settings',
      icon: <Settings className="w-5 h-5 text-gray-400" />,
      href: '/dashboard/profile',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {actions.map((action, i) => (
        <Link 
          key={i} 
          href={action.href}
          className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-[#111620] border border-gray-800/60 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all gap-3 text-center"
        >
          <div className="p-3 bg-[#0B0E14] rounded-xl border border-gray-800 group-hover:border-cyan-500/30 transition-colors">
            {action.icon}
          </div>
          <span className="font-medium text-gray-300 text-sm group-hover:text-cyan-400 transition-colors">{action.label}</span>
        </Link>
      ))}
    </div>
  )
}
