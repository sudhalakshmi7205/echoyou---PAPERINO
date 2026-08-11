import { db } from '@/lib/db'

export async function dispatchATSWebhook(interviewId: string) {
  try {
    const report = await db.report.findUnique({
      where: { interviewId },
      include: {
        interview: {
          include: {
            shareableReport: true
          }
        }
      }
    })

    if (!report) return

    // Get the user's/company's registered webhook
    const webhook = await db.webhook.findUnique({
      where: { clerkId: report.interview.clerkId }
    })

    if (!webhook || !webhook.isActive || !webhook.url) return

    // Build the JSON payload for the ATS
    const payload = {
      event: 'interview.completed',
      candidate: {
        id: report.interview.clerkId,
      },
      interview: {
        id: interviewId,
        role: report.interview.role,
        type: report.interview.type,
        difficulty: report.interview.difficulty,
      },
      results: {
        verdict: report.verdict,
        overallScore: report.overallScore,
        technicalScore: report.technicalScore,
        communicationScore: report.communicationScore,
        problemSolvingScore: report.problemSolvingScore,
        behaviouralScore: report.behaviouralScore,
      },
      links: {
        publicReport: report.interview.shareableReport 
          ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/r/${report.interview.shareableReport.token}`
          : null
      },
      timestamp: new Date().toISOString()
    }

    // Fire the webhook
    const res = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Echo-ATS-Integration/1.0'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      console.error(`Webhook dispatch failed: ${res.status} ${res.statusText}`)
    }
  } catch (error) {
    console.error("Failed to dispatch ATS webhook", error)
  }
}
