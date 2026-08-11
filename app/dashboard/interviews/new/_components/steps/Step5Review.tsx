import { InterviewConfig } from '../InterviewForm'
import { Sparkles } from 'lucide-react'

export default function Step5Review({ 
  config, 
  onBack,
  onSubmit,
  isSubmitting
}: { 
  config: InterviewConfig, 
  onBack: () => void,
  onSubmit: () => void,
  isSubmitting: boolean
}) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-2">
        Step 5 — Review
      </h2>
      <h1 className="text-2xl font-semibold mb-2">Ready to launch?</h1>
      <p className="text-gray-400 text-sm mb-8">Review your settings before Echo generates your custom questions.</p>

      <div className="bg-[#2A2A2A] rounded-xl border border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Role</div>
            <div className="font-medium text-white">{config.role} {config.company ? `@ ${config.company}` : ''}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Type</div>
            <div className="font-medium text-white capitalize">{config.type.replace('_', ' ')}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Difficulty</div>
            <div className="font-medium text-white capitalize">{config.difficulty}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Duration</div>
            <div className="font-medium text-white">{config.duration} Minutes</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Language</div>
            <div className="font-medium text-white capitalize">{config.language}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Media</div>
            <div className="font-medium text-white">{config.cameraEnabled ? 'Video Call' : 'Audio Only'}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          &larr; Back
        </button>
        <button 
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {isSubmitting ? 'Generating...' : 'Generate Interview'}
        </button>
      </div>
    </div>
  )
}
