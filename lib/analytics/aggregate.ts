import { db } from '@/lib/db'

export async function getAnalyticsData(clerkId: string) {
  const reports = await db.report.findMany({
    where: { interview: { clerkId } },
    include: { interview: { select: { type: true, role: true, company: true, createdAt: true } } },
    orderBy: { generatedAt: 'asc' }
  })

  if (reports.length === 0) return null

  // Skill radar — average of all time
  const skillRadar = {
    technical:       avg(reports, 'technicalScore'),
    communication:   avg(reports, 'communicationScore'),
    problemSolving:  avg(reports, 'problemSolvingScore'),
    confidence:      avg(reports, 'confidenceScore'),
    coding:          avg(reports.filter(r => r.codingScore !== null), 'codingScore'),
    behavioural:     avg(reports, 'behaviouralScore'),
    resumeKnowledge: avg(reports, 'resumeKnowledgeScore'),
  }

  // Score trend over time
  const scoreTrend = reports.map(r => ({
    date: r.generatedAt,
    overall: r.overallScore,
    technical: r.technicalScore,
    communication: r.communicationScore,
    coding: r.codingScore,
  }))

  // Heatmap — interview count per day
  const heatmap = buildHeatmap(reports.map(r => r.generatedAt))

  // Streak calculation
  const streak = computeStreak(reports.map(r => r.generatedAt))

  // XP — 10 XP per interview + bonuses
  const xp = computeXP(reports)

  // Most improved skill
  const mostImproved = getMostImproved(reports)

  // Top-level stats
  const stats = {
    totalInterviews: reports.length,
    avgScore: Math.round(avg(reports, 'overallScore')),
    bestScore: Math.max(...reports.map(r => r.overallScore)),
    hireRate: Math.round(
      (reports.filter(r => ['hire','strong_hire'].includes(r.verdict)).length / reports.length) * 100
    ),
  }

  return { skillRadar, scoreTrend, heatmap, streak, xp, mostImproved, stats }
}

function avg(arr: any[], key: string): number {
  if (!arr.length) return 0
  return Math.round(arr.reduce((s, r) => s + (r[key] ?? 0), 0) / arr.length)
}

function computeStreak(dates: Date[]): number {
  if (!dates.length) return 0
  const days = [...new Set(dates.map(d => d.toISOString().split('T')[0]))].sort().reverse()
  let streak = 0
  let current = new Date()
  current.setHours(0,0,0,0) // Normalize to midnight
  
  for (const day of days) {
    const d = new Date(day)
    d.setHours(0,0,0,0)
    const diff = Math.floor((current.getTime() - d.getTime()) / 86400000)
    if (diff <= 1) { 
      streak++ 
      current = d 
    } else {
      break
    }
  }
  return streak
}

function buildHeatmap(dates: Date[]) {
  const counts: Record<string, number> = {}
  dates.forEach(d => {
    const key = d.toISOString().split('T')[0]
    counts[key] = (counts[key] ?? 0) + 1
  })
  return counts
}

function computeXP(reports: any[]): number {
  return reports.reduce((xp, r) => {
    let pts = 10
    if (r.overallScore >= 80) pts += 5
    if (r.overallScore >= 90) pts += 10
    if (r.verdict === 'strong_hire') pts += 15
    return xp + pts
  }, 0)
}

function getMostImproved(reports: any[]): string {
  if (reports.length < 2) return 'N/A'
  const first = reports[0]
  const last = reports[reports.length - 1]
  const dims = ['technicalScore','communicationScore','problemSolvingScore','confidenceScore','behaviouralScore']
  const labels: Record<string, string> = {
    technicalScore: 'Technical', 
    communicationScore: 'Communication',
    problemSolvingScore: 'Problem solving', 
    confidenceScore: 'Confidence', 
    behaviouralScore: 'Behavioural'
  }
  const biggest = dims.reduce((best, dim) =>
    (last[dim] - first[dim]) > (last[best] - first[best]) ? dim : best
  , dims[0])
  return labels[biggest]
}
