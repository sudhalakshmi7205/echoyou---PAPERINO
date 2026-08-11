'use client'
import { ResumeVersion } from '@prisma/client'
import { Clock, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ResumeVersionHistory({ versions, clerkId }: { versions: ResumeVersion[], clerkId: string }) {
  const router = useRouter()
  const [restoringId, setRestoringId] = useState<string | null>(null)

  async function handleRestore(versionId: string) {
    if (!confirm('Are you sure you want to restore this older resume version? It will become your active resume.')) return
    
    setRestoringId(versionId)
    try {
      const res = await fetch('/api/resume/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: versionId, clerkId })
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to restore resume')
      }
    } catch (e) {
      alert('Error restoring resume')
    } finally {
      setRestoringId(null)
    }
  }

  if (!versions || versions.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Version History</h3>
      </div>
      
      <div className="space-y-3">
        {versions.map((version) => (
          <div key={version.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">{version.fileName}</span>
              <span className="text-xs text-gray-500">
                {new Date(version.createdAt).toLocaleDateString()} at {new Date(version.createdAt).toLocaleTimeString()}
              </span>
            </div>
            
            <button
              onClick={() => handleRestore(version.id)}
              disabled={restoringId === version.id}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${restoringId === version.id ? 'animate-spin' : ''}`} />
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
