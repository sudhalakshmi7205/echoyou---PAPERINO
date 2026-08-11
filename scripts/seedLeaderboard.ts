import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding leaderboard data...')

  // Give the main user (first found) some points
  const user = await prisma.user.findFirst()
  if (user) {
    await prisma.profile.updateMany({
      where: { clerkId: user.clerkId },
      data: {
        points: 4850,
        interviewsCompleted: 12,
        currentStreak: 5,
        badges: ['Early Adopter', 'Top 10%']
      }
    })
  }

  // Create 5 fake users for the leaderboard
  const fakes = [
    { email: 'alex@example.com', firstName: 'Alex', lastName: 'Chen', points: 15400, completed: 42, streak: 14, badges: ['Elite', 'Code Master'] },
    { email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Jenkins', points: 12300, completed: 35, streak: 8, badges: ['Top 1%'] },
    { email: 'mike@example.com', firstName: 'Mike', lastName: 'Ross', points: 9800, completed: 28, streak: 3, badges: ['Fast Learner'] },
    { email: 'priya@example.com', firstName: 'Priya', lastName: 'Patel', points: 3200, completed: 8, streak: 2, badges: [] },
    { email: 'david@example.com', firstName: 'David', lastName: 'Kim', points: 1500, completed: 4, streak: 1, badges: [] }
  ]

  for (const fake of fakes) {
    const existing = await prisma.user.findUnique({ where: { email: fake.email } })
    if (!existing) {
      const newUser = await prisma.user.create({
        data: {
          clerkId: 'fake_' + Date.now() + Math.random(),
          email: fake.email,
          firstName: fake.firstName,
          lastName: fake.lastName,
          imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fake.firstName}`,
        }
      })
      await prisma.profile.create({
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

  console.log('Seeding complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
