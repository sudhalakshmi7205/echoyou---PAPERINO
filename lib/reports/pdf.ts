import puppeteer from 'puppeteer'
import { db } from '@/lib/db'

export async function generateReportPDF(interviewId: string): Promise<Buffer> {
  const report = await db.report.findUnique({
    where: { interviewId },
    include: { interview: true }
  })

  if (!report) throw new Error("Report not found")

  const html = buildReportHTML(report)

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(html)

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
  })

  await browser.close()
  return Buffer.from(pdf)
}

function buildReportHTML(report: any): string {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1a1a1a; margin: 0; padding: 0; }
  .header { background: #0f0f1a; color: white; padding: 32px; margin-bottom: 24px; }
  .header h1 { font-size: 24px; font-weight: 500; margin: 0 0 4px; }
  .header p  { font-size: 14px; color: rgba(255,255,255,.6); margin: 0; }
  .score-hero { font-size: 64px; font-weight: 500; color: #7F77DD; }
  .section { padding: 0 32px 24px; }
  .section h2 { font-size: 16px; font-weight: 500; margin: 0 0 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
  .dim-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .dim-name { font-size: 13px; color: #666; min-width: 160px; }
  .dim-bar { flex: 1; height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; }
  .dim-fill { height: 6px; background: #534AB7; border-radius: 3px; }
  .dim-score { font-size: 13px; font-weight: 500; min-width: 36px; text-align: right; }
  .strength { background: #E1F5EE; color: #085041; padding: 6px 10px; border-radius: 6px; font-size: 12px; margin-bottom: 5px; }
  .weakness { background: #FAECE7; color: #712B13; padding: 6px 10px; border-radius: 6px; font-size: 12px; margin-bottom: 5px; }
  .plan-box { background: #f8f8ff; border-left: 3px solid #534AB7; padding: 10px 14px; border-radius: 0 6px 6px 0; font-size: 13px; line-height: 1.6; margin-bottom: 8px; }
</style>
</head>
<body>
  <div class="header">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <h1>Echo — Interview Report</h1>
        <p>${report.interview.role} · ${report.interview.company ?? 'General'} · ${report.interview.difficulty}</p>
        <p style="margin-top:8px;font-size:12px;color:rgba(255,255,255,.4)">${new Date(report.generatedAt).toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'})}</p>
      </div>
      <div style="text-align:right">
        <div class="score-hero">${Math.round(report.overallScore)}</div>
        <div style="font-size:13px;color:rgba(255,255,255,.6)">${report.verdict.replace('_',' ')}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Dimension scores</h2>
    ${[
      ['Technical',       report.technicalScore],
      ['Communication',   report.communicationScore],
      ['Problem solving', report.problemSolvingScore],
      ['Confidence',      report.confidenceScore],
      ['Coding',          report.codingScore],
      ['Behavioural',     report.behaviouralScore],
      ['Resume knowledge',report.resumeKnowledgeScore],
    ].filter(([,s]) => s !== null).map(([name, score]) => `
      <div class="dim-row">
        <span class="dim-name">${name}</span>
        <div class="dim-bar"><div class="dim-fill" style="width:${score}%"></div></div>
        <span class="dim-score">${Math.round(score as number)}</span>
      </div>`).join('')}
  </div>

  <div class="section">
    <h2>Strengths</h2>
    ${report.strengths.map((s: string) => `<div class="strength">${s}</div>`).join('')}
    <h2 style="margin-top:16px">Weaknesses</h2>
    ${report.weaknesses.map((w: string) => `<div class="weakness">${w}</div>`).join('')}
  </div>

  <div class="section">
    <h2>Improvement plan</h2>
    <p style="font-size:12px;color:#666;margin-bottom:8px">30 days</p>
    <div class="plan-box">${(report.improvementPlan as any).thirtyDay}</div>
    <p style="font-size:12px;color:#666;margin-bottom:8px">60 days</p>
    <div class="plan-box">${(report.improvementPlan as any).sixtyDay}</div>
    <p style="font-size:12px;color:#666;margin-bottom:8px">90 days</p>
    <div class="plan-box">${(report.improvementPlan as any).ninetyDay}</div>
  </div>
</body>
</html>`
}
