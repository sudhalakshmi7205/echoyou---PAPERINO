import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

import DashboardLayoutClient from './_components/DashboardLayoutClient'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const profile = await db.profile.findUnique({
    where: { clerkId: user.id }
  })

  if (!profile?.onboardingCompleted) {
    redirect('/onboarding')
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}