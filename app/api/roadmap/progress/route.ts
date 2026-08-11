import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    return NextResponse.json({ progress: null })
  } catch (error) {
    console.error('Error fetching roadmap progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving roadmap progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
