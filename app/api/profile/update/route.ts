import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { bio, role, experience, languages, goal, customAvatarUrl } = await req.json()

    await db.profile.update({
      where: { clerkId: user.id },
      data: {
        aiBio: bio,
        role,
        experience,
        languages,
        goal,
        ...(customAvatarUrl ? { customAvatarUrl } : {})
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
