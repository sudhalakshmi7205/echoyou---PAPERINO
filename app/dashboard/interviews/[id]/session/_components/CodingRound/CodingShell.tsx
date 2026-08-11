'use client'
import { useState, useEffect } from 'react'
import ProblemPanel from './ProblemPanel'
import MonacoEditor from './MonacoEditor'
import EditorToolbar from './EditorToolbar'
import TestCaseRunner from './TestCaseRunner'
import ConsoleOutput from './ConsoleOutput'

export default function CodingShell({
  interviewId,
  problem,
  onCodeSubmit
}: {
  interviewId: string
  problem: any
  onCodeSubmit: (review: any) => void
}) {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [globalError, setGlobalError] = useState('')

  // Load starter code
  useEffect(() => {
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language])
    } else {
      setCode('')
    }
  }, [problem, language])

  async function handleRun() {
    setIsRunning(true)
    setGlobalError('')
    try {
      const res = await fetch(`/api/interviews/${interviewId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, problemId: problem.id })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data.results || [])
    } catch (err: any) {
      setGlobalError(err.message)
    } finally {
      setIsRunning(false)
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setGlobalError('')
    try {
      const res = await fetch(`/api/interviews/${interviewId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, problemId: problem.id })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      setResults(data.visibleResults || [])
      
      // Pass AI review back up to the main SessionShell
      if (data.review) {
        onCodeSubmit(data.review)
      }
    } catch (err: any) {
      setGlobalError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`flex bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-4 z-50' : 'h-[600px] w-full my-6'
    }`}>
      {/* Left Panel - Problem */}
      <div className="w-[40%] flex flex-col border-r border-gray-800 bg-[#121212]">
        <ProblemPanel problem={problem} />
      </div>

      {/* Right Panel - Editor & Tests */}
      <div className="w-[60%] flex flex-col relative">
        <EditorToolbar 
          language={language}
          setLanguage={setLanguage}
          isFullscreen={isFullscreen}
          toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        />
        
        <MonacoEditor 
          language={language}
          code={code}
          onChange={(v) => setCode(v || '')}
        />

        <ConsoleOutput error={globalError} />

        <TestCaseRunner 
          testCases={problem?.testCases || []}
          results={results}
          onRun={handleRun}
          isRunning={isRunning}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
