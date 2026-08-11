import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import RoadmapContainer from './_components/RoadmapContainer'

export const dynamic = 'force-dynamic'

import FeatureGuard from '@/app/_components/FeatureGuard'

export default async function RoadmapPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const studentName = user.firstName 
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Student'

  // Fetch saved roadmap preferences if available
  let initialPreferences = null
  try {
    const saved = await db.userRoadmapPreferences.findUnique({
      where: { clerkId: user.id }
    })
    if (saved) {
      initialPreferences = {
        targetRole: saved.role || 'Full Stack Developer',
        duration: saved.duration || '3 Months',
        startDate: saved.startDate ? new Date(saved.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        language: saved.language || 'JavaScript',
        companyTier: saved.company || 'Product-based',
        dsaLevel: saved.dsaDifficulty || 'Beginner',
        coreCsConfidence: saved.learningStyle || 'Moderate',
        timeframe: saved.duration || '3 Months'
      }
    }
  } catch (err) {
    console.error('Error fetching preferences:', err)
  }

  return (
    <FeatureGuard featureKey="role_roadmap" featureName="EchoRoadmap Module">
      <RoadmapContainer
        studentName={studentName}
        initialPreferences={initialPreferences}
      />
    </FeatureGuard>
  )
}
