import { StepProps } from '../StepRenderer'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function Step2Role({ data, onUpdate, onNext, onBack }: StepProps) {
  const isValid = data.role.trim().length > 0

  return (
    <div className="flex flex-col w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">What's your primary role?</h2>
      <p className="text-gray-600 mb-8">This helps us ask relevant technical and behavioral questions.</p>
      
      <div className="mb-10">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          Job Title or Role
        </label>
        <input
          id="role"
          type="text"
          placeholder="e.g. Frontend Engineer, Product Manager"
          value={data.role}
          onChange={(e) => onUpdate('role', e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          autoFocus
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
          disabled={!isValid}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
