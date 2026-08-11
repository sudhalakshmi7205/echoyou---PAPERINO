import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const problem = await db.codingProblem.findFirst({
      where: {
        difficulty: { in: ['easy', 'medium'] }
      }
    })
    
    if (problem) {
      return NextResponse.json({ problem })
    }

    // Mock problem if db is empty
    return NextResponse.json({
      problem: {
        id: 'mock-1',
        title: 'Two Sum',
        difficulty: 'easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
        ],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
        testCases: [
          { input: '2 7 11 15\n9\n', expected: '[0, 1]' },
          { input: '3 2 4\n6\n', expected: '[1, 2]' }
        ],
        hiddenCases: [
          { input: '3 3\n6\n', expected: '[0, 1]' }
        ],
        starterCode: {
          javascript: 'function twoSum(nums, target) {\n  \n}',
          python: 'def twoSum(nums, target):\n    pass'
        }
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch problem' }, { status: 500 })
  }
}
