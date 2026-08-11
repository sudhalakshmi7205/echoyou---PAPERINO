import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { githubUrl, linkedinUrl, portfolioUrl } = body

    const updatedProfile = await db.profile.update({
      where: { clerkId: user.id },
      data: {
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null,
        portfolioUrl: portfolioUrl || null,
      }
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Failed to save profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
