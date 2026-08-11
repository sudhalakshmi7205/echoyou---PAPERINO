'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Loader2, Settings, Play, CheckCircle } from 'lucide-react'

interface ResumeFollowupUploaderProps {
  clerkId: string
  role: string
  activeResume?: { id: string; fileName: string } | null
}

export default function ResumeFollowupUploader({ clerkId, role, activeResume }: ResumeFollowupUploaderProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState('')
  
  const [difficulty, setDifficulty] = useState('medium')
  const [duration, setDuration] = useState('15')

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleStart = async () => {
    if (!file && !activeResume) return

    setIsUploading(true)
    try {
      // 1. Upload Resume only if a NEW file is selected
      if (file) {
        setStatus('Uploading and analyzing your new resume...')
        const formData = new FormData()
        formData.append('resume', file)
        formData.append('clerkId', clerkId)

        const uploadRes = await fetch('/api/resume/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) throw new Error('Failed to upload resume')
      }

      // 2. Create Interview
      setStatus('Generating tailored interview questions...')
      const interviewRes = await fetch('/api/interviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId,
          type: 'resume_followup',
          role: role,
          difficulty,
          duration: parseInt(duration),
          language: 'English',
          cameraEnabled: false,
        })
      })

      if (!interviewRes.ok) throw new Error('Failed to create interview')
      
      const { interview } = await interviewRes.json()

      // 3. Redirect to session
      setStatus('Redirecting to interview session...')
      router.push(`/dashboard/interviews/${interview.id}/session`)

    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Something went wrong')
      setIsUploading(false)
      setStatus('')
    }
  }

  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-6" />
        <h3 className="text-xl font-bold text-white mb-2">Preparing your Interview</h3>
        <p className="text-cyan-400">{status}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
          1. Select Resume
        </label>
        
        {/* Current Active Resume Indicator */}
        {!file && activeResume && (
          <div className="mb-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Using Current Profile Resume</p>
                <p className="text-xs text-gray-400">{activeResume.fileName}</p>
              </div>
            </div>
          </div>
        )}

        <label 
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
            ${file ? 'border-cyan-500 bg-cyan-500/5' : 'border-gray-700 bg-gray-900/50 hover:border-cyan-500/50 hover:bg-gray-800/50'}
          `}
        >
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          {file ? (
            <>
              <FileText className="w-10 h-10 text-cyan-400 mb-3" />
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">Click to change file</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-gray-300 font-medium mb-1">
                {activeResume ? 'Or upload a different resume' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-gray-500">PDF documents only</p>
            </>
          )}
        </label>
      </div>

      {/* Settings Area */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
          2. Interview Settings
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-xl flex items-center gap-4 focus-within:border-cyan-500/50 transition-colors">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Difficulty</label>
              <select 
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-medium outline-none appearance-none cursor-pointer"
              >
                <option value="easy">Easy (Foundational)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="hard">Hard (Advanced)</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-xl flex items-center gap-4 focus-within:border-cyan-500/50 transition-colors">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Duration</label>
              <select 
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-medium outline-none appearance-none cursor-pointer"
              >
                <option value="15">15 Minutes (Quick)</option>
                <option value="30">30 Minutes (Standard)</option>
                <option value="45">45 Minutes (Deep Dive)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleStart}
        disabled={!file && !activeResume}
        className={`
          w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-300
          ${(file || activeResume)
            ? 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/25' 
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        <Play className="w-5 h-5 fill-current" />
        Start Instant Interview
      </button>

    </div>
  )
}
