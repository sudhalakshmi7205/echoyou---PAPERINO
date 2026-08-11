import { buildEvaluationPrompt } from './prompt'
import { validateScores, computeWeightedScore } from './scores'
import { db } from '@/lib/db'
import Groq from 'groq-sdk'
import { getFeatureModel } from '../aiModelConfig'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function runEvaluation(interviewId: string): Promise<void> {
  // 1. Load everything needed
  const [interview, messages, codeSubmission, profile] = await Promise.all([
    db.interview.findUnique({ where: { id: interviewId } }),
    db.message.findMany({
      where: { interviewId },
      orderBy: { createdAt: 'asc' }
    }),
    db.codeSubmission.findFirst({
      where: { interviewId },
      orderBy: { createdAt: 'desc' }
    }),
    db.interview.findUnique({ where: { id: interviewId } }).then(i => 
      i ? db.profile.findUnique({ where: { clerkId: i.clerkId } }) : null
    )
  ])

  if (!interview || !profile) return

  const resume = await db.resume.findFirst({ where: { clerkId: interview.clerkId, isActive: true } })
  const activePrompt: { content: string } | null = null

  // 2. Build prompt
  const prompt = buildEvaluationPrompt({
    interview: {
      type: interview.type,
      role: interview.role,
      company: interview.company,
      difficulty: interview.difficulty,
      duration: interview.duration
    },
    profile: {
      experience: profile.experience,
      role: profile.role,
      goal: profile.goal
    },
    resume: resume ? {
      aiSummary: resume.aiSummary,
      skills: resume.skills
    } : null,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
      type: m.type,
      questionIndex: m.questionIndex
    })),
    codeSubmission: codeSubmission ? {
      language: codeSubmission.language,
      code: codeSubmission.code,
      testsPassed: codeSubmission.testsPassed,
      testsTotal: codeSubmission.testsTotal,
      problemId: codeSubmission.problemId
    } : null,
    activePrompt: (activePrompt as any)?.content
  })

  // 3. Call Groq with configured High-Reasoning LLM (DeepSeek R1 / Llama 3.3 70B)
  const evaluationModel = getFeatureModel('interview_feedback') || 'deepseek-r1-distill-llama-70b'
  const response = await groq.chat.completions.create({
    messages: [
      { role: 'user', content: prompt }
    ],
    model: evaluationModel,
    temperature: 0.1, // 100% Deterministic — No random scoring
    response_format: { type: 'json_object' }
  })

  const raw = response.choices[0]?.message?.content || '{}'

  // 4. Parse + validate
  let evaluation: any = {}
  try {
    evaluation = JSON.parse(raw)
  } catch (e) {
    console.error("Failed to parse evaluation JSON", e)
    return
  }

  const validated = validateScores(evaluation)
  const qaPairs = messages.filter(m => m.role === 'user')
  const qaPairsCount = qaPairs.length
  const isAbandoned = interview.status === 'abandoned' || messages.length <= 1

  // 5. Compute weighted overall score & hiring verdict
  const { overallScore, verdict } = computeWeightedScore(validated.scores, qaPairsCount, isAbandoned)

  // 6. Save report
  await db.report.create({
    data: {
      interviewId,
      overallScore,
      verdict,
      technicalScore:       validated.scores.technical || 0,
      communicationScore:   validated.scores.communication || 0,
      problemSolvingScore:  validated.scores.problemSolving || 0,
      confidenceScore:      validated.scores.confidence || 0,
      behaviouralScore:     validated.scores.behavioural || 0,
      resumeKnowledgeScore: validated.scores.relevance || 0,
      codingScore:          validated.scores.problemSolving || 0,
      strengths:            validated.strengths || [],
      weaknesses:           validated.weaknesses || [],
      mistakes:             (validated.reasons ? Object.entries(validated.reasons).map(([k, v]) => ({ dimension: k, reason: String(v) })) : []) as any,
      questionReviews:      (validated.questionReviews || []) as any,
      improvementPlan:      { reasons: validated.reasons, metrics: validated.metrics } as any,
    }
  })

  // Fire ATS Webhook if configured
  const { dispatchATSWebhook } = await import('@/lib/integrations/webhook')
  await dispatchATSWebhook(interviewId)

  // 📬 Dispatch Email Evaluation Report if candidate enabled emailOnComplete
  const { sendEvaluationReportEmail } = await import('@/lib/email/sendEvaluationReport')
  sendEvaluationReportEmail({
    interviewId,
    clerkId: interview.clerkId,
    role: interview.role,
    overallScore,
    verdict,
    strengths: validated.strengths || [],
    weaknesses: validated.weaknesses || []
  }).catch(console.error)

  // Calculate Streak
  let newStreak = profile.currentStreak
  const previousInterview = await db.interview.findFirst({
    where: { clerkId: interview.clerkId, status: 'completed', id: { not: interviewId } },
    orderBy: { completedAt: 'desc' }
  })

  if (previousInterview?.completedAt) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const prevDate = new Date(previousInterview.completedAt)
    prevDate.setHours(0, 0, 0, 0)
    
    const diffTime = Math.abs(today.getTime() - prevDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      newStreak += 1 // Completed yesterday, streak continues
    } else if (diffDays > 1) {
      newStreak = 1 // Streak broken
    }
  } else {
    // First interview ever
    newStreak = 1
  }

  // Mark interview as completed and award XP (Overall Score = XP)
  const xpEarned = Math.round(overallScore || 0)
  
  await db.$transaction([
    db.interview.update({
      where: { id: interviewId },
      data: { status: 'completed', score: overallScore, completedAt: new Date() }
    }),
    db.profile.update({
      where: { clerkId: interview.clerkId },
      data: {
        points: { increment: xpEarned },
        interviewsCompleted: { increment: 1 },
        currentStreak: newStreak
      }
    })
  ])

  // Check and award badges
  const { checkAndAwardBadges } = await import('@/lib/gamification/badges')
  await checkAndAwardBadges(
    interview.clerkId, 
    newStreak, 
    overallScore, 
    profile.interviewsCompleted + 1
  )
}
