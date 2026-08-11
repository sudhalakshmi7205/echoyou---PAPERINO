import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check if admin
    const adminUser = await db.user.findUnique({ where: { clerkId: user.id } })
    if (!adminUser?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { content, type } = await req.json()

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to update prompt", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
