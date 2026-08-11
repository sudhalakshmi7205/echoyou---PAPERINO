import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clerkId = searchParams.get('clerkId')

    if (!clerkId) {
      return NextResponse.json({ error: 'Missing clerkId' }, { status: 400 })
    }

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
