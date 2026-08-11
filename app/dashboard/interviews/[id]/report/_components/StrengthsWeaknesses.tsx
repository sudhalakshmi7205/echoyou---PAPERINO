export default function StrengthsWeaknesses({ report }: { report: any }) {
  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 shadow-xl flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1 h-4 bg-teal-500 rounded-full"></span>
        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Strengths & Weaknesses</span>
      </div>

      <div className="grid grid-cols-1 gap-6 flex-1">
        <div>
          <div className="text-xs font-medium text-teal-500 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            Strengths
          </div>
          <div className="space-y-2">
            {report.strengths?.map((s: string, i: number) => (
              <div key={i} className="bg-teal-500/5 border border-teal-500/10 rounded-lg p-3 text-sm text-teal-100/80">
                {s}
              </div>
            ))}
            {(!report.strengths || report.strengths.length === 0) && (
              <div className="text-sm text-gray-500 italic">No specific strengths highlighted.</div>
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-red-400 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Weaknesses
          </div>
          <div className="space-y-2">
            {report.weaknesses?.map((w: string, i: number) => (
              <div key={i} className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 text-sm text-red-100/80">
                {w}
              </div>
            ))}
            {(!report.weaknesses || report.weaknesses.length === 0) && (
              <div className="text-sm text-gray-500 italic">No major weaknesses identified.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
