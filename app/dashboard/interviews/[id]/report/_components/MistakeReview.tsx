'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function MistakeReview({ mistakes }: { mistakes: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Mistake Review</span>
      </div>

      <div className="space-y-3">
        {mistakes.map((m: any, i: number) => {
          const isOpen = openIndex === i
          return (
            <div key={i} className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/30">
              <button 
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start gap-3 pr-4">
                  <div className="text-orange-500 mt-0.5 text-xs font-mono">Q{m.questionIndex ?? i + 1}</div>
                  <div className="text-sm text-gray-300 font-medium">{m.question}</div>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
              </button>

              {isOpen && (
                <div className="p-4 border-t border-gray-800 bg-gray-900/50 space-y-4">
                  <div>
                    <div className="text-xs text-red-400 uppercase font-semibold mb-1">The Mistake</div>
                    <div className="text-sm text-gray-400 bg-red-950/20 p-3 rounded border border-red-900/30">
                      {m.mistake}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-green-400 uppercase font-semibold mb-1">The Correction</div>
                    <div className="text-sm text-gray-400 bg-green-950/20 p-3 rounded border border-green-900/30">
                      {m.correction}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
