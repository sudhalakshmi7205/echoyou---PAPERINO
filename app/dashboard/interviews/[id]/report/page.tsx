'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ScoreOverview from './_components/ScoreOverview'
import DimensionScores from './_components/DimensionScores'
import StrengthsWeaknesses from './_components/StrengthsWeaknesses'
import MistakeReview from './_components/MistakeReview'
import ImprovementPlan from './_components/ImprovementPlan'
import ShareButton from './_components/ShareButton'
import DownloadPDF from './_components/DownloadPDF'
import { use } from 'react'

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout
    async function checkReport() {
      try {
        const statusRes = await fetch(`/api/interviews/${resolvedParams.id}/report/status`)
        const { ready } = await statusRes.json()

        if (ready) {
          // Fetch full report data (we'll implement this API or use server actions)
          const dataRes = await fetch(`/api/interviews/${resolvedParams.id}/report/data`)
          const data = await dataRes.json()
          setReport(data.report)
          setLoading(false)
          clearInterval(interval)
        }
      } catch (err) {
        console.error("Failed to check report status", err)
      }
    }

    checkReport() // initial check
    interval = setInterval(checkReport, 3000)

    return () => clearInterval(interval)
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
        <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-500 rounded-full animate-spin mb-6" />
        <h1 className="text-2xl font-bold mb-2">Generating your report...</h1>
        <p className="text-gray-400">Echo is evaluating your performance across 7 dimensions.</p>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="min-h-screen bg-[#121212] p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-white">Evaluation Report</h1>
          <div className="flex items-center gap-4">
            <ShareButton interviewId={resolvedParams.id} />
            <DownloadPDF interviewId={resolvedParams.id} />
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg ml-4"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <ScoreOverview report={report} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DimensionScores report={report} />
          <StrengthsWeaknesses report={report} />
        </div>

        {report.mistakes?.length > 0 && <MistakeReview mistakes={report.mistakes} />}
        
        {report.improvementPlan && <ImprovementPlan plan={report.improvementPlan} />}
      </div>
    </div>
  )
}
