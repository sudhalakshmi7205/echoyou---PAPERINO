import { StepProps } from '../StepRenderer'
import { ArrowRight } from 'lucide-react'

export default function Step1Welcome({ onNext }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
        Welcome to Echo.
      </h1>
      <p className="text-lg text-gray-600 max-w-lg mb-12">
        Let's get your profile set up so we can tailor your AI interviews to your exact background and goals. This will only take a minute.
      </p>
      
      <button
        onClick={() => onNext()}
        className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
      >
        Get Started <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}
