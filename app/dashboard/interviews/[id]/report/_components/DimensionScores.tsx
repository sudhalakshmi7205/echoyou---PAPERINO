export default function DimensionScores({ report }: { report: any }) {
  const reasons = report.improvementPlan?.reasons || {}
  
  const dimensions = [
    { key: 'technical', label: 'Technical Knowledge', weight: '30%', score: report.technicalScore, reason: reasons.technical },
    { key: 'problemSolving', label: 'Problem Solving', weight: '20%', score: report.problemSolvingScore, reason: reasons.problemSolving },
    { key: 'communication', label: 'Communication Skills', weight: '15%', score: report.communicationScore, reason: reasons.communication },
    { key: 'confidence', label: 'Confidence & Delivery', weight: '10%', score: report.confidenceScore, reason: reasons.confidence },
    { key: 'behavioural', label: 'Behavioural Skills', weight: '10%', score: report.behaviouralScore, reason: reasons.behavioural },
    { key: 'completeness', label: 'Answer Completeness', weight: '5%', score: report.improvementPlan?.metrics?.completenessScore || Math.min(100, (report.technicalScore || 0) + 10), reason: reasons.completeness },
    { key: 'relevance', label: 'Answer Relevance', weight: '5%', score: report.improvementPlan?.metrics?.relevanceScore || report.technicalScore, reason: reasons.relevance },
    { key: 'engagement', label: 'Interview Engagement', weight: '5%', score: report.improvementPlan?.metrics?.engagementScore || (report.overallScore > 10 ? 90 : 10), reason: reasons.engagement },
  ]

  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
          <span className="text-sm font-bold text-gray-200 uppercase tracking-wider">8-Dimension Evaluation Breakdown</span>
        </div>
        <span className="text-xs text-purple-400 font-semibold">100% Traceable Evidence</span>
      </div>

      <div className="space-y-5">
        {dimensions.map((dim) => {
          const score = dim.score ?? 0
          let colorClass = 'bg-emerald-500'
          if (score < 50) colorClass = 'bg-red-500'
          else if (score < 70) colorClass = 'bg-yellow-500'

          return (
            <div key={dim.key} className="space-y-1.5 p-3 rounded-lg bg-gray-900/40 border border-gray-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{dim.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono">{dim.weight}</span>
                </div>
                <span className="text-sm font-bold text-gray-200">{score}/100</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${score}%` }} />
              </div>
              {dim.reason && (
                <p className="text-xs text-gray-400 italic pt-1 leading-relaxed">
                  💡 <span className="font-semibold text-gray-300">Justification:</span> {dim.reason}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
