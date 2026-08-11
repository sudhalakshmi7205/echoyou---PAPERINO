import { db } from '@/lib/db'

export async function createShareLink(interviewId: string): Promise<string> {
  const existing = await db.shareableReport.findUnique({ where: { interviewId } })
  
  // Use a generic NEXT_PUBLIC_APP_URL, defaulting to localhost for dev
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (existing) return `${baseUrl}/r/${existing.token}`

  const share = await db.shareableReport.create({
    data: {
      interviewId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }
  })
  
  return `${baseUrl}/r/${share.token}`
}
