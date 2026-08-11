import { useEffect, useRef } from 'react'
import TranscriptLine from './TranscriptLine'
import AIThinkingAnimation from './AIThinkingAnimation'

export default function ConversationView({
  messages,
  isThinking
}: {
  messages: Array<{ id: string; role: 'assistant' | 'user'; content: string; streaming?: boolean }>
  isThinking: boolean
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
      {messages.length === 0 && !isThinking && (
        <div className="h-full flex items-center justify-center text-gray-500 italic text-sm">
          Connecting to AI Interviewer...
        </div>
      )}
      
      {messages.map(m => (
        <TranscriptLine 
          key={m.id} 
          role={m.role} 
          content={m.content} 
          streaming={m.streaming} 
        />
      ))}
      
      {isThinking && <AIThinkingAnimation />}
      
      <div ref={bottomRef} className="h-4" />
    </div>
  )
}
