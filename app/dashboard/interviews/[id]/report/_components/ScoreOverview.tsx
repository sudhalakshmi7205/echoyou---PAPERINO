import { Check, X } from 'lucide-react'

export default function ScoreOverview({ report }: { report: any }) {
  const isHire = ['strong_hire', 'hire'].includes(report.verdict)
  const verdictLabel = report.verdict.replace('_', ' ').toUpperCase()
  
  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Evaluation Report</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-light text-purple-400">{report.overallScore}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">Overall score</div>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium mb-2 ${
            isHire ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                     'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {isHire ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {verdictLabel}
          </div>
          <div className="text-xs text-gray-500">
            {report.interview?.company} · {report.interview?.role} · {report.interview?.difficulty}
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-4 text-sm text-gray-300 border border-gray-800 leading-relaxed">
        {report.summary || "The AI evaluator did not provide a summary for this interview."}
      </div>
    </div>
  )
}
