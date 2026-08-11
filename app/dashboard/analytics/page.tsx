import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import AnalyticsDashboard from './_components/AnalyticsDashboard'

export default async function AnalyticsPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  // Fetch all interviews with reports for this user
  const interviews = await db.interview.findMany({
    where: { clerkId: user.id, status: 'completed' },
    include: { report: true },
    orderBy: { createdAt: 'asc' } // chronological order for trend charts
  })

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0E14] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            echoANALYTICS
          </h1>
          <p className="text-gray-400 mt-2">
            The coolest dashboard. Deep dive into your performance, trends, and weak areas.
          </p>
        </div>

        <AnalyticsDashboard interviews={interviews} />
      </div>
    </div>
  )
}
