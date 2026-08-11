'use client'
import { useEffect, useState } from 'react'

export default function CountdownTimer({
  seconds = 5,
  onComplete
}: {
  seconds?: number
  onComplete: () => void
}) {
  const [count, setCount] = useState(seconds)

  useEffect(() => {
    if (count <= 0) {
      onComplete()
      return
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [count, onComplete])

  return (
    <div className="bg-purple-600 rounded-xl p-8 text-center text-white shadow-[0_0_40px_rgba(168,85,247,0.3)] animate-in zoom-in duration-500">
      <div className="text-6xl font-medium mb-4">{count === 0 ? '🚀' : count}</div>
      <h2 className="text-xl font-medium mb-2">All systems ready</h2>
      <p className="text-sm text-purple-200 mb-6">
        {count > 0 ? `Launching your interview in ${count} seconds…` : 'Launching…'}
      </p>
      <button
        onClick={onComplete}
        className="bg-white text-purple-600 hover:bg-gray-100 rounded-lg px-8 py-3 text-sm font-medium transition-colors"
      >
        Start Session Now &rarr;
      </button>
    </div>
  )
}
