export default function ProblemPanel({ problem }: { problem: any }) {
  if (!problem) return <div className="p-6 text-gray-500">Loading problem...</div>

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800 bg-[#121212]">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-white">{problem.title}</h2>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          problem.difficulty === 'easy' ? 'bg-green-500/10 text-green-400' :
          problem.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          {problem.difficulty}
        </span>
      </div>

      <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed mb-8 whitespace-pre-wrap">
        {problem.description}
      </div>

      {problem.examples?.map((ex: any, i: number) => (
        <div key={i} className="mb-6">
          <div className="text-sm font-medium text-gray-200 mb-2">Example {i + 1}:</div>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 border border-gray-800">
            <div className="mb-1"><span className="text-gray-500">Input:</span> {ex.input}</div>
            <div className="mb-1"><span className="text-gray-500">Output:</span> {ex.output}</div>
            {ex.explanation && (
              <div className="mt-2 text-gray-400 font-sans"><span className="text-gray-500 font-mono">Explanation:</span> {ex.explanation}</div>
            )}
          </div>
        </div>
      ))}

      {problem.constraints?.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-200 mb-2">Constraints:</div>
          <ul className="list-disc list-inside space-y-1">
            {problem.constraints.map((c: string, i: number) => (
              <li key={i} className="text-sm text-gray-400 font-mono bg-gray-800/50 inline-block px-2 py-0.5 rounded mr-2 mb-2">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
