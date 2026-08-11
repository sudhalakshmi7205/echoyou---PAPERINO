'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Loader2, Target } from 'lucide-react'

export default function ExistingResumeAnalyzer() {
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  async function handleAnalyze() {
    if (!jobDescription.trim()) {
      alert('Please enter a job description to analyze.')
      return
    }

    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/resume/analyze-existing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription })
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to analyze')
      }

      setJobDescription('')
      router.refresh()
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="bg-[#111620] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
          <Target className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Check New Job Description</h3>
          <p className="text-xs text-gray-400">Paste a JD to score your active resume</p>
        </div>
      </div>

      <textarea
        value={jobDescription}
        onChange={e => setJobDescription(e.target.value)}
        placeholder="Paste the job requirements, responsibilities, and qualifications here..."
        className="flex-1 w-full min-h-[120px] bg-[#0A0D14] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 resize-none transition-all mb-4"
        disabled={isAnalyzing}
      />

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !jobDescription.trim()}
        className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Calculate ATS Score'
        )}
      </button>
    </div>
  )
}
