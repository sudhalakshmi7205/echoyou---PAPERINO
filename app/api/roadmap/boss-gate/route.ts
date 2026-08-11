import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { phaseId, universe, score } = await req.json()
    const passed = score >= 70

    const attempt = {
      clerkId: user.id,
      phaseId: phaseId || 'phase_1',
      score: score || 85,
      passed,
      feedback: passed 
        ? 'Great technical breakdown of memory structures and edge case handling!' 
        : 'Focus on time complexity analysis and thread concurrency.'
    }

    return NextResponse.json({
      success: true,
      attempt
    })

    return NextResponse.json({ attempt, passed })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record boss attempt' }, { status: 500 })
  }
}
