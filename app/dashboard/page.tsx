import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import NeuralDashboardPage from './_components/NeuralDashboardPage'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  try {
    const [profile, interviews, achievements] = await Promise.all([
      db.profile.findUnique({ where: { clerkId: user.id } }),
      db.interview.findMany({
        where: { clerkId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { report: true }
      }),
      db.achievement.findMany({ where: { clerkId: user.id } }),
    ])

    if (!profile || !profile.onboardingCompleted) {
      redirect('/onboarding')
    }

    return (
      <NeuralDashboardPage
        user={{ firstName: user.firstName, imageUrl: user.imageUrl }}
        profile={profile}
        interviews={interviews || []}
        achievements={achievements || []}
      />
    )
  } catch (error) {
    console.error('[DASHBOARD_ERROR]', error)
    redirect('/onboarding')
  }
}
