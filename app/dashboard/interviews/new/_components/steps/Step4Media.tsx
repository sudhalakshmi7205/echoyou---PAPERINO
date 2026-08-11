import { useState, useEffect, useRef } from 'react'
import { InterviewConfig } from '../InterviewForm'
import { Video, VideoOff, Mic, MicOff, Camera, RefreshCw } from 'lucide-react'

export default function Step4Media({ 
  config, 
  update, 
  onNext,
  onBack
}: { 
  config: InterviewConfig, 
  update: (v: Partial<InterviewConfig>) => void, 
  onNext: () => void,
  onBack: () => void
}) {
  const [devices, setDevices] = useState<{ video: MediaDeviceInfo[], audio: MediaDeviceInfo[] }>({ video: [], audio: [] })
  const [selectedVideo, setSelectedVideo] = useState('')
  const [selectedAudio, setSelectedAudio] = useState('')
  const [previewError, setPreviewError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const currentMode = config.mediaMode || (config.cameraEnabled ? 'video_audio' : 'audio_only')

  useEffect(() => {
    console.log('[Step4Media] Current selected mode:', currentMode)

    // Enumerate devices
    navigator.mediaDevices?.enumerateDevices?.().then(devs => {
      setDevices({
        video: devs.filter(d => d.kind === 'videoinput'),
        audio: devs.filter(d => d.kind === 'audioinput')
      })
    }).catch(console.error)
  }, [currentMode])

  // Camera preview effect
  useEffect(() => {
    if (currentMode === 'audio_only') {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
      return
    }

    let isMounted = true
    setPreviewError(null)

    const constraints: MediaStreamConstraints = {
      video: selectedVideo ? { deviceId: { exact: selectedVideo } } : true,
      audio: currentMode === 'video_audio'
    }

    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      if (!isMounted) {
        stream.getTracks().forEach(t => t.stop())
        return
      }
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(console.error)
      }
    }).catch((err: any) => {
      console.error('[Step4Media] Media preview error:', err)
      setPreviewError(err.name === 'NotAllowedError' ? 'Camera/Mic permission denied.' : 'Failed to access camera device.')
    })

    return () => {
      isMounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [currentMode, selectedVideo, selectedAudio])

  const selectMode = (mode: 'video_audio' | 'audio_only' | 'video_only') => {
    console.log('[Step4Media] User selected mode:', mode)
    update({
      mediaMode: mode,
      cameraEnabled: mode !== 'audio_only'
    })
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
      <div>
        <h2 className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-1">
          Step 4 — Media Settings
        </h2>
        <h1 className="text-2xl font-bold text-white mb-1">Select Interview Media Mode</h1>
        <p className="text-gray-400 text-sm">Choose how you want to interact with Echo AI during your session.</p>
      </div>

      {/* Mandatory Video + Audio Security Banner */}
      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-3">
        <span className="text-base">🛡️</span>
        <div>
          <span className="font-bold text-white uppercase tracking-wider block text-[11px]">Proctoring Security Rules Active</span>
          <span>All candidates must attend in <strong>Video + Audio Mode</strong> with active camera. Multi-person detection & anti-cheat monitoring will run during the interview.</span>
        </div>
      </div>

      {/* Mode Selection Cards (Video + Audio Mandatory) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video + Audio (Mandatory) */}
        <button
          onClick={() => selectMode('video_audio')}
          className="p-5 rounded-2xl border flex flex-col items-center text-center transition-all border-purple-500 bg-purple-500/15 shadow-[0_0_25px_rgba(168,85,247,0.3)] text-white"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3">
            <Video className="w-6 h-6" />
          </div>
          <span className="font-bold text-base text-white mb-1">Video + Audio (Mandatory)</span>
          <span className="text-xs text-gray-300">Live Webcam Feed, Speech Recognition & Face Proctoring</span>
        </button>

        {/* Video Only */}
        <button
          onClick={() => selectMode('video_only')}
          className={`p-5 rounded-2xl border flex flex-col items-center text-center transition-all ${
            currentMode === 'video_only'
              ? 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_25px_rgba(16,185,129,0.3)] text-white'
              : 'border-gray-800 bg-[#1A1A1A] hover:border-gray-700 text-gray-400'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
            <Camera className="w-6 h-6" />
          </div>
          <span className="font-bold text-base text-white mb-1">Video + Text Response</span>
          <span className="text-xs text-gray-400">Camera Feed (Text Chat Responses)</span>
        </button>
      </div>

      {/* Live Device Preview Container */}
      {currentMode !== 'audio_only' && (
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Webcam Live Preview</h3>
          
          <div className="relative w-full h-48 bg-black rounded-xl overflow-hidden border border-gray-800 flex items-center justify-center">
            {previewError ? (
              <div className="text-center p-4 text-red-400 text-xs font-semibold">
                ⚠️ {previewError}
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Device Selection Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.video.length > 0 && (
              <div>
                <label className="text-[11px] text-gray-400 block mb-1 font-medium">Select Camera Device</label>
                <select
                  value={selectedVideo}
                  onChange={e => setSelectedVideo(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {devices.video.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera (${d.deviceId.slice(0, 5)})`}</option>
                  ))}
                </select>
              </div>
            )}

            {devices.audio.length > 0 && currentMode === 'video_audio' && (
              <div>
                <label className="text-[11px] text-gray-400 block mb-1 font-medium">Select Microphone Device</label>
                <select
                  value={selectedAudio}
                  onChange={e => setSelectedAudio(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {devices.audio.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>{d.label || `Microphone (${d.deviceId.slice(0, 5)})`}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button 
          onClick={onBack}
          className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          &larr; Back
        </button>
        <button 
          onClick={onNext}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-purple-600/20"
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  )
}

