import { Maximize2, Minimize2 } from "lucide-react"

export default function EditorToolbar({
  language,
  setLanguage,
  isFullscreen,
  toggleFullscreen
}: {
  language: string
  setLanguage: (l: string) => void
  isFullscreen: boolean
  toggleFullscreen: () => void
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-800">
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-3"
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="go">Go</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>

      <button
        onClick={toggleFullscreen}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  )
}
