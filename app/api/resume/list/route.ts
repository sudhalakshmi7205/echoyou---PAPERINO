import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const clerkId = userId

    const resumes = await db.resume.findMany({
      where: { clerkId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        skills: true,
        aiSummary: true
      }
    })

    return NextResponse.json(resumes)
  } catch (error: any) {
    console.error('List Resumes Error:', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}
