import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateInterviewQuestions } from '@/lib/interviews/generate'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { clerkId, type, role, company, difficulty, duration, language, cameraEnabled, mediaMode } = body

    if (!clerkId || !type || !role || !difficulty || !duration || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resolvedMode = mediaMode || (cameraEnabled ? 'video_audio' : 'audio_only')
    const isCameraOn = Boolean(cameraEnabled || resolvedMode !== 'audio_only')

    console.log('[APICreateInterview] Mode:', resolvedMode, 'Camera Enabled:', isCameraOn)

    // If type is resume_followup, we need to fetch their resume
    let resumeText = undefined
    if (type === 'resume_followup') {
      const activeResume = await db.resume.findFirst({
        where: { clerkId, isActive: true },
        orderBy: { createdAt: 'desc' }
      })
      if (activeResume) {
        resumeText = activeResume.parsedText || activeResume.aiSummary || undefined
      }
      if (!resumeText) {
        console.warn(`No active resume found for user ${clerkId} for resume_followup interview.`)
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
