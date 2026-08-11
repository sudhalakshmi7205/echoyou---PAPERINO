'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import Step1Type from './steps/Step1Type'
import Step2Role from './steps/Step2Role'
import Step3Settings from './steps/Step3Settings'
import Step4Media from './steps/Step4Media'
import Step5Review from './steps/Step5Review'

export type InterviewConfig = {
  type: string
  role: string
  company: string
  difficulty: string
  duration: number
  language: string
  cameraEnabled: boolean
  mediaMode: 'video_audio' | 'audio_only' | 'video_only'
  // Technical
  programmingLanguage?: string
  experienceLevel?: string
  focusAreas?: string[]
  numQuestions?: number
  includeLiveCoding?: boolean
  // HR
  interviewStyle?: string
  focusTopics?: string[]
  // Behavioural
  starMethodMode?: boolean
  competencies?: string[]
  // System Design
  systemScale?: string
  topics?: string[]
  whiteboardMode?: boolean
  // Resume follow-up
  areasToFocus?: string[]
  askProjectDeepDive?: boolean
  resumeFileName?: string
  isResumeUploaded?: boolean
  // Coding
  dsaTopic?: string
  enableCompiler?: boolean
  showHints?: boolean
}

export default function InterviewForm({ clerkId, defaultRole, defaultType }: { clerkId: string, defaultRole?: string | null, defaultType?: string }) {
  const router = useRouter()
  
  // Normalize type (e.g. 'hr' -> 'behavioural' / 'hr')
  const normalizedType = defaultType === 'hr' ? 'behavioural' : defaultType
  const hasPreselectedType = Boolean(normalizedType && normalizedType.trim().length > 0)
  
  // If type is preselected from clicking sphere, skip Step 1 and go straight to Step 2
  const [step, setStep] = useState(hasPreselectedType ? 2 : 1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [config, setConfig] = useState<InterviewConfig>({
    type: normalizedType || '',
    role: defaultRole || '',
    company: '',
    difficulty: 'medium',
    duration: 30,
    language: 'english',
    cameraEnabled: true,
    mediaMode: 'video_audio'
  })

  function updateConfig(updates: Partial<InterviewConfig>) {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    console.log('[InterviewForm] Submitting config with mediaMode:', config.mediaMode, 'cameraEnabled:', config.cameraEnabled)
    try {
      const res = await fetch('/api/interviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId, ...config })
      })

      if (!res.ok) throw new Error('Failed to create interview')
      
      const { interview } = await res.json()
      router.push(`/dashboard/interviews/${interview.id}/lobby`)
    } catch (e) {
      alert('Error creating interview')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#1C1C1C] text-gray-100 rounded-xl border border-gray-800 p-8 shadow-2xl relative">
      {/* Progress line */}
      <div className="w-full h-1 bg-gray-800 rounded-full mb-8 relative overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-purple-500 transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-400">Step {step} of 5</span>
        <button className="px-4 py-1.5 rounded-md text-sm border border-gray-700 hover:bg-gray-800 transition-colors">
          Save draft
        </button>
      </div>

      {step === 1 && <Step1Type config={config} update={updateConfig} onNext={() => setStep(2)} />}
      {step === 2 && <Step2Role config={config} update={updateConfig} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <Step3Settings config={config} update={updateConfig} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <Step4Media config={config} update={updateConfig} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
      {step === 5 && <Step5Review config={config} onBack={() => setStep(4)} onSubmit={handleSubmit} isSubmitting={isSubmitting} />}

      {isSubmitting && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium">Generating Your Interview...</h3>
          <p className="text-sm text-gray-300">Echo is crafting custom questions based on your config.</p>
        </div>
      )}
    </div>
  )
}
