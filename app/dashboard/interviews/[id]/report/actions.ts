'use server'

import { createShareLink } from '@/lib/reports/share'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function generateShareLink(interviewId: string) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
    
  // verify ownership
  const interview = await db.interview.findUnique({
    where: { id: interviewId, clerkId: user.id }
  })
  
  if (!interview) throw new Error("Unauthorized")

  return await createShareLink(interviewId)
}
