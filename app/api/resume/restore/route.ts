import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { resumeId, clerkId } = await req.json()

    if (!resumeId || !clerkId) {
      return NextResponse.json({ error: 'Missing resumeId or clerkId' }, { status: 400 })
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
