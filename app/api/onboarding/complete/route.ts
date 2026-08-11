import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { clerkId, data } = await req.json()
  const user = await currentUser()

  if (user) {
    await db.user.upsert({
      where: { clerkId: user.id },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? '',
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
      update: {},
    })
  }

  await db.profile.upsert({
    where: { clerkId },
    create: { clerkId, ...data, onboardingCompleted: true },
    update: { ...data, onboardingCompleted: true },
  })

  return NextResponse.json({ ok: true })
}
