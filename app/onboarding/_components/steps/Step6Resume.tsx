import { useState, useRef } from 'react'
import { StepProps } from '../StepRenderer'
import { ArrowRight, ArrowLeft, Upload, File as FileIcon, CheckCircle2, Loader2 } from 'lucide-react'

export default function Step6Resume({ data, onUpdate, onNext, onBack, clerkId }: StepProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to PDF for now
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.')
      return
    }

    setError(null)
    setIsUploading(true)

    const formData = new FormData()
    formData.append('resume', file)
    if (clerkId) formData.append('clerkId', clerkId)

    try {
      const res = await fetch('/api/onboarding/resume', {
        method: 'POST',
        body: formData,
      })
      
      if (!res.ok) throw new Error('Upload failed')
      
      const json = await res.json()
      onUpdate('resumeUrl', json.url)
    } catch (err) {
      setError('An error occurred during upload. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Resume</h2>
      <p className="text-gray-600 mb-8">We will automatically extract your skills and tailor your interview questions based on your actual experience.</p>
      
      <div className="mb-10">
        <input 
          type="file" 
          accept=".pdf" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
        
        {!data.resumeUrl ? (
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-2xl p-12 hover:border-purple-500 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isUploading ? (
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            ) : (
              <Upload className="w-10 h-10 text-gray-400 group-hover:text-purple-600 transition-colors" />
            )}
            <span className="font-medium text-gray-600 group-hover:text-purple-700">
              {isUploading ? 'Uploading...' : 'Click to upload PDF'}
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <FileIcon className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Resume Uploaded</p>
                <a href={data.resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-green-700 hover:underline">
                  View file
                </a>
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        )}
        
        {data.resumeUrl && (
          <button 
            onClick={() => {
              onUpdate('resumeUrl', null)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }} 
            className="text-sm text-gray-500 mt-4 underline hover:text-gray-900 block text-center w-full"
          >
            Upload a different file
          </button>
        )}

        {error && <p className="text-red-500 mt-4 text-sm text-center">{error}</p>}
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
          disabled={isUploading}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 transition-all"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
