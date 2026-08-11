'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { analyzeResumeATS } from '@/lib/ai/ats-analyzer'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function runATSAnalysis(resumeId: string, targetRole?: string, jobDescription?: string) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  // Strict 2 Scans Per Day Limit Enforcer
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  
  const todayScansCount = await db.resumeATSAnalysis.count({
    where: {
      clerkId: user.id,
      createdAt: { gte: startOfDay }
    }
  })

  if (todayScansCount >= 2) {
    throw new Error("Daily scan quota limit reached (2/2 scans used today). Please try again tomorrow at midnight!")
  }

  const resume = await db.resume.findUnique({
    where: { id: resumeId, clerkId: user.id }
  })
  if (!resume || !resume.parsedText) throw new Error("Resume not found or not parsed")

  let analysis
  try {
    analysis = await analyzeResumeATS(resume.parsedText, targetRole || 'General Candidate', jobDescription || '')
  } catch (err: any) {
    console.error('analyzeResumeATS throw error:', err)
    throw new Error(`ATS analysis engine error: ${err?.message || err}`)
  }

  if (!analysis) {
    throw new Error("Analysis engine returned empty result. Please verify GROQ_API_KEY environment variable or try again.")
  }

  const result = await db.resumeATSAnalysis.create({
    data: {
      resumeId: resume.id,
      clerkId: user.id,
      targetRole: targetRole || (analysis.parsedJD?.jobTitle || (jobDescription ? 'Target Job Position' : 'General Resume Assessment')),
      jobDescription: jobDescription || '',
      matchScore: analysis.overallScore,
      formatScore: analysis.categories.formatScore,
      keywordScore: analysis.categories.keywordScore ?? analysis.categories.hardSkillsScore ?? 75,
      missingKeywords: analysis.keywords.missingKeywords,
      feedback: JSON.parse(JSON.stringify(analysis))
    }
  })

  return result
}

export async function deleteATSAnalysis(analysisId: string) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  await db.resumeATSAnalysis.delete({
    where: { id: analysisId, clerkId: user.id }
  })

  return { success: true }
}

export async function getAISuggestionsUpdate(resumeId: string, analysisId: string) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  const [resume, analysis] = await Promise.all([
    db.resume.findUnique({ where: { id: resumeId, clerkId: user.id } }),
    db.resumeATSAnalysis.findUnique({ where: { id: analysisId, clerkId: user.id } })
  ])

  if (!resume || !analysis) throw new Error("Resume or Analysis not found")

  const feedbackObj = analysis.feedback as any
  const missingKeywords = analysis.missingKeywords || []
  const missingSkills = feedbackObj?.missingSkills || []

  // Prompt Groq to generate the optimized bio and skills
  const prompt = `
You are an expert resume optimization AI.
Modify the candidate's professional summary and skills to naturally incorporate the following missing keywords and missing skills without falsifying their experience.

ORIGINAL SUMMARY:
${resume.aiSummary || ''}

ORIGINAL SKILLS:
${resume.skills.join(', ')}

MISSING KEYWORDS TO INCORPORATE:
${missingKeywords.join(', ')}

MISSING SKILLS TO ADD:
${missingSkills.join(', ')}

Return a JSON object with two fields:
{
  "improvedBio": "The rewritten summary incorporating keywords naturally",
  "addedSkills": ["skill1", "skill2"] // Array of skills that should be added to the user's skill list
}
Return ONLY valid JSON.
`

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'system', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.2,
    response_format: { type: 'json_object' }
  })

  const resText = completion.choices[0]?.message?.content
  if (!resText) throw new Error("AI failed to generate suggestions")

  return JSON.parse(resText)
}

export async function saveAIUpdatedResume(resumeId: string, improvedBio: string, newSkills: string[]) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  const resume = await db.resume.findUnique({ where: { id: resumeId, clerkId: user.id } })
  if (!resume) throw new Error("Resume not found")

  // Merge skills
  const mergedSkills = Array.from(new Set([...resume.skills, ...newSkills]))

  const updated = await db.resume.update({
    where: { id: resumeId },
    data: {
      aiSummary: improvedBio,
      skills: mergedSkills
    }
  })

  return updated
}
