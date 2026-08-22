import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const clerkId = userId

    const { resumeId } = await req.json()

    if (!resumeId) {
      return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 })
    }

    // Verify ownership of the resume to be restored
    const targetResume = await db.resume.findUnique({
      where: { id: resumeId }
    })

    if (!targetResume || targetResume.clerkId !== clerkId) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Deactivate current
    await db.resume.updateMany({ 
      where: { clerkId, isActive: true }, 
      data: { isActive: false } 
    })

    // Restore chosen version
    await db.resume.update({ 
      where: { id: resumeId }, 
      data: { isActive: true } 
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error restoring resume:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
