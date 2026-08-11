import { StepProps } from '../StepRenderer'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function Step7Goal({ data, onUpdate, onNext, onBack }: StepProps) {
  return (
    <div className="flex flex-col w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">What's your goal?</h2>
      <p className="text-gray-600 mb-8">What are you hoping to achieve with Echo?</p>
      
      <div className="mb-10">
        <textarea
          placeholder="e.g. I want to practice system design questions for a Staff Engineer role at a FAANG company."
          value={data.goal}
          onChange={(e) => onUpdate('goal', e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all min-h-[150px] resize-none"
        />
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
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
