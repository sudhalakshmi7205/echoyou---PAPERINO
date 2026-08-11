import { Bot, User } from 'lucide-react'

export default function TranscriptLine({
  role,
  content,
  streaming
}: {
  role: 'assistant' | 'user'
  content: string
  streaming?: boolean
}) {
  const isAI = role === 'assistant'

  return (
    <div className={`flex items-start gap-4 ${isAI ? '' : 'flex-row-reverse'} animate-in fade-in slide-in-from-bottom-2`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
        isAI 
          ? 'bg-purple-600/20 border-purple-500/30' 
          : 'bg-blue-600/20 border-blue-500/30'
      }`}>
        {isAI ? <Bot className="w-5 h-5 text-purple-400" /> : <User className="w-5 h-5 text-blue-400" />}
      </div>
      
      <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 border ${
        isAI 
          ? 'bg-gray-800/80 rounded-tl-sm border-gray-700/50 text-gray-200' 
          : 'bg-blue-600/20 rounded-tr-sm border-blue-500/20 text-blue-100'
      }`}>
        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
          {content}
          {streaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-purple-400 animate-pulse" />}
        </div>
      </div>
    </div>
  )
}
