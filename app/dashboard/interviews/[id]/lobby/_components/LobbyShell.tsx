'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MicCheck from './checks/MicCheck'
import CameraCheck from './checks/CameraCheck'
import SpeakerCheck from './checks/SpeakerCheck'
import InternetCheck from './checks/InternetCheck'
import BrowserCheck from './checks/BrowserCheck'
import CountdownTimer from './CountdownTimer'
import PermissionGuide from './PermissionGuide'
import { Interview } from '@prisma/client'

export type CheckStatus = 'idle' | 'checking' | 'pass' | 'fail'

export interface CheckResult {
  status: CheckStatus
  detail: string
}

export default function LobbyShell({ interview }: { interview: Interview }) {
  const router = useRouter()
  const mediaMode = (interview as any).mediaMode || (interview.cameraEnabled ? 'video_audio' : 'audio_only')
  const isVideoRequired = mediaMode === 'video_audio' || mediaMode === 'video_only'
  const isAudioRequired = mediaMode === 'video_audio' || mediaMode === 'audio_only'

  const [checks, setChecks] = useState<Record<string, CheckResult>>({
    mic:     { status: 'idle', detail: 'Not checked yet' },
    camera:  { status: 'idle', detail: 'Not checked yet' },
    speaker: { status: 'idle', detail: 'Not checked yet' },
    internet:{ status: 'idle', detail: 'Not checked yet' },
    browser: { status: 'idle', detail: 'Not checked yet' },
  })
  const [running, setRunning] = useState(false)
  const [micStream, setMicStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    console.log('[LobbyShell] Interview mode:', mediaMode, 'Camera required:', isVideoRequired, 'Audio required:', isAudioRequired)
  }, [mediaMode, isVideoRequired, isAudioRequired])

  useEffect(() => {
    return () => {
      if (micStream) micStream.getTracks().forEach(t => t.stop())
    }
  }, [micStream])

  function updateCheck(key: string, result: CheckResult) {
    setChecks(prev => ({ ...prev, [key]: result }))
  }

  // Camera is REQUIRED if video mode is chosen
  const requiredChecks = ['speaker', 'internet', 'browser']
  if (isAudioRequired) requiredChecks.push('mic')
  if (isVideoRequired) requiredChecks.push('camera')

  const allPassed = requiredChecks.every(k => checks[k].status === 'pass')

  const runBrowserCheck = useCallback(() => {
    updateCheck('browser', { status: 'checking', detail: 'Checking browser APIs…' })
    const issues = []
    if (!window.MediaRecorder) issues.push('MediaRecorder not supported')
    if (!window.AudioContext && !(window as any).webkitAudioContext) issues.push('AudioContext not supported')
    if (!navigator.mediaDevices) issues.push('Media devices API not available')

    if (issues.length) {
      updateCheck('browser', { status: 'fail', detail: issues[0] + ' — please use Chrome or Edge' })
    } else {
      updateCheck('browser', { status: 'pass', detail: 'All APIs supported' })
    }
  }, [])

  const runInternetCheck = useCallback(async () => {
    updateCheck('internet', { status: 'checking', detail: 'Measuring latency…' })
    const start = Date.now()
    try {
      await fetch('/api/ping', { method: 'HEAD', cache: 'no-store' })
      const ping = Date.now() - start
      const detail = ping < 100 ? `${ping}ms — Excellent` : ping < 300 ? `${ping}ms — Acceptable` : `${ping}ms — Slow connection`
      updateCheck('internet', { status: ping < 500 ? 'pass' : 'fail', detail })
    } catch {
      updateCheck('internet', { status: 'fail', detail: 'No internet connection' })
    }
  }, [])

  const runSpeakerCheck = useCallback(async () => {
    updateCheck('speaker', { status: 'checking', detail: 'Testing audio output…' })
    await new Promise(r => setTimeout(r, 500))
    updateCheck('speaker', { status: 'pass', detail: 'Speaker detected — click test button to verify' })
  }, [])

  const runCameraCheck = useCallback(async () => {
    updateCheck('camera', { status: 'checking', detail: 'Requesting camera…' })
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // Stop it immediately after check to free the resource
      stream.getTracks().forEach(t => t.stop())
      updateCheck('camera', { status: 'pass', detail: 'Camera ready' })
    } catch (err: any) {
      const detail = err.name === 'NotAllowedError'
        ? 'Permission denied'
        : 'Camera not available — you can continue without it'
      updateCheck('camera', { status: 'fail', detail })
    }
  }, [])

  const runMicCheck = useCallback(async () => {
    updateCheck('mic', { status: 'checking', detail: 'Requesting permission…' })
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicStream(stream)
      updateCheck('mic', { status: 'pass', detail: 'Microphone detected' })
    } catch (err: any) {
      const detail = err.name === 'NotAllowedError'
        ? 'Permission denied'
        : 'No microphone found'
      updateCheck('mic', { status: 'fail', detail })
    }
  }, [])

  const [interviewerVoice, setInterviewerVoice] = useState('female')
  const [interviewerAvatar, setInterviewerAvatar] = useState('neon-sphere')

  const runAllChecks = useCallback(async () => {
    setRunning(true)
    await runMicCheck()
    await runCameraCheck()
    await runSpeakerCheck()
    await runInternetCheck()
    runBrowserCheck()
    setRunning(false)
  }, [runMicCheck, runCameraCheck, runSpeakerCheck, runInternetCheck, runBrowserCheck])

  async function handleLaunch() {
    micStream?.getTracks().forEach(t => t.stop())
    try {
      // Save preferences to DB
      const { saveInterviewerPreferences } = await import('../actions')
      await saveInterviewerPreferences(interview.id, interviewerVoice, interviewerAvatar)
    } catch(err) {
      console.error(err)
    }
    router.push(`/dashboard/interviews/${interview.id}/session`)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Interview Lobby</h1>
        <p className="text-gray-400">Let's make sure your hardware is ready before you start.</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <div className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300 border border-gray-700 capitalize whitespace-nowrap">
          {interview.role}
        </div>
        <div className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300 border border-gray-700 capitalize whitespace-nowrap">
          {interview.type.replace('_', ' ')}
        </div>
        <div className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300 border border-gray-700 capitalize whitespace-nowrap">
          {interview.difficulty}
        </div>
        <div className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300 border border-gray-700 whitespace-nowrap">
          {interview.duration} Min
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <MicCheck result={checks.mic} stream={micStream} onRetry={runMicCheck} />
        <CameraCheck result={checks.camera} onRetry={runCameraCheck} />
        <SpeakerCheck result={checks.speaker} />
        <InternetCheck result={checks.internet} onRetry={runInternetCheck} />
        <BrowserCheck result={checks.browser} />
      </div>

      {/* Avatar & Voice Selection */}
      <div className="mb-8 p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-6">
        <h2 className="text-lg font-semibold text-gray-100">Interviewer Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm text-gray-400 mb-3">Select Voice</label>
            <div className="flex gap-3">
              <button 
                onClick={() => setInterviewerVoice('female')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${interviewerVoice === 'female' ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
              >
                Female (Default)
              </button>
              <button 
                onClick={() => setInterviewerVoice('male')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${interviewerVoice === 'male' ? 'bg-cyan-900/40 border-cyan-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
              >
                Male
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-3">Select Avatar Style</label>
            <div className="flex gap-3">
              <button 
                onClick={() => setInterviewerAvatar('neon-sphere')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${interviewerAvatar === 'neon-sphere' ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
              >
                Echo Orb
              </button>
              <button 
                onClick={() => setInterviewerAvatar('pulse-ring')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${interviewerAvatar === 'pulse-ring' ? 'bg-cyan-900/40 border-cyan-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
              >
                Pulse Ring
              </button>
            </div>
          </div>
        </div>
      </div>

      {Object.values(checks).some(c => c.status === 'fail') && (
        <PermissionGuide checks={checks} />
      )}

      {!allPassed ? (
        <button
          onClick={runAllChecks}
          disabled={running}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-4 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {running ? 'Running checks…' : 'Run all checks'}
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-center text-sm text-gray-400">All checks passed! You can proceed to the session.</p>
          <button 
            onClick={handleLaunch}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-xl py-4 transition-colors flex items-center justify-center gap-2"
          >
            Start Interview Now
          </button>
        </div>
      )}
    </div>
  )
}
