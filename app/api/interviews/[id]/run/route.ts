import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { executeCode } from '@/lib/coding/piston'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, language, problemId, runAll } = await req.json()

  // Load visible test cases only
  const problem = await db.codingProblem.findUnique({
    where: { id: problemId }
  })
  if (!problem) return NextResponse.json({ error: 'Problem not found' }, { status: 404 })

  const testCases = problem.testCases as any[]

  const results = await Promise.all(
    testCases.map(async (tc, i) => {
      try {
        const result = await executeCode({
          language,
          code,
          stdin: tc.input,
          version: '',
        })

        const actualOutput = result.stdout.trim()
        const expectedOutput = String(tc.expected).trim()
        const passed = actualOutput === expectedOutput

        return {
          index: i,
          input: tc.input,
          expected: expectedOutput,
          actual: actualOutput,
          passed,
          stderr: result.stderr,
          executionMs: result.executionMs,
        }
      } catch (err) {
        return {
          index: i,
          input: tc.input,
          expected: String(tc.expected),
          actual: '',
          passed: false,
          stderr: String(err),
          executionMs: 0,
        }
      }
    })
  )

  return NextResponse.json({ results })
}
