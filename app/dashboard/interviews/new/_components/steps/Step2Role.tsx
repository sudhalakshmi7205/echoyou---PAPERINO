import { InterviewConfig } from '../InterviewForm'

export default function Step2Role({ 
  config, 
  update, 
  onNext,
  onBack
}: { 
  config: InterviewConfig, 
  update: (v: Partial<InterviewConfig>) => void, 
  onNext: () => void,
  onBack: () => void
}) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-2">
        Step 2 — Target Role
      </h2>
      <h1 className="text-2xl font-semibold mb-2">What role are you applying for?</h1>
      <p className="text-gray-400 text-sm mb-8">Echo tailors questions to the specific seniority and company.</p>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Title <span className="text-red-400">*</span>
          </label>
          <input 
            type="text" 
            placeholder="e.g. Senior Frontend Engineer"
            value={config.role}
            onChange={(e) => update({ role: e.target.value })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <input 
            type="text" 
            placeholder="e.g. Google, Stripe, Local Startup"
            value={config.company}
            onChange={(e) => update({ company: e.target.value })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-2">If provided, we'll try to match their known interview style.</p>
        </div>
      </div>

      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
        >
          &larr; Back
        </button>
        <button 
          onClick={onNext}
          disabled={!config.role}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  )
}
