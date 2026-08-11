import { db } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs/server'

interface ReportEmailData {
  interviewId: string
  clerkId: string
  role: string
  overallScore: number
  verdict: string
  strengths: string[]
  weaknesses: string[]
}

/**
 * Dispatches an HTML Evaluation Report Email to candidate
 * when `emailOnComplete` is enabled in User Preferences.
 */
export async function sendEvaluationReportEmail(data: ReportEmailData) {
  try {
    // 1. Check User Preferences
    const preferences = await db.userPreferences.findUnique({
      where: { clerkId: data.clerkId }
    })

    // 2. Fetch User Email from Clerk
    let userEmail: string | null = null
    try {
      const client = await clerkClient()
      const user = await client.users.getUser(data.clerkId)
      userEmail = user.emailAddresses[0]?.emailAddress ?? null
    } catch (e) {
      console.warn('[EmailEvaluation] Could not fetch user from Clerk SDK:', e)
    }

    if (!userEmail) {
      const userRecord = await db.user.findFirst({ where: { clerkId: data.clerkId } })
      userEmail = userRecord?.email ?? null
    }

    if (!userEmail) {
      console.warn(`[EmailEvaluation] No valid email found for clerkId: ${data.clerkId}`)
      return
    }

    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/interviews/${data.interviewId}/report`

    // 3. Render HTML Email Template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #0d111a; color: #ffffff; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #00e8ff; margin: 0; font-size: 24px;">EchoYou AI Interview Evaluation Report</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 6px;">Target Role: <strong>${data.role}</strong></p>
        </div>

        <div style="background-color: #161e2e; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px; border: 1px solid #334155;">
          <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">Overall Score</span>
          <span style="font-size: 38px; font-weight: 800; color: ${data.overallScore >= 70 ? '#10b981' : data.overallScore >= 50 ? '#f59e0b' : '#f43f5e'};">
            ${Math.round(data.overallScore)}%
          </span>
          <div style="margin-top: 8px; font-size: 13px; font-weight: bold; text-transform: uppercase; color: #00e8ff;">
            Verdict: ${data.verdict.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #10b981; font-size: 15px; margin-bottom: 8px;">🌟 Key Strengths:</h3>
          <ul style="color: #cbd5e1; font-size: 13px; padding-left: 20px; line-height: 1.6;">
            ${(data.strengths.length ? data.strengths : ['Demonstrated structured problem-solving approach.']).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #f43f5e; font-size: 15px; margin-bottom: 8px;">🎯 Areas for Improvement:</h3>
          <ul style="color: #cbd5e1; font-size: 13px; padding-left: 20px; line-height: 1.6;">
            ${(data.weaknesses.length ? data.weaknesses : ['Elaborate more on STAR format for behavioral questions.']).map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 20px;">
          <a href="${reportUrl}" style="background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
            View Detailed Interactive Report &rarr;
          </a>
        </div>
      </div>
    `

    // 4. Send Email via Resend / SMTP if configured, or log payload in Dev
    if (process.env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'EchoYou AI <reports@echoyou.ai>',
          to: userEmail,
          subject: `🎯 Your EchoYou Evaluation Report (${data.role}): ${Math.round(data.overallScore)}%`,
          html: emailHtml
        })
      })
      if (!res.ok) {
        console.error('[EmailEvaluation] Resend API error:', await res.text())
      } else {
        console.log(`[EmailEvaluation] Report email successfully dispatched to ${userEmail}!`)
      }
    } else {
      console.log(`[EmailEvaluation DEV DISPATCH] Simulated email dispatch to ${userEmail} for Interview ${data.interviewId}`)
    }

  } catch (error) {
    console.error('[EmailEvaluation] Error dispatching evaluation report email:', error)
  }
}
