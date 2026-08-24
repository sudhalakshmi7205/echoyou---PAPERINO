import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { getPrivateResumeBuffer } from '@/lib/storage/supabase'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const resumeId = searchParams.get('id')

    if (!resumeId) {
      return NextResponse.json({ error: 'Missing resume ID' }, { status: 400 })
    }

    // Verify ownership: Authenticated user must own the resume
    const resume = await db.resume.findUnique({
      where: { id: resumeId }
    })

    if (!resume || resume.clerkId !== userId) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    if (!resume.storageKey) {
      return NextResponse.json({ error: 'Private storage key not available for this file' }, { status: 404 })
    }

    const buffer = await getPrivateResumeBuffer(resume.storageKey)
    if (!buffer) {
      return NextResponse.json({ error: 'File unavailable' }, { status: 404 })
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error downloading private resume PDF:', error)
    return NextResponse.json({ error: 'Failed to download resume' }, { status: 500 })
  }
}
