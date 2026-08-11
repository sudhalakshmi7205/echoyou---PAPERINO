'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepRenderer from './StepRenderer'

const STEPS = [
  'welcome', 'role', 'experience',
  'languages', 'companies', 'resume',
  'goal', 'complete'
]

// These steps can be skipped
const SKIPPABLE = ['companies', 'resume']

export default function OnboardingShell({ clerkId, existingProfile }: { clerkId: string, existingProfile: any }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState({
    role: existingProfile?.role ?? '',
    experience: existingProfile?.experience ?? '',
    languages: existingProfile?.languages ?? [],
    companies: existingProfile?.companies ?? [],
    resumeUrl: existingProfile?.resumeUrl ?? null,
    goal: existingProfile?.goal ?? '',
  })

  const stepName = STEPS[currentStep]
  const isSkippable = SKIPPABLE.includes(stepName)
  const progress = (currentStep / (STEPS.length - 1)) * 100

  function next() {
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  function back() {
    setCurrentStep(s => Math.max(s - 1, 0))
  }

  function update(field: string, value: any) {
    setData(prev => ({ ...prev, [field]: value }))
  }

  async function saveAndContinue(stepData?: Partial<typeof data>) {
    // Merge any final-step data, then persist
    const merged = { ...data, ...stepData }
    setData(merged)

    await fetch('/api/onboarding/save', {
      method: 'POST',
      body: JSON.stringify({ clerkId, data: merged }),
    })

    next()
  }

  async function complete() {
    await fetch('/api/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify({ clerkId, data }),
    })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200 w-full fixed top-0 left-0 z-50">
        <div
          className="h-1 bg-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step counter + skip */}
      <div className="flex justify-between items-center px-8 py-6 mt-2">
        <span className="text-sm font-medium text-gray-400">
          Step {currentStep + 1} of {STEPS.length}
        </span>
        {isSkippable && currentStep < STEPS.length - 1 && (
          <button onClick={() => saveAndContinue()} className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
            Skip for now &rarr;
          </button>
        )}
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-3xl mx-auto">
        <div className="w-full relative animate-in fade-in slide-in-from-bottom-4 duration-500">
          <StepRenderer
            step={stepName}
            data={data}
            onUpdate={update}
            onNext={saveAndContinue}
            onBack={back}
            onComplete={complete}
            isFirst={currentStep === 0}
            isLast={currentStep === STEPS.length - 1}
            clerkId={clerkId}
          />
        </div>
      </div>
    </div>
  )
}
