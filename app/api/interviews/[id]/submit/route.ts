import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { executeCode } from '@/lib/coding/piston'
import { reviewCode } from '@/lib/coding/evaluate'

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

  const { code, language, problemId } = await req.json()

  const problem = await db.codingProblem.findUnique({ where: { id: problemId } })
  if (!problem) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Run ALL test cases including hidden ones
  const allCases = [
    ...(problem.testCases as any[]),
    ...(problem.hiddenCases as any[]),
  ]

  const results = await Promise.all(
    allCases.map(async (tc) => {
      const result = await executeCode({ language, code, stdin: tc.input, version: '' })
      return {
        passed: result.stdout.trim() === String(tc.expected).trim(),
        executionMs: result.executionMs,
        stderr: result.stderr,
      }
    })
  )

  const testsPassed = results.filter(r => r.passed).length
  const testsTotal = results.length
  const status = testsPassed === testsTotal ? 'passed'
    : testsPassed > 0 ? 'partial'
    : 'failed'

  // AI code review
  const review = await reviewCode({ code, language, problem, testsPassed, testsTotal })

  // Save submission
  const submission = await db.codeSubmission.create({
    data: {
      interviewId: resolvedParams.id,
      language,
      code,
      problemId,
      status,
      testsPassed,
      testsTotal,
      aiReview: review.feedback,
      timeComplexity: review.timeComplexity,
      spaceComplexity: review.spaceComplexity,
    }
  })

  // Return only visible test results to client — never expose hidden case inputs
  return NextResponse.json({
    submission,
    visibleResults: results.slice(0, (problem.testCases as any[]).length),
    summary: { testsPassed, testsTotal, status },
    review,
  })
}
