import { Lightbulb, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function getRecommendations(profile: any, interviews: any[]) {
  const recs = []
  
  // 1. Check for System Design weakness or missing
  const systemDesignInterviews = interviews.filter(i => i.type === 'system_design' && i.score !== null)
  if (systemDesignInterviews.length > 0) {
    const avgSystemDesign = systemDesignInterviews.reduce((sum, i) => sum + i.score, 0) / systemDesignInterviews.length
    if (avgSystemDesign < 65) {
      recs.push({ 
        title: 'Practice System Design', 
        description: 'Your recent system design scores are below 65%. Try another round to improve.',
        action: 'Start Round',
        href: '/interview/setup?type=system_design'
      })
    }
  } else {
    recs.push({ 
      title: 'Try a System Design Round', 
      description: 'You haven\'t practiced system design yet. It\'s a crucial part of senior interviews.',
      action: 'Start Round',
      href: '/interview/setup?type=system_design'
    })
  }

  // 2. Check for Behavioural
  if (!interviews.some(i => i.type === 'behavioural')) {
    recs.push({ 
      title: 'Practice Behavioural Questions', 
      description: 'Don\'t forget about the cultural fit! Try a behavioural round based on your target companies.',
      action: 'Start Round',
      href: '/interview/setup?type=behavioural'
    })
  }

  // 3. Resume update check
  if (profile?.resumeUpdatedAt) {
    const daysSinceUpdate = (new Date().getTime() - new Date(profile.resumeUpdatedAt).getTime()) / (1000 * 3600 * 24)
    if (daysSinceUpdate > 14) {
      recs.push({ 
        title: 'Update Your Resume', 
        description: 'It\'s been a while since you updated your resume. Keeping it fresh helps us ask better questions.',
        action: 'Update Now',
        href: '/settings/resume'
      })
    }
  } else if (!profile?.resumeUrl) {
    recs.push({ 
      title: 'Upload Your Resume', 
      description: 'We can tailor your technical questions much better if you upload your resume.',
      action: 'Upload Now',
      href: '/settings/resume'
    })
  }

  // Return top 3
  return recs.slice(0, 3)
}

export default function Recommendations({ profile, interviews }: { profile: any, interviews: any[] }) {
  const recommendations = getRecommendations(profile, interviews)

  if (recommendations.length === 0) return null

  return (
    <div className="bg-[#111620] border border-gray-800/60 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
        <h2 className="text-xl font-bold text-gray-100">Recommended for you</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, i) => (
          <div key={i} className="bg-[#0B0E14] rounded-xl p-5 border border-gray-800 flex flex-col group hover:border-yellow-400/30 transition-colors">
            <h3 className="font-bold text-gray-100 mb-2">{rec.title}</h3>
            <p className="text-sm text-gray-400 mb-4 flex-1">{rec.description}</p>
            <Link 
              href={rec.href}
              className="text-yellow-400 font-semibold text-sm flex items-center gap-1 group-hover:text-yellow-300 transition-colors"
            >
              {rec.action} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
