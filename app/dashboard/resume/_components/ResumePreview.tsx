'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export default function ResumePreview({ resumeId, fileUrl, fileName }: { resumeId?: string, fileUrl: string, fileName: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to remove your active resume?')) return
    setIsDeleting(true)
    try {
      const res = await fetch('/api/resume/delete', { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Could not delete resume.')
      setIsDeleting(false)
    }
  }

  const iframeSrc = resumeId ? `/api/resume/file?id=${resumeId}#view=FitH` : `${fileUrl}#view=FitH`

  return (
    <div className="bg-[#111620] rounded-xl border border-gray-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-[#0B0E14]">
        <div className="flex items-center gap-2 overflow-hidden">
          <i className="ti ti-file-text text-xl text-cyan-400 flex-shrink-0" />
          <span className="font-medium text-gray-200 truncate text-sm">{fileName}</span>
        </div>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Remove
        </button>
      </div>
      <div className="flex-1 bg-gray-100 relative">
        <iframe 
          src={iframeSrc} 
          className="w-full h-full border-none filter contrast-[0.95]"
          title="Resume PDF Preview"
        />
      </div>
    </div>
  )
}
