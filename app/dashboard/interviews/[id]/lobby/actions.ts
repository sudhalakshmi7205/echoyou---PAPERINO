'use server'
import { db } from '@/lib/db'

export async function saveInterviewerPreferences(interviewId: string, voice: string, avatar: string) {
  await db.interview.update({
    where: { id: interviewId },
    data: { 
      interviewerVoice: voice,
      interviewerAvatar: avatar
    }
  })
}
