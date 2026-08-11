import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { emailOnComplete, emailWeeklySummary, defaultDifficulty, preferredLanguage, interviewerVoice } = await req.json()

    await db.userPreferences.upsert({
      where: { clerkId: user.id },
      update: {
        ...(typeof emailOnComplete === 'boolean' ? { emailOnComplete } : {}),
        ...(typeof emailWeeklySummary === 'boolean' ? { emailWeeklySummary } : {}),
        ...(defaultDifficulty ? { defaultDifficulty } : {}),
        ...(preferredLanguage ? { preferredLanguage } : {}),
        ...(interviewerVoice ? { interviewerVoice } : {})
      },
      create: {
        clerkId: user.id,
        emailOnComplete: emailOnComplete ?? true,
        emailWeeklySummary: emailWeeklySummary ?? true,
        defaultDifficulty: defaultDifficulty || 'medium',
        preferredLanguage: preferredLanguage || 'english',
        interviewerVoice: interviewerVoice || 'female'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
