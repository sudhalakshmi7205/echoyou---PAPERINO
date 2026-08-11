'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, FileText, CheckCircle, Loader2, Target, Briefcase } from 'lucide-react'

export default function ResumeUploader({ clerkId, compact = false }: { clerkId: string, compact?: boolean }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<'upload'|'parse'|'ai'|'save'|null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleFile(file?: File) {
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a PDF file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large — max 5 MB')
      return
    }

    setUploading(true)
    setStage('upload')

    const progressTimer = simulateProgress(setProgress, setStage)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('clerkId', clerkId)
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription.trim())
      }

      const res = await fetch('/api/resume/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')

      clearInterval(progressTimer)
      setProgress(100)
      setStage('save')

      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error) {
      console.error(error)
      alert('Failed to upload resume. Please try again.')
      clearInterval(progressTimer)
      setUploading(false)
      setStage(null)
      setProgress(0)
    }
  }

  if (compact) {
    return (
      <div
        className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-700 hover:border-cyan-400/50 hover:bg-gray-800/50'
        }`}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
        {!uploading ? (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="w-6 h-6 text-cyan-400" />
            <h3 className="text-sm font-medium text-gray-200">Upload new PDF</h3>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin mb-2" />
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Job Description Side */}
      <div className="bg-[#111620] border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Briefcase className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Target Job Description</h3>
            <p className="text-sm text-gray-400">Paste the JD to get an ATS Match Score</p>
          </div>
        </div>
        
        <textarea
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          placeholder="Paste the job requirements, responsibilities, and qualifications here..."
          className="w-full h-[280px] bg-[#0A0D14] border border-gray-800 rounded-xl p-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 resize-none transition-all"
        />
      </div>

      {/* Resume Upload Side */}
      <div className="bg-[#111620] border border-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Upload Resume</h3>
            <p className="text-sm text-gray-400">Upload your PDF to analyze match</p>
          </div>
        </div>

        <div
          className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all ${
            isDragging ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-800 hover:border-cyan-500/50 hover:bg-[#1A2230]'
          }`}
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={e => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
          
          {!uploading ? (
            <>
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Click or drag PDF</h3>
              <p className="text-sm text-gray-500 max-w-[200px]">Ensure your resume is up to date before analyzing</p>
            </>
          ) : (
            <div className="flex flex-col items-center w-full max-w-[240px]">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-6 relative z-10" />
              </div>
              <div className="w-full">
                <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                  <span>{stageLabel(stage)}</span>
                  <span className="text-cyan-400">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300 ease-out relative" 
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite] w-full" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function stageLabel(stage: string | null) {
  const labels: Record<string, string> = { 
    upload: 'Uploading file...', 
    parse: 'Extracting text...', 
    ai: 'AI analyzing match...', 
    save: 'Saving results...' 
  }
  return stage ? labels[stage] : 'Processing...'
}

function simulateProgress(setProgress: (v: number) => void, setStage: (s: any) => void) {
  let v = 0
  return setInterval(() => {
    v += Math.floor(Math.random() * 5) + 1
    const p = Math.min(v, 95) // Max 95% until actually done
    setProgress(p)
    if (p > 10 && p < 40) setStage('parse')
    if (p >= 40 && p < 85) setStage('ai')
    if (p >= 85) setStage('save')
  }, 300)
}
