'use client'
import { useRouter } from 'next/navigation'
import { Trash2, Download, MoreVertical } from 'lucide-react'
import { useState } from 'react'

export default function ResumeActions({ clerkId, fileUrl, fileName }: { clerkId: string, fileUrl: string, fileName: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete your active resume?')) return
    setIsDeleting(true)
    try {
      const res = await fetch('/api/resume/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId })
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to delete resume')
      }
    } catch (e) {
      alert('Error deleting resume')
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20">
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noreferrer"
              download={fileName}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              onClick={() => setIsOpen(false)}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Resume'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
