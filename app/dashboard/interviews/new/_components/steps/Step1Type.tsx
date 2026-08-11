import { InterviewConfig } from '../InterviewForm'
import { Monitor, BrainCircuit, Network, Keyboard, Shuffle, FileSearch } from 'lucide-react'

const TYPES = [
  { id: 'technical', title: 'Technical', desc: 'Algorithms, data structures, problem solving', icon: Monitor },
  { id: 'behavioural', title: 'Behavioural', desc: 'STAR method, leadership, culture fit', icon: BrainCircuit },
  { id: 'system_design', title: 'System Design', desc: 'Architecture, scalability, trade-offs', icon: Network },
  { id: 'coding', title: 'Coding Round', desc: 'Live coding with Monaco editor', icon: Keyboard },
  { id: 'resume_followup', title: 'Resume Follow-up', desc: 'Deep dive into your resume & projects', icon: FileSearch },
  { id: 'mixed', title: 'Mixed', desc: 'Combination of all types', icon: Shuffle },
]

export default function Step1Type({ 
  config, 
  update, 
  onNext 
}: { 
  config: InterviewConfig, 
  update: (v: Partial<InterviewConfig>) => void, 
  onNext: () => void 
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-2">
        Step 1 — Interview Type
      </h2>
      <h1 className="text-2xl font-semibold mb-2">What kind of interview?</h1>
      <p className="text-gray-400 text-sm mb-8">This determines the question mix and AI behaviour.</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {TYPES.map(t => {
          const Icon = t.icon
          const isSelected = config.type === t.id
          return (
            <button
              key={t.id}
              onClick={() => update({ type: t.id })}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                isSelected 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-gray-800 hover:border-gray-600 hover:bg-gray-800/50'
              }`}
            >
              <Icon className={`w-6 h-6 mb-3 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
              <div className={`font-medium ${isSelected ? 'text-purple-100' : 'text-gray-200'}`}>
                {t.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onNext}
          disabled={!config.type}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  )
}
