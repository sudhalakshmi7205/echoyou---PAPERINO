export default function ConsoleOutput({
  output,
  error
}: {
  output?: string
  error?: string
}) {
  if (!output && !error) return null

  return (
    <div className="h-32 border-t border-gray-800 bg-[#121212] flex flex-col">
      <div className="px-4 py-1.5 border-b border-gray-800 bg-gray-900/50 text-xs font-medium text-gray-400">
        Console
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs whitespace-pre-wrap">
        {error ? (
          <span className="text-red-400">{error}</span>
        ) : (
          <span className="text-gray-300">{output}</span>
        )}
      </div>
    </div>
  )
}
