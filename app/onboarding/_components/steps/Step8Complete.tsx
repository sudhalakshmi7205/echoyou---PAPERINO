import { StepProps } from '../StepRenderer'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'

export default function Step8Complete({ data, onBack, onComplete }: StepProps) {
  return (
    <div className="flex flex-col w-full max-w-md">
      <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-6 self-center">
        <Sparkles className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">You're all set!</h2>
      <p className="text-gray-600 mb-8 text-center">Here's a summary of your profile. Echo will use this to generate your personalized interviews.</p>
      
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 space-y-4 shadow-sm">
        <div className="flex flex-col border-b border-gray-100 pb-3">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Role & Experience</span>
          <span className="text-gray-900 font-medium">{data.role || 'Not specified'} • {data.experience || 'Not specified'}</span>
        </div>

        <div className="flex flex-col border-b border-gray-100 pb-3">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Tech Stack</span>
          <div className="flex flex-wrap gap-1">
            {data.languages.length > 0 ? data.languages.map(l => (
              <span key={l} className="bg-purple-50 text-purple-700 px-2 py-1 text-xs rounded-md font-medium">{l}</span>
            )) : <span className="text-gray-500 italic text-sm">None</span>}
          </div>
        </div>

        <div className="flex flex-col border-b border-gray-100 pb-3">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Target Companies</span>
          <div className="flex flex-wrap gap-1">
            {data.companies.length > 0 ? data.companies.map(c => (
              <span key={c} className="bg-blue-50 text-blue-700 px-2 py-1 text-xs rounded-md font-medium">{c}</span>
            )) : <span className="text-gray-500 italic text-sm">None</span>}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Resume</span>
          <span className="text-gray-900 font-medium text-sm">
            {data.resumeUrl ? '✓ Uploaded and attached' : 'Not uploaded (can upload later in settings)'}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium py-2 px-4 rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => onComplete && onComplete()}
          className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Finish Onboarding <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
