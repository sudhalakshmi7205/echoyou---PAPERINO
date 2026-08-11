import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ customAvatarUrl: null })

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
      select: { customAvatarUrl: true }
    })

    return NextResponse.json({ customAvatarUrl: profile?.customAvatarUrl || null })
  } catch (error) {
    return NextResponse.json({ customAvatarUrl: null })
  }
}
