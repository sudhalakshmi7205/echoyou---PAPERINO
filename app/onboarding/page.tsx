import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import OnboardingShell from './_components/OnboardingShell'

export default async function OnboardingPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const profile = await db.profile.findUnique({
    where: { clerkId: user.id }
  })

  // Already onboarded — don't show this again
  if (profile?.onboardingCompleted) {
    redirect('/dashboard')
  }

  return <OnboardingShell clerkId={user.id} existingProfile={profile} />
}
