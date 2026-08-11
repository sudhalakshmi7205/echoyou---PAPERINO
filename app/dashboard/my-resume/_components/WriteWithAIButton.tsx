import { useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function WriteWithAIButton({
  onGenerate,
  type,
  currentText
}: {
  onGenerate: (text: string) => void
  type: 'summary' | 'bullets'
  currentText: string
}) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentText || 'Generate a professional entry based on my profile',
          type
        })
      })
      const data = await res.json()
      if (data.result) {
        onGenerate(data.result)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
    >
      <Sparkles className="w-3.5 h-3.5" />
      {isGenerating ? 'Generating...' : 'Write with AI'}
    </button>
  )
}
