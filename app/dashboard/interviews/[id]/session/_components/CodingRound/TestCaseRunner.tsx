import { Play } from 'lucide-react'

export default function TestCaseRunner({
  testCases,
  results,
  onRun,
  isRunning,
  onSubmit,
  isSubmitting
}: {
  testCases: any[]
  results: any[]
  onRun: () => void
  isRunning: boolean
  onSubmit: () => void
  isSubmitting: boolean
}) {
  return (
    <div className="h-64 border-t border-gray-800 bg-[#1e1e1e] flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50">
        <div className="text-sm font-medium text-gray-300">Test Cases</div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {isRunning ? (
              <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Run Code
          </button>
          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex gap-4">
        {testCases.map((tc, i) => {
          const result = results.find(r => r.index === i)
          const passed = result?.passed

          return (
            <div key={i} className="flex-1 bg-gray-900/50 rounded-lg border border-gray-800 p-3 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-medium text-gray-400">Case {i + 1}</div>
                {result && (
                  <div className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {passed ? 'Passed' : 'Failed'}
                  </div>
                )}
              </div>
              
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="text-gray-500 mb-1">Input:</div>
                  <div className="text-gray-300 break-all">{tc.input}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Expected:</div>
                  <div className="text-gray-300 break-all">{tc.expected}</div>
                </div>
                {result && (
                  <div>
                    <div className="text-gray-500 mb-1">Output:</div>
                    <div className={`break-all ${passed ? 'text-gray-300' : 'text-red-400'}`}>
                      {result.actual || result.stderr || 'No output'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
