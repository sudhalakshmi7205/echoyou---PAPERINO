import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { runEvaluation } from '@/lib/evaluation/pipeline'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify interview ownership
  const interview = await db.interview.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!interview || interview.clerkId !== userId) {
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
  }

  // Fire evaluation in background — don't block the response
  runEvaluation(resolvedParams.id).catch(console.error)

  return NextResponse.json({ ok: true, message: 'Evaluation started' })
}
