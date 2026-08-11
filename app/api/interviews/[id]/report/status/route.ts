import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const report = await db.report.findUnique({
    where: { interviewId: resolvedParams.id },
    select: { id: true }
  })
  return NextResponse.json({ ready: !!report })
}
