import { Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react'

export default function FeedbackHighlights({ interviews }: { interviews: any[] }) {
  // Find the most recent interview that has a report
  const latestWithReport = interviews.find(i => i.status === 'completed' && i.report)
  
  if (!latestWithReport) {
    return (
      <div className="bg-[#111620]/60 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-gray-100">AI Feedback Highlights</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/30">
          <p className="text-sm text-gray-500 font-medium mb-2">No feedback available yet.</p>
          <p className="text-xs text-gray-600">Complete an interview to see your personalized AI feedback highlights here.</p>
        </div>
      </div>
    )
  }

  const { strengths = [], weaknesses = [] } = latestWithReport.report

  return (
    <div className="bg-[#111620]/60 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-gray-100">Recent Insights</h2>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 bg-gray-800 text-gray-400 rounded-full border border-gray-700">
          From {latestWithReport.role} Interview
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" /> Top Strengths
          </h3>
          <ul className="space-y-3">
            {strengths.slice(0, 3).map((strength: string, i: number) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2 bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{strength}</span>
              </li>
            ))}
            {strengths.length === 0 && (
              <li className="text-sm text-gray-500 italic p-3">Not enough data to determine strengths yet.</li>
            )}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" /> Focus Areas
          </h3>
          <ul className="space-y-3">
            {weaknesses.slice(0, 3).map((weakness: string, i: number) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2 bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{weakness}</span>
              </li>
            ))}
            {weaknesses.length === 0 && (
              <li className="text-sm text-gray-500 italic p-3">No major areas for improvement identified!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
