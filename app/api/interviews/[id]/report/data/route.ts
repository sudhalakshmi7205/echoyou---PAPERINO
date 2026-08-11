import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const report = await db.report.findUnique({
      where: { interviewId: resolvedParams.id },
      include: {
        interview: true
      }
    })
    
    if (!report) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ report })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load report' }, { status: 500 })
  }
}
