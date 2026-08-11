import { db } from '@/lib/db'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Cascade delete everything in Prisma
    await db.$transaction([
      db.message.deleteMany({ where: { interview: { clerkId: userId } } }),
      db.codeSubmission.deleteMany({ where: { interview: { clerkId: userId } } }),
      db.report.deleteMany({ where: { interview: { clerkId: userId } } }),
      db.webhook.deleteMany({ where: { clerkId: userId } }),
      db.roadmap.deleteMany({ where: { clerkId: userId } }),
      db.userPreferences.deleteMany({ where: { clerkId: userId } }),
      db.achievement.deleteMany({ where: { clerkId: userId } }),
      db.interview.deleteMany({ where: { clerkId: userId } }),
      db.resume.deleteMany({ where: { clerkId: userId } }),
      db.profile.deleteMany({ where: { clerkId: userId } }),
      db.user.deleteMany({ where: { clerkId: userId } }),
    ])

    // Delete from Clerk
    const client = await clerkClient()
    await client.users.deleteUser(userId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete account", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
