import { Target, Calendar, ChevronRight } from 'lucide-react'

export default function ATSHistoryColumn({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-[#111620] border border-gray-800 rounded-2xl p-6 text-center text-gray-500 text-sm flex flex-col items-center justify-center h-full min-h-[200px]">
        No previous ATS scans found.
      </div>
    )
  }

  return (
    <div className="bg-[#111620] border border-gray-800 rounded-2xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-800 bg-[#0B0E14]">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400" />
          Past ATS Scans
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[600px] scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {history.map((scan) => (
          <div key={scan.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-cyan-500/30 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(scan.createdAt).toLocaleDateString()}
              </span>
              <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                scan.matchScore >= 80 ? 'bg-green-500/20 text-green-400' :
                scan.matchScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {scan.matchScore}%
              </div>
            </div>
            
            <p className="text-sm text-gray-300 font-medium line-clamp-2 leading-snug">
              {scan.targetRole !== 'Custom Role' ? scan.targetRole : (
                scan.jobDescription.substring(0, 80) + '...'
              )}
            </p>
            
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Format: {scan.formatScore}/10</span>
              <span>Keywords: {scan.keywordScore}/10</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
