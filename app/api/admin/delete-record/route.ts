import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { isAdminEmail } from '@/lib/adminAuth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    const userEmail = user?.emailAddresses?.[0]?.emailAddress

    // 1. Strict Server-Side Admin Verification
    if (!isAdminEmail(userEmail)) {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { type, ids } = body // ids is an array of record IDs to delete

    if (!type || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid parameters: type and ids array required' }, { status: 400 })
    }

    let deletedCount = 0

    // 2. Direct Deletion in Supabase Postgres Database via Prisma
    if (type === 'interview') {
      const result = await db.interview.deleteMany({
        where: {
          id: { in: ids }
        }
      })
      deletedCount = result.count
    } else if (type === 'user') {
      const result = await db.user.deleteMany({
        where: {
          id: { in: ids }
        }
      })
      deletedCount = result.count
    } else if (type === 'profile') {
      const result = await db.profile.deleteMany({
        where: {
          id: { in: ids }
        }
      })
      deletedCount = result.count
    } else {
      return NextResponse.json({ error: 'Unsupported deletion type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Successfully deleted ${deletedCount} ${type} record(s) permanently from Supabase Postgres database!`
    })

  } catch (error: any) {
    console.error('Error deleting record from Supabase:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete record from Supabase Postgres' }, { status: 500 })
  }
}
