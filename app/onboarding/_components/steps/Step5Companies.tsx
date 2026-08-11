import { useState } from 'react'
import { StepProps } from '../StepRenderer'
import { ArrowRight, ArrowLeft, X, Plus } from 'lucide-react'

const TOP_COMPANIES = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 
  'Apple', 'Netflix', 'Stripe', 'Uber'
]

export default function Step5Companies({ data, onUpdate, onNext, onBack }: StepProps) {
  const [inputValue, setInputValue] = useState('')

  const suggestions = TOP_COMPANIES.filter(c => !data.companies.includes(c))

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim()) return
    const newCompany = inputValue.trim()
    if (!data.companies.includes(newCompany)) {
      onUpdate('companies', [...data.companies, newCompany])
    }
    setInputValue('')
  }

  const addSuggestion = (company: string) => {
    if (!data.companies.includes(company)) {
      onUpdate('companies', [...data.companies, company])
    }
  }

  const handleRemove = (companyToRemove: string) => {
    onUpdate('companies', data.companies.filter(c => c !== companyToRemove))
  }

  return (
    <div className="flex flex-col w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Target Companies</h2>
      <p className="text-gray-600 mb-8">What companies are you interviewing with? We will tailor behavioral questions based on their culture.</p>
      
      <div className="mb-6">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Google, Stripe, Local Startup"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          />
          <button
            type="submit"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="mb-6">
        <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Suggested</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 6).map(company => (
            <button
              key={company}
              onClick={() => addSuggestion(company)}
              className="text-sm bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              + {company}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Your Targets</div>
      <div className="flex flex-wrap gap-2 mb-10 min-h-[60px] p-4 bg-gray-50 border border-gray-200 rounded-xl">
        {data.companies.map(company => (
          <span key={company} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
            {company}
            <button onClick={() => handleRemove(company)} className="hover:text-blue-900 rounded-full p-0.5 hover:bg-blue-200 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {data.companies.length === 0 && (
          <span className="text-gray-400 text-sm italic py-1.5">You can skip this if you don't have a specific target yet.</span>
        )}
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
