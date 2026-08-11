import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { runEvaluation } from '@/lib/evaluation/pipeline'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fire evaluation in background — don't block the response
  // User sees "Generating your report…" screen while this runs
  runEvaluation(resolvedParams.id).catch(console.error)

  return NextResponse.json({ ok: true, message: 'Evaluation started' })
}
