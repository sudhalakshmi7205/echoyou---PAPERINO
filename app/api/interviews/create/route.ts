import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { generateInterviewQuestions } from '@/lib/interviews/generate'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const clerkId = userId

    const body = await req.json()
    const { type, role, company, difficulty, duration, language, cameraEnabled, mediaMode } = body

    if (!type || !role || !difficulty || !duration || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resolvedMode = mediaMode || (cameraEnabled ? 'video_audio' : 'audio_only')
    const isCameraOn = Boolean(cameraEnabled || resolvedMode !== 'audio_only')

    // If type is resume_followup, fetch the authenticated user's active resume
    let resumeText = undefined
    if (type === 'resume_followup') {
      const activeResume = await db.resume.findFirst({
        where: { clerkId, isActive: true },
        orderBy: { createdAt: 'desc' }
      })
      if (activeResume) {
        resumeText = activeResume.parsedText || activeResume.aiSummary || undefined
      }
    }

    // Generate questions via AI
    const questions = await generateInterviewQuestions({ ...body, resumeText })

    // Create the interview
    const interview = await db.interview.create({
      data: {
        clerkId,
        type,
        role,
        company,
        difficulty,
        duration,
        language,
        cameraEnabled: isCameraOn,
        questions,
        status: 'draft',
      }
    })

    return NextResponse.json({ interview })
  } catch (error) {
    console.error('Error creating interview:', error)
    return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 })
  }
}
