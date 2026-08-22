import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const clerkId = userId

  const { data } = await req.json()
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
    create: {
      clerkId,
      ...data,
      onboardingCompleted: false,
    },
    update: {
      ...data,
    },
  })

  return NextResponse.json({ ok: true })
}
