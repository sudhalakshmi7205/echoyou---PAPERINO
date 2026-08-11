import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const interviewId = resolvedParams.id

    // Check ownership
    const interview = await db.interview.findUnique({ where: { id: interviewId } })
    if (!interview || interview.clerkId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if report exists
    const report = await db.report.findUnique({ where: { interviewId } })
    if (!report) {
      return NextResponse.json({ error: 'Report not generated yet' }, { status: 400 })
    }

    // Check if shareable report already exists
    let share = await db.shareableReport.findUnique({ where: { interviewId } })
    
    if (!share) {
      // Create new shareable report, expires in 30 days
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      share = await db.shareableReport.create({
        data: {
          interviewId,
          expiresAt
        }
      })
    }

    return NextResponse.json({ url: `/r/${share.token}` })
  } catch (error) {
    console.error("Failed to generate share link", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
