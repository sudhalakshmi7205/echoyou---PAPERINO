'use client'
import { useEffect, useRef } from 'react'
import CheckRow from '../CheckRow'
import { CheckResult } from '../LobbyShell'
import { Camera } from 'lucide-react'

export default function CameraCheck({ 
  result, 
  onRetry 
}: { 
  result: CheckResult, 
  onRetry: () => void 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (result.status !== 'pass') return
    let active = true
    let currentStream: MediaStream | null = null

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (!active) {
        stream.getTracks().forEach(t => t.stop())
        return
      }
      currentStream = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    }).catch(console.error)

    return () => {
      active = false
      if (currentStream) {
        currentStream.getTracks().forEach(t => t.stop())
      }
    }
  }, [result.status])

  return (
    <CheckRow result={result} icon={Camera} name="Camera" onRetry={onRetry}>
      {result.status === 'pass' && (
        <video
          ref={videoRef}
          className="w-20 h-14 rounded-md object-cover bg-black mr-4"
          muted
          playsInline
        />
      )}
    </CheckRow>
  )
}
