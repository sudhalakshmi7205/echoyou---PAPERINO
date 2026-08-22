import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resolvedParams = await params
  const interview = await db.interview.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!interview || interview.clerkId !== userId) {
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
  }

  const report = await db.report.findUnique({
    where: { interviewId: resolvedParams.id },
    select: { id: true }
  })
  return NextResponse.json({ ready: !!report })
}
