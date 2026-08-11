import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    return NextResponse.json({ goal: {
      targetVideos: 2,
      targetProblems: 5,
      targetQuizzes: 1,
      targetMinutes: 120,
      watchedToday: 1,
      solvedToday: 3,
      quizzesToday: 0
    } })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch AI coach goal' }, { status: 500 })
  }
}
