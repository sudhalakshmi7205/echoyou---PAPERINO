import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import ProfileClient from './_components/ProfileClient'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
    include: {
      user: true,
    }
  })

  let preferences = await db.userPreferences.findUnique({
    where: { clerkId: user.id }
  })

  // Create default preferences if none exist
  if (!preferences) {
    preferences = await db.userPreferences.create({
      data: { clerkId: user.id }
    })
  }

  if (!profile) {
    redirect('/onboarding')
  }

  // Extract only plain JSON data to pass to Client Component
  const safeClerkUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  }

  // Calculate Live Interview Stats & Neural Badges Milestones
  const [passedReportsCount, totalInterviewsCount, resumeCount] = await Promise.all([
    db.report.count({
      where: {
        interview: { clerkId: user.id },
        overallScore: { gte: 50 }
      }
    }),
    db.interview.count({
      where: { clerkId: user.id, status: 'completed' }
    }),
    db.resume.count({
      where: { clerkId: user.id }
    })
  ])

  const interviewStats = {
    passedInterviewsCount: passedReportsCount,
    totalInterviewsCount,
    hasResume: resumeCount > 0
  }

  // Convert Prisma Date objects to strings
  const safeProfile = JSON.parse(JSON.stringify(profile))
  const safePreferences = JSON.parse(JSON.stringify(preferences))

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0E14] relative overflow-hidden pb-20">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <ProfileClient 
          profile={safeProfile} 
          clerkUser={safeClerkUser} 
          preferences={safePreferences} 
          interviewStats={interviewStats} 
        />
      </div>
    </div>
  )
}
