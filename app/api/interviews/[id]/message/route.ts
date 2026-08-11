import { NextRequest } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { runPipelineStream } from '@/lib/interview-engine/pipeline'
import { ConversationMemory } from '@/lib/interview-engine/memory'
import { buildSystemPrompt } from '@/lib/interview-engine/prompt'

// In-memory store for active sessions (use Redis in production)
const activeSessions = new Map<string, ConversationMemory>()

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const user = await currentUser()
  if (!user) return new Response('Unauthorized', { status: 401 })
    
  const { message, activeProblemContext } = await req.json()

  // Load interview + profile + resume
  const [interview, profile, resume] = await Promise.all([
    db.interview.findUnique({ where: { id: resolvedParams.id } }),
    db.profile.findUnique({ where: { clerkId: user.id } }),
    db.resume.findFirst({ where: { clerkId: user.id, isActive: true } }),
  ])

  if (!interview || !profile) {
    return new Response('Not found', { status: 404 })
  }

  // Get or create memory for this session
  if (!activeSessions.has(resolvedParams.id)) {
    const memory = new ConversationMemory()

    // Seed with existing messages if session was interrupted
    const existingMessages = await db.message.findMany({
      where: { interviewId: resolvedParams.id },
      orderBy: { createdAt: 'asc' },
    })
    existingMessages.forEach(m => memory.add({ role: m.role as 'user'|'assistant', content: m.content }))
    activeSessions.set(resolvedParams.id, memory)
  }

  const memory = activeSessions.get(resolvedParams.id)!

  // Get current interview state
  let state = await db.interviewState.findUnique({ where: { interviewId: resolvedParams.id } })
  if (!state) {
    state = await db.interviewState.create({
      data: { interviewId: resolvedParams.id, currentPhase: 'intro', questionIndex: 0, questionsAsked: [], topicsCovered: [] }
    })
  }

  const promptContext = {
    interview: { type: interview.type, role: interview.role, company: interview.company, difficulty: interview.difficulty, duration: interview.duration },
    profile:   { experience: profile.experience, languages: profile.languages, goal: profile.goal },
    resume:    resume ? { aiSummary: resume.aiSummary, skills: resume.skills, parsedText: resume.parsedText } : null,
    state:     { currentPhase: state.currentPhase, questionIndex: state.questionIndex, topicsCovered: state.topicsCovered, minutesElapsed: 0 },
    activeProblemContext
  }

  // Save user message to DB (unless it's the start trigger)
  if (message !== '[START_INTERVIEW]') {
    await db.message.create({
      data: { interviewId: resolvedParams.id, role: 'user', content: message, type: 'answer' }
    })
  }

  // Stream response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let fullText = ''

      try {
        for await (const chunk of runPipelineStream({ userMessage: message, memory, promptContext })) {
          fullText += chunk
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
        }

        // Save AI response to DB
        await db.message.create({
          data: { interviewId: resolvedParams.id, role: 'assistant', content: fullText, type: 'question' }
        })

        // Advance state
        await db.interviewState.update({
          where: { interviewId: resolvedParams.id },
          data: { questionIndex: { increment: 1 } }
        })

        // Update interview status to in_progress on first message
        if (interview.status === 'ready') {
          await db.interview.update({
            where: { id: resolvedParams.id },
            data: { status: 'in_progress' }
          })
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, fullText })}\n\n`))
      } catch (err: any) {
        console.error('Pipeline error:', err)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Failed to generate response' })}\n\n`))
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
