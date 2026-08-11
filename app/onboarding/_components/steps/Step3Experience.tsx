import { StepProps } from '../StepRenderer'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const EXPERIENCE_LEVELS = [
  'Entry-level (0-2 years)',
  'Mid-level (3-5 years)',
  'Senior (6-10 years)',
  'Staff/Principal (10+ years)'
]

export default function Step3Experience({ data, onUpdate, onNext, onBack }: StepProps) {
  return (
    <div className="flex flex-col w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Level of Experience</h2>
      <p className="text-gray-600 mb-8">We will adjust the difficulty of the interview questions accordingly.</p>
      
      <div className="flex flex-col gap-3 mb-10">
        {EXPERIENCE_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onUpdate('experience', level)}
            className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
              data.experience === level 
                ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold' 
                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium py-2 px-4 rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => onNext()}
          disabled={!data.experience}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
