import { Bot } from 'lucide-react'

export default function AIThinkingAnimation() {
  return (
    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0 border border-purple-500/30">
        <Bot className="w-5 h-5 text-purple-400" />
      </div>
      <div className="bg-gray-800/80 rounded-2xl rounded-tl-sm px-5 py-4 border border-gray-700/50 flex items-center gap-1.5 h-12">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
      </div>
    </div>
  )
}
