import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { generateResumeSummary } from '@/lib/resume/extract'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const clerkId = userId

    const formData = await req.formData()
    const file = formData.get('resume') as File

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    // PDF Type & Size Validation (Max 10MB)
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // 1. Upload to Private Supabase Bucket ("resumes")
    let storageKey: string | null = null
    try {
      const { uploadPrivateResume } = await import('@/lib/storage/supabase')
      storageKey = await uploadPrivateResume(clerkId, file.name, buffer)
    } catch (err) {
      console.warn('[UPLOAD_WARN] Supabase storage upload skipped or failed, storing metadata:', err)
    }

    const fileUrl = `/api/resume/file?key=${encodeURIComponent(storageKey || '')}`

    // 2. Extract text from PDF in memory
    const pdf = require('pdf-parse/lib/pdf-parse.js')
    const data = await pdf(buffer)
    const parsedText = data.text

    // Handle Job Description if provided
    const jobDescription = formData.get('jobDescription') as string | null

    // 3. AI analysis
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
          storageKey: existing.storageKey,
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
        storageKey: storageKey,
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
