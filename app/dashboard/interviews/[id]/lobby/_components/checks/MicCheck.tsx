'use client'
import { useEffect, useRef, useState } from 'react'
import CheckRow from '../CheckRow'
import { CheckResult } from '../LobbyShell'
import { Mic } from 'lucide-react'

export default function MicCheck({ 
  result, 
  stream, 
  onRetry 
}: { 
  result: CheckResult, 
  stream: MediaStream | null, 
  onRetry: () => void 
}) {
  const [level, setLevel] = useState(0)
  const animRef = useRef<number | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  useEffect(() => {
    if (result.status !== 'pass' || !stream) return

    const ctx = new window.AudioContext()
    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)
    analyserRef.current = analyser

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    function tick() {
      analyser.getByteFrequencyData(dataArray)
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      setLevel(Math.min(100, avg * 2))
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      ctx.close()
    }
  }, [result.status, stream])

  return (
    <CheckRow result={result} icon={Mic} name="Microphone" onRetry={onRetry}>
      {result.status === 'pass' && (
        <div className="flex items-center gap-1 h-5 mr-4">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="w-1 rounded-sm bg-green-500 transition-all duration-75"
              style={{ height: `${Math.max(15, level - i * 8)}%` }}
            />
          ))}
        </div>
      )}
    </CheckRow>
  )
}
