import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check if requester is already an admin
    const currentUserDb = await db.user.findUnique({ where: { clerkId: userId } })
    if (!currentUserDb || !currentUserDb.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin privileges required' }, { status: 403 })
    }

    return NextResponse.json({ success: true, message: 'User is verified admin', user: currentUserDb })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
