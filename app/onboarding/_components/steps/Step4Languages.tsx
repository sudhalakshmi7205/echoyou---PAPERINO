import { useState } from 'react'
import { StepProps } from '../StepRenderer'
import { ArrowRight, ArrowLeft, X, Plus } from 'lucide-react'

const STACK_SUGGESTIONS: Record<string, string[]> = {
  java: ['Java', 'Spring Boot', 'Hibernate', 'JUnit', 'Maven', 'Kafka', 'SQL', 'Docker'],
  frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Jest', 'HTML/CSS'],
  backend: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'GraphQL', 'Go'],
  python: ['Python', 'Django', 'FastAPI', 'Pandas', 'PyTest', 'PostgreSQL', 'Redis'],
  data: ['Python', 'SQL', 'Pandas', 'PySpark', 'Airflow', 'Tableau', 'Snowflake'],
  default: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'SQL', 'React', 'Node.js', 'Docker']
}

function getSuggestions(role: string): string[] {
  const normalizedRole = (role || '').toLowerCase()
  if (normalizedRole.includes('java') && !normalizedRole.includes('javascript')) return STACK_SUGGESTIONS.java
  if (normalizedRole.includes('frontend') || normalizedRole.includes('ui') || normalizedRole.includes('react')) return STACK_SUGGESTIONS.frontend
  if (normalizedRole.includes('backend') || normalizedRole.includes('server')) return STACK_SUGGESTIONS.backend
  if (normalizedRole.includes('python')) return STACK_SUGGESTIONS.python
  if (normalizedRole.includes('data')) return STACK_SUGGESTIONS.data
  return STACK_SUGGESTIONS.default
}

export default function Step4Languages({ data, onUpdate, onNext, onBack }: StepProps) {
  const [inputValue, setInputValue] = useState('')

  const suggestions = getSuggestions(data.role).filter(s => !data.languages.includes(s))

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim()) return
    const newLang = inputValue.trim()
    if (!data.languages.includes(newLang)) {
      onUpdate('languages', [...data.languages, newLang])
    }
    setInputValue('')
  }

  const addSuggestion = (lang: string) => {
    if (!data.languages.includes(lang)) {
      onUpdate('languages', [...data.languages, lang])
    }
  }

  const handleRemove = (langToRemove: string) => {
    onUpdate('languages', data.languages.filter(l => l !== langToRemove))
  }

  return (
    <div className="flex flex-col w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Tech Stack</h2>
      <p className="text-gray-600 mb-8">What languages and frameworks do you use?</p>
      
      <div className="mb-6">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. React, Python, SQL"
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
        <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Suggested for you</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 8).map(lang => (
            <button
              key={lang}
              onClick={() => addSuggestion(lang)}
              className="text-sm bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            >
              + {lang}
            </button>
          ))}
          {suggestions.length === 0 && <span className="text-sm text-gray-400 italic">No more suggestions</span>}
        </div>
      </div>

      <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Your Stack</div>
      <div className="flex flex-wrap gap-2 mb-10 min-h-[60px] p-4 bg-gray-50 border border-gray-200 rounded-xl">
        {data.languages.map(lang => (
          <span key={lang} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium">
            {lang}
            <button onClick={() => handleRemove(lang)} className="hover:text-purple-900 rounded-full p-0.5 hover:bg-purple-200 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {data.languages.length === 0 && (
          <span className="text-gray-400 text-sm italic py-1.5">No technologies added yet.</span>
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
          disabled={data.languages.length === 0}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
