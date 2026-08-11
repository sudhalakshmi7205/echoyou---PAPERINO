import { db } from '@/lib/db'

export async function checkAndAwardBadges(
  clerkId: string, 
  currentStreak: number, 
  overallScore: number, 
  totalInterviews: number
) {
  // Get existing badges
  const existingAchievements = await db.achievement.findMany({
    where: { clerkId }
  })
  const existingTypes = new Set(existingAchievements.map(a => a.type))

  const newBadges: string[] = []

  // Logic 1: First Interview
  if (totalInterviews === 1 && !existingTypes.has('first_interview')) {
    newBadges.push('first_interview')
  }

  // Logic 2: Perfect Score (90+)
  if (overallScore >= 90 && !existingTypes.has('perfect_score')) {
    newBadges.push('perfect_score')
  }

  // Logic 3: Streaks
  if (currentStreak >= 3 && !existingTypes.has('streak_3')) {
    newBadges.push('streak_3')
  }
  
  if (currentStreak >= 7 && !existingTypes.has('streak_7')) {
    newBadges.push('streak_7')
  }

  // If no new badges, we're done
  if (newBadges.length === 0) return

  // Award new badges
  const achievementInserts = newBadges.map(type => ({
    clerkId,
    type
  }))

  await db.$transaction([
    db.achievement.createMany({
      data: achievementInserts
    }),
    db.profile.update({
      where: { clerkId },
      data: {
        badges: { push: newBadges }
      }
    })
  ])

  console.log(`[Gamification] Awarded ${newBadges.length} new badges to ${clerkId}: ${newBadges.join(', ')}`)
}
