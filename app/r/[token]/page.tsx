import { db } from '@/lib/db'
import ScoreOverview from '@/app/dashboard/interviews/[id]/report/_components/ScoreOverview'
import DimensionScores from '@/app/dashboard/interviews/[id]/report/_components/DimensionScores'
import StrengthsWeaknesses from '@/app/dashboard/interviews/[id]/report/_components/StrengthsWeaknesses'
import ImprovementPlan from '@/app/dashboard/interviews/[id]/report/_components/ImprovementPlan'

export default async function PublicReportPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = await params
  
  const share = await db.shareableReport.findUnique({
    where: { token: resolvedParams.token },
    include: { interview: { include: { report: true } } }
  })

  if (!share || share.expiresAt < new Date()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
        <h1 className="text-2xl font-bold mb-2">Report Not Found or Expired</h1>
        <p className="text-gray-400">This shareable link is no longer valid.</p>
      </div>
    )
  }

  const report = share.interview.report

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
        <h1 className="text-2xl font-bold mb-2">Report Not Generated</h1>
        <p className="text-gray-400">This interview has not been evaluated yet.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Echo Evaluation Report</h1>
            <p className="text-gray-400 text-sm mt-1">Shared publicly (Valid until {share.expiresAt.toLocaleDateString()})</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium text-white">{share.interview.role}</div>
            <div className="text-sm text-gray-500 capitalize">{share.interview.type.replace('_', ' ')} • {share.interview.difficulty}</div>
          </div>
        </div>

        <ScoreOverview report={report} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DimensionScores report={report} />
          <StrengthsWeaknesses report={report} />
        </div>
        
        {report.improvementPlan && <ImprovementPlan plan={report.improvementPlan} />}

        <div className="mt-12 text-center border-t border-gray-800 pt-8">
          <p className="text-gray-500 text-sm">Powered by Echo — Your Personal AI Interviewer</p>
        </div>
      </div>
    </div>
  )
}
