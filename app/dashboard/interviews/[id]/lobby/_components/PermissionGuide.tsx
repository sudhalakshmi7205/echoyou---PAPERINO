'use client'
import { AlertTriangle } from 'lucide-react'
import { CheckResult } from './LobbyShell'

const GUIDES = {
  mic: {
    title: 'How to allow microphone access',
    steps: [
      'Click the 🔒 lock icon in your browser address bar',
      'Find "Microphone" and set it to "Allow"',
      'Refresh the page and run checks again',
    ]
  },
  camera: {
    title: 'How to allow camera access',
    steps: [
      'Click the 🔒 lock icon in your browser address bar',
      'Find "Camera" and set it to "Allow"',
      'Refresh the page and run checks again',
    ]
  }
}

export default function PermissionGuide({ checks }: { checks: Record<string, CheckResult> }) {
  const failedMic = checks.mic?.status === 'fail' && checks.mic?.detail.includes('Permission')
  const failedCam = checks.camera?.status === 'fail' && checks.camera?.detail.includes('Permission')
  
  const guide = failedMic ? GUIDES.mic : failedCam ? GUIDES.camera : null
  if (!guide) return null

  return (
    <div className="border border-red-900/50 bg-red-500/10 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" /> {guide.title}
      </h3>
      <div className="space-y-2">
        {guide.steps.map((step, i) => (
          <p key={i} className="text-sm text-red-200/80">
            {i + 1}. {step}
          </p>
        ))}
      </div>
    </div>
  )
}
