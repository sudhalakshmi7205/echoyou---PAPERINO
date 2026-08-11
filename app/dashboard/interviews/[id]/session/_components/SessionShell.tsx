'use client'
import { useState, useEffect, useRef } from 'react'
import ConversationView from './ConversationView'
import MicButton from './MicButton'
import ControlBar from './ControlBar'
import { useRouter } from 'next/navigation'
import CodingShell from './CodingRound/CodingShell'
import { Code2, AlertTriangle, Clock, ShieldAlert, XCircle } from 'lucide-react'
import { analyzeVideoFaceCount, checkAbusiveOrIrrelevantContent } from '@/lib/proctoring/antiCheatGuard'

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
  streaming?: boolean
}

function AvatarDisplay({ type, isSpeaking }: { type: string, isSpeaking: boolean }) {
  if (type === 'pulse-ring') {
    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full border-2 border-cyan-500/50 ${isSpeaking ? 'animate-ping' : ''}`} />
        <div className="w-24 h-24 rounded-full bg-cyan-900/40 border border-cyan-400 flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          <div className={`w-8 h-8 bg-cyan-400 rounded-full ${isSpeaking ? 'animate-pulse' : ''}`} />
        </div>
      </div>
    )
  }
  // Default: neon-sphere
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <div className={`absolute inset-2 rounded-full border border-purple-500/30 ${isSpeaking ? 'animate-ping' : ''}`} />
      <div className="w-28 h-28 rounded-full border-2 border-purple-500/80 bg-[#0B0E14] flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.6)]">
        <div className={`absolute inset-0 bg-gradient-to-tr from-purple-600/40 to-cyan-400/40 ${isSpeaking ? 'animate-[spin_1s_linear_infinite]' : 'animate-[spin_4s_linear_infinite]'}`} />
        <div className="w-12 h-12 rounded-full border border-cyan-300/80 relative z-10 bg-[#0B0E14]/50 backdrop-blur-sm" />
      </div>
    </div>
  )
}

export default function SessionShell({ interview }: { interview: any }) {
  const mediaMode = interview.mediaMode || 'video_audio'
  // Video + Audio is MANDATORY for all candidates
  const isVideoEnabled = true
  const isAudioEnabled = true

  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [transcript, setTranscript] = useState('')
  const transcriptRef = useRef('')
  const hasStartedRef = useRef(false)
  const recognitionRef = useRef<any>(null)
  const router = useRouter()

  // Video MediaStream Ref
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const userStreamRef = useRef<MediaStream | null>(null)
  const [cameraStatus, setCameraStatus] = useState<'connected' | 'disabled' | 'error'>('connected')

  const [showCoding, setShowCoding] = useState(false)
  const [activeProblem, setActiveProblem] = useState<any>(null)
  
  // Timeout & Strike State
  const [timeLeft, setTimeLeft] = useState(60)
  const [strikes, setStrikes] = useState(0)

  // 🛡️ Proctoring & Anti-Cheat State
  const [multiFaceWarnings, setMultiFaceWarnings] = useState(0)
  const [abuseWarnings, setAbuseWarnings] = useState(0)
  const [activeWarning, setActiveWarning] = useState<string | null>(null)
  const [isTerminated, setIsTerminated] = useState(false)
  const [terminationReason, setTerminationReason] = useState<string | null>(null)

  // Initialize Media Streams (Camera & Mic) based on exact selected mode
  useEffect(() => {
    console.log('[SessionShell] Initializing media streams for mode:', mediaMode, 'cameraEnabled:', interview.cameraEnabled)

    if (!isVideoEnabled) {
      setCameraStatus('disabled')
      return
    }

    let isMounted = true
    const constraints: MediaStreamConstraints = {
      video: true,
      audio: false // SpeechRecognition handles audio separately
    }

    navigator.mediaDevices?.getUserMedia(constraints).then(stream => {
      if (!isMounted) {
        stream.getTracks().forEach(t => t.stop())
        return
      }
      userStreamRef.current = stream
      setCameraStatus('connected')
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream
        userVideoRef.current.play().catch(console.error)
      }
    }).catch(err => {
      console.error('[SessionShell] Camera initialization error:', err)
      setCameraStatus('error')
    })

    return () => {
      isMounted = false
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [mediaMode, isVideoEnabled, interview.cameraEnabled])

  useEffect(() => {
    if (['coding', 'mixed', 'technical'].includes(interview.type)) {
      fetch('/api/interviews/problem').then(res => res.json()).then(data => {
        if (data.problem) setActiveProblem(data.problem)
      }).catch(console.error)
    }
  }, [interview.type])

  function handleCodeSubmit(review: any) {
    setShowCoding(false)
    const passed = review.testsPassed === review.testsTotal && review.testsTotal > 0;
    sendMessage(`[SYSTEM] The candidate has submitted their code. Tests passed: ${review.testsPassed}/${review.testsTotal}. Feedback: ${review.feedback}.
If all tests passed, congratulate the candidate and output exactly [END_INTERVIEW] to finish the interview immediately. Do not ask more questions.
If tests failed, explain what failed, give a hint, and output exactly [OPEN_EDITOR] so they can try again.`)
  }

  // Kick off the interview with an opening message
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      sendMessage('[START_INTERVIEW]')
    }
    return () => {
      window.speechSynthesis.cancel()
      if (recognitionRef.current) recognitionRef.current.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer logic
  useEffect(() => {
    if (isThinking || isStreaming || transcript) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeout()
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isThinking, isStreaming, transcript])

  useEffect(() => {
    if (!isThinking && !isStreaming) {
      if (showCoding && activeProblem) {
        // DSA Timer
        const mins = activeProblem.difficulty === 'easy' ? 15 : activeProblem.difficulty === 'medium' ? 30 : 45;
        setTimeLeft(mins * 60);
      } else {
        // Standard question timer
        setTimeLeft(60);
      }
    }
  }, [isThinking, isStreaming, showCoding, activeProblem])

  function handleTimeout() {
    const newStrikes = strikes + 1
    setStrikes(newStrikes)
    if (newStrikes >= 3) {
      sendMessage('[END_INTERVIEW] The candidate was unresponsive for 3 questions in a row. Conclude the interview immediately.')
    } else {
      sendMessage('[TIMEOUT] The candidate did not answer in time. Move to the next question.')
    }
  }

  // 🛡️ Live Camera Face Proctoring Interval (Scans every 2s)
  useEffect(() => {
    if (isTerminated) return

    const faceInterval = setInterval(() => {
      if (userVideoRef.current && userVideoRef.current.readyState === 4) {
        const count = analyzeVideoFaceCount(userVideoRef.current)
        if (count > 1) {
          setMultiFaceWarnings(prev => {
            const next = prev + 1
            if (next >= 2) {
              setIsTerminated(true)
              setTerminationReason('SECURITY POLICY VIOLATION: Multiple persons detected in candidate camera feed.')
              window.speechSynthesis?.cancel()
              if (recognitionRef.current) recognitionRef.current.stop()
            } else {
              setActiveWarning('⚠️ SECURITY WARNING 1/2: Multiple people detected in camera feed! Only the candidate is allowed. Please ensure you are alone.')
              setTimeout(() => setActiveWarning(null), 6000)
            }
            return next
          })
        }
      }
    }, 2500)

    return () => clearInterval(faceInterval)
  }, [isTerminated])

  async function sendMessage(userText: string) {
    if (!userText.trim() || isTerminated) return

    // 🛡️ Abusive & Irrelevant Language Detection Check
    if (userText !== '[START_INTERVIEW]' && !userText.startsWith('[')) {
      const abuseCheck = checkAbusiveOrIrrelevantContent(userText)
      if (abuseCheck.isAbusive || abuseCheck.isIrrelevant) {
        const nextWarnings = abuseWarnings + 1
        setAbuseWarnings(nextWarnings)
        if (nextWarnings >= 2) {
          setIsTerminated(true)
          setTerminationReason(`POLICY VIOLATION: ${abuseCheck.reason} (Repeated offense).`)
          window.speechSynthesis?.cancel()
          if (recognitionRef.current) recognitionRef.current.stop()
          return
        } else {
          setActiveWarning(`⚠️ SECURITY WARNING 1/2: ${abuseCheck.reason}. Please answer professionally in English. Repeating this will terminate the interview.`)
          setTimeout(() => setActiveWarning(null), 7000)
          return
        }
      }
    }

    window.speechSynthesis.cancel()

    if (userText !== '[START_INTERVIEW]' && !userText.startsWith('[')) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'user',
        content: userText
      }])
    }

    setIsThinking(true)

    const aiId = crypto.randomUUID()
    setMessages(prev => [...prev, { id: aiId, role: 'assistant', content: '', streaming: true }])

    try {
      const res = await fetch(`/api/interviews/${interview.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText,
          activeProblemContext: activeProblem ? activeProblem.description : undefined
        }),
      })

      if (!res.ok) throw new Error('API Error')

      setIsThinking(false)
      setIsStreaming(true)

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const rawData = line.slice(6)
          if (!rawData) continue

          const data = JSON.parse(rawData)

          if (data.chunk) {
            fullText += data.chunk
            setMessages(prev => prev.map(m =>
              m.id === aiId ? { ...m, content: fullText } : m
            ))
          }

          if (data.done) {
            const displayContent = fullText.replace(/\[OPEN_EDITOR\]/g, '').trim()
            setMessages(prev => prev.map(m =>
              m.id === aiId ? { ...m, content: displayContent, streaming: false } : m
            ))
            setIsStreaming(false)
            speakText(fullText)

            if (fullText.includes('[OPEN_EDITOR]')) {
              setTimeout(() => setShowCoding(true), 1500)
            }

            if (userText.includes('[END_INTERVIEW]') || fullText.includes('[END_INTERVIEW]')) {
              setTimeout(async () => {
                await fetch(`/api/interviews/${interview.id}/end`, { method: 'POST' })
                router.push(`/dashboard/interviews/${interview.id}/report`)
              }, 4000)
            }
          }

          if (data.error) {
            setMessages(prev => prev.map(m =>
              m.id === aiId ? { ...m, content: 'Sorry, I encountered an error. Please try again.', streaming: false } : m
            ))
            setIsStreaming(false)
          }
        }
      }
    } catch (err) {
      console.error(err)
      setIsThinking(false)
      setIsStreaming(false)
    }
  }

  function speakText(text: string) {
    if (!('speechSynthesis' in window)) return
    
    const cleanText = text.replace(/[*_#]/g, '').replace(/```[\s\S]*?```/g, 'Here is some code.').replace(/\[OPEN_EDITOR\]/g, '')
    
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.95
    utterance.pitch = 1
    
    const voices = window.speechSynthesis.getVoices()
    const voicePref = interview.interviewerVoice === 'male' ? 'Male' : 'Female'
    
    let preferredVoice = voices.find(v => 
      (v.name.includes('Google') || v.name.includes('Online')) && v.name.includes(voicePref)
    )
    if (!preferredVoice) {
      preferredVoice = voices.find(v => v.name.includes(voicePref === 'Male' ? 'Daniel' : 'Samantha'))
    }
    
    if (preferredVoice) utterance.voice = preferredVoice

    window.speechSynthesis.speak(utterance)
  }

  function startListening() {
    window.speechSynthesis.cancel()
    transcriptRef.current = ''
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = interview.language === 'hindi' ? 'hi-IN' : 'en-US'

    recognition.onresult = (event: any) => {
      const interim = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('')
      setTranscript(interim)
      transcriptRef.current = interim
    }

    recognition.onend = () => {
      if (transcriptRef.current.trim()) {
        sendMessage(transcriptRef.current)
        if (strikes > 0) setStrikes(0) // Reset strikes on successful answer
      }
      setTranscript('')
      transcriptRef.current = ''
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  function stopListening() {
    if (recognitionRef.current) recognitionRef.current.stop()
  }

  const lastAiMessage = [...messages].reverse().find(m => m.role === 'assistant')

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto relative overflow-hidden bg-[#121212]">
      
      {/* 🚨 PROCTORING WARNING TOAST BANNER */}
      {activeWarning && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-rose-950/95 border-2 border-rose-500 p-4 rounded-2xl backdrop-blur-2xl shadow-[0_0_50px_rgba(244,63,94,0.6)] flex items-center gap-3 text-xs font-sans max-w-lg text-white font-bold animate-in slide-in-from-top duration-300">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 animate-bounce" />
          <div>
            <span className="text-rose-300 font-extrabold uppercase tracking-wider block text-[11px]">Proctoring Alert</span>
            <span>{activeWarning}</span>
          </div>
        </div>
      )}

      {/* 🚨 FULL SCREEN SECURITY LOCKOUT OVERLAY (TERMINATE INTERVIEW) */}
      {isTerminated && (
        <div className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#0D111A] border-2 border-rose-500 p-8 rounded-3xl space-y-6 shadow-[0_0_80px_rgba(244,63,94,0.5)] animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_30px_rgba(244,63,94,0.4)]">
              <XCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Interview Terminated</h2>
              <p className="text-xs text-rose-400 font-bold font-mono">
                {terminationReason || 'SECURITY POLICY VIOLATION'}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                This interview session was automatically locked out due to repeated security policy violations (multiple faces detected or non-compliant speech behavior).
              </p>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-xs shadow-lg uppercase tracking-wider"
            >
              Return to User Dashboard
            </button>
          </div>
        </div>
      )}

      {showCoding && activeProblem ? (
        <div className="absolute inset-0 z-50 bg-[#121212] overflow-y-auto">
          <div className="p-4 flex items-center justify-between bg-[#1e1e1e] border-b border-gray-800">
            <h2 className="text-white font-semibold flex items-center gap-2"><Code2 className="w-5 h-5"/> Coding Round</h2>
            <button onClick={() => setShowCoding(false)} className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-700">Back to Interview</button>
          </div>
          <CodingShell interviewId={interview.id} problem={activeProblem} onCodeSubmit={handleCodeSubmit} />
        </div>
      ) : null}

      <div className="flex-1 flex flex-col relative max-w-4xl mx-auto w-full">
        {activeProblem && !showCoding && (
          <button 
            onClick={() => setShowCoding(true)}
            className="absolute top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-medium hover:bg-blue-600/30 transition-colors shadow-lg"
          >
            <Code2 className="w-4 h-4" />
            Open Code Editor
          </button>
        )}

        {/* Top Status Bar with Timer, Strikes & Media Mode Status */}
        <div className="absolute top-4 left-4 z-40 flex items-center gap-3 flex-wrap">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border shadow-lg transition-colors ${timeLeft < 10 ? 'bg-red-900/40 border-red-500 text-red-400 animate-pulse' : 'bg-gray-900 border-gray-700 text-gray-300'}`}>
            <Clock className="w-4 h-4" />
            {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>

          <div className="px-3 py-1.5 rounded-full bg-gray-900/90 border border-gray-700 text-xs font-semibold text-purple-300 flex items-center gap-1.5 shadow-lg">
            <span>{mediaMode === 'video_audio' ? '📹+🎙️ Video & Audio' : mediaMode === 'video_only' ? '📹 Video Only' : '🎙️ Audio Only'}</span>
          </div>

          {strikes > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-orange-900/40 border border-orange-500 text-orange-400 shadow-lg">
              <AlertTriangle className="w-4 h-4" />
              Strike {strikes}/3
            </div>
          )}
        </div>

        {/* Floating Candidate Webcam Live Feed Panel */}
        {isVideoEnabled && (
          <div className="absolute top-16 right-4 z-40 w-48 h-36 bg-black/90 border-2 border-purple-500/60 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.3)] backdrop-blur-md transition-all">
            {cameraStatus === 'connected' ? (
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-xs text-red-400 font-semibold bg-gray-900">
                <span>⚠️ Camera Failed</span>
                <span className="text-[10px] text-gray-500 mt-1">Check permissions</span>
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] text-emerald-400 font-bold tracking-wider uppercase border border-emerald-500/30">
              Live Candidate
            </div>
          </div>
        )}

        {/* Cinematic Avatar Display */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <AvatarDisplay type={interview.interviewerAvatar || 'neon-sphere'} isSpeaking={isStreaming} />
          
          {/* Subtitles */}
          <div className="mt-12 h-32 w-full max-w-2xl text-center flex flex-col justify-end">
            {isThinking ? (
              <div className="text-gray-500 italic animate-pulse">HR is thinking...</div>
            ) : lastAiMessage ? (
              <div className="text-xl md:text-2xl font-medium text-white drop-shadow-md">
                {lastAiMessage.content}
              </div>
            ) : null}
          </div>
        </div>

        {transcript && (
          <div className="absolute bottom-36 left-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 shadow-2xl">
            <div className="text-sm font-medium text-purple-400 mb-1">You are saying...</div>
            <div className="text-gray-200">{transcript}</div>
          </div>
        )}

        <MicButton
          onStart={startListening}
          onStop={stopListening}
          disabled={isThinking || isStreaming}
        />

        <div className="mt-auto z-10 relative">
          <ControlBar
            onSkip={() => sendMessage('[SKIP_QUESTION] Please move to the next question.')}
            onRepeat={() => lastAiMessage && speakText(lastAiMessage.content)}
            onEnd={() => sendMessage('[END_INTERVIEW] Please wrap up the interview professionally.')}
            disabled={isThinking || isStreaming}
          />
        </div>
      </div>
    </div>
  )
}
