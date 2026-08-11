'use client'
import CheckRow from '../CheckRow'
import { CheckResult } from '../LobbyShell'
import { Volume2, Play } from 'lucide-react'

export default function SpeakerCheck({ result }: { result: CheckResult }) {
  function playTone() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.value = 440  // A4 note
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 1)
  }

  return (
    <CheckRow result={result} icon={Volume2} name="Speaker">
      {result.status === 'pass' && (
        <button
          onClick={playTone}
          className="text-xs border border-gray-600 hover:bg-gray-700 rounded px-3 py-1.5 flex items-center gap-1.5 mr-4 text-gray-200 transition-colors"
        >
          <Play className="w-3 h-3" /> Play test
        </button>
      )}
    </CheckRow>
  )
}
