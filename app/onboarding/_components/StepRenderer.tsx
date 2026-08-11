import Step1Welcome from './steps/Step1Welcome'
import Step2Role from './steps/Step2Role'
import Step3Experience from './steps/Step3Experience'
import Step4Languages from './steps/Step4Languages'
import Step5Companies from './steps/Step5Companies'
import Step6Resume from './steps/Step6Resume'
import Step7Goal from './steps/Step7Goal'
import Step8Complete from './steps/Step8Complete'

export interface OnboardingData {
  role: string
  experience: string
  languages: string[]
  companies: string[]
  resumeUrl: string | null
  goal: string
}

export interface StepProps {
  data: OnboardingData
  onUpdate: (field: string, value: any) => void
  onNext: (stepData?: Partial<OnboardingData>) => Promise<void>
  onBack: () => void
  onComplete?: () => Promise<void>
  isFirst: boolean
  isLast: boolean
  clerkId?: string
}

interface StepRendererProps extends StepProps {
  step: string
}

export default function StepRenderer({ step, ...props }: StepRendererProps) {
  switch (step) {
    case 'welcome':
      return <Step1Welcome {...props} />
    case 'role':
      return <Step2Role {...props} />
    case 'experience':
      return <Step3Experience {...props} />
    case 'languages':
      return <Step4Languages {...props} />
    case 'companies':
      return <Step5Companies {...props} />
    case 'resume':
      return <Step6Resume {...props} />
    case 'goal':
      return <Step7Goal {...props} />
    case 'complete':
      return <Step8Complete {...props} />
    default:
      return null
  }
}
