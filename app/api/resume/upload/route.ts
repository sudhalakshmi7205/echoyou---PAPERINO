import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateResumeSummary } from '@/lib/resume/extract'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('resume') as File
    const clerkId = formData.get('clerkId') as string

    if (!file || !clerkId) {
      return NextResponse.json({ error: 'Missing file or clerkId' }, { status: 400 })
    }

    // 1. Upload locally (since Vercel Blob isn't configured in local dev)
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', clerkId)
    await mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)
    const fileUrl = `/uploads/${clerkId}/${filename}`

    // 2. Extract text from PDF
    const pdf = require('pdf-parse/lib/pdf-parse.js')
    const data = await pdf(buffer)
    const parsedText = data.text

    // Handle Job Description if provided
    const jobDescription = formData.get('jobDescription') as string | null

    // 3. AI analysis
    // We pass JD to the prompt if provided.
    const { summary, skills, ats } = await generateResumeSummary(parsedText, jobDescription)

    // 4. Archive old active resume as a version
    const existing = await db.resume.findFirst({
      where: { clerkId, isActive: true }
    })

    if (existing) {
      await db.resumeVersion.create({
        data: {
          resumeId: existing.id,
          fileName: existing.fileName,
          fileUrl: existing.fileUrl,
        }
      })
      await db.resume.update({
        where: { id: existing.id },
        data: { isActive: false }
      })
    }

    // 5. Save new resume
    const resume = await db.resume.create({
      data: {
        clerkId,
        fileName: file.name,
        fileUrl: fileUrl,
        fileSize: file.size,
        parsedText,
        aiSummary: summary,
        skills,
        isActive: true,
      }
    })

    // 5b. Generate and store semantic RAG chunks for Resume Follow-up
    const { processAndStoreResumeChunks } = await import('@/lib/rag/retrieval')
    await processAndStoreResumeChunks(clerkId, resume.id, parsedText)

    // 6. Save ATS Analysis if JD was provided
    if (jobDescription && ats) {
      await db.resumeATSAnalysis.create({
        data: {
          resumeId: resume.id,
          clerkId,
          targetRole: 'Custom Role', // Could extract from JD in future
          jobDescription,
          matchScore: ats.matchScore,
          formatScore: ats.formatScore,
          keywordScore: ats.keywordScore,
          missingKeywords: ats.missingKeywords,
          feedback: ats.feedback
        }
      })
    }

    // Update Profile's resumeUpdatedAt
    await db.profile.update({
      where: { clerkId },
      data: { resumeUpdatedAt: new Date() }
    })

    return NextResponse.json({ resume })
  } catch (error) {
    console.error('Error uploading resume:', error)
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 })
  }
}
