import { useEffect, useState } from 'react'

export default function QuestionTimer({ isActive, durationSeconds = 120, onTimeUp }: { isActive: boolean, durationSeconds?: number, onTimeUp?: () => void }) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds)

  useEffect(() => {
    if (!isActive) return
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp()
      return
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [isActive, timeLeft, onTimeUp])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className={`text-sm font-medium ${timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
      {mins}:{secs.toString().padStart(2, '0')}
    </div>
  )
}
