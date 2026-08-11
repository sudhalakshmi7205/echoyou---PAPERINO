import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

export async function DELETE(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await db.resume.updateMany({
      where: { clerkId: user.id, isActive: true },
      data: { isActive: false }
    })
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting resume:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
