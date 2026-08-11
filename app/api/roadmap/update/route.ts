import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { updatedTimeline } = await req.json()
    if (!updatedTimeline) {
      return NextResponse.json({ error: 'Missing timeline data' }, { status: 400 })
    }

    const existing = await db.roadmap.findFirst({
      where: { clerkId: user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 })
    }

    await db.roadmap.update({
      where: { id: existing.id },
      data: {
        timeline: updatedTimeline,
        updatedAt: new Date()
      }
    })

    // Optionally update user streak or gamification stats if they completed something
    // (We could do that here by checking diffs, but for now we just save the JSON)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Roadmap update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
