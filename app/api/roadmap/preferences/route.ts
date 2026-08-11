import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const preferences = await db.userRoadmapPreferences.findUnique({
      where: { clerkId: user.id }
    })

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error('Error fetching roadmap preferences:', error)
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    const preferences = await db.userRoadmapPreferences.upsert({
      where: { clerkId: user.id },
      update: {
        role: body.targetRole || body.role || 'SDE-1',
        company: body.companyTier || body.company || 'Product-based',
        dsaDifficulty: body.dsaLevel || body.dsaDifficulty || 'Beginner',
        learningStyle: body.coreCsConfidence || body.learningStyle || 'Moderate',
        duration: body.timeframe || body.duration || '1 month'
      },
      create: {
        clerkId: user.id,
        role: body.targetRole || body.role || 'SDE-1',
        company: body.companyTier || body.company || 'Product-based',
        dsaDifficulty: body.dsaLevel || body.dsaDifficulty || 'Beginner',
        learningStyle: body.coreCsConfidence || body.learningStyle || 'Moderate',
        duration: body.timeframe || body.duration || '1 month'
      }
    })

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error('Error saving roadmap preferences:', error)
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}
