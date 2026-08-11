import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { generateResumeSummary } from '@/lib/resume/extract'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { jobDescription } = await req.json()
    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json({ error: 'Missing Job Description' }, { status: 400 })
    }

    // 1. Find active resume
    const resume = await db.resume.findFirst({
      where: { clerkId: user.id, isActive: true }
    })

    if (!resume) {
      return NextResponse.json({ error: 'No active resume found. Please upload one first.' }, { status: 404 })
    }

    if (!resume.parsedText) {
      return NextResponse.json({ error: 'Active resume does not have parsed text.' }, { status: 400 })
    }

    // 2. AI analysis
    const { ats } = await generateResumeSummary(resume.parsedText, jobDescription)

    if (!ats) {
      return NextResponse.json({ error: 'Failed to generate ATS analysis' }, { status: 500 })
    }

    // 3. Save ATS Analysis
    const atsRecord = await db.resumeATSAnalysis.create({
      data: {
        resumeId: resume.id,
        clerkId: user.id,
        targetRole: 'Custom Role', // Could extract from JD in future
        jobDescription,
        matchScore: ats.matchScore,
        formatScore: ats.formatScore,
        keywordScore: ats.keywordScore,
        missingKeywords: ats.missingKeywords,
        feedback: {
          ...ats.feedback,
          matchingKeywords: ats.matchingKeywords || [],
          missingSkills: ats.missingSkills || [],
          matchingSkills: ats.matchingSkills || []
        }
      }
    })

    return NextResponse.json({ atsRecord })
  } catch (error: any) {
    console.error('Analyze Existing Resume Error:', error)
    return NextResponse.json({ error: 'Failed to analyze existing resume' }, { status: 500 })
  }
}
