import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const user = await db.user.findFirst()
    if (user) {
      await db.profile.updateMany({
        where: { clerkId: user.clerkId },
        data: {
          points: 4850,
          interviewsCompleted: 12,
          currentStreak: 5,
          badges: ['Early Adopter', 'Top 10%']
        }
      })
    }

    const fakes = [
      { email: 'alex@example.com', firstName: 'Alex', lastName: 'Chen', points: 15400, completed: 42, streak: 14, badges: ['Elite', 'Code Master'] },
      { email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Jenkins', points: 12300, completed: 35, streak: 8, badges: ['Top 1%'] },
      { email: 'mike@example.com', firstName: 'Mike', lastName: 'Ross', points: 9800, completed: 28, streak: 3, badges: ['Fast Learner'] },
      { email: 'priya@example.com', firstName: 'Priya', lastName: 'Patel', points: 3200, completed: 8, streak: 2, badges: [] },
      { email: 'david@example.com', firstName: 'David', lastName: 'Kim', points: 1500, completed: 4, streak: 1, badges: [] }
    ]

    for (const fake of fakes) {
      const existing = await db.user.findUnique({ where: { email: fake.email } })
      if (!existing) {
        const newUser = await db.user.create({
          data: {
            clerkId: 'fake_' + Date.now() + Math.random(),
            email: fake.email,
            firstName: fake.firstName,
            lastName: fake.lastName,
            imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fake.firstName}`,
          }
        })
        await db.profile.create({
          data: {
            clerkId: newUser.clerkId,
            onboardingCompleted: true,
            role: 'Software Engineer',
            points: fake.points,
            interviewsCompleted: fake.completed,
            currentStreak: fake.streak,
            badges: fake.badges
          }
        })
      }
    }

    return NextResponse.json({ success: true, message: 'Seeded successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
