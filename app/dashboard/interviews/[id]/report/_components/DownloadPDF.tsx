'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'

export default function DownloadPDF({ interviewId }: { interviewId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(`/api/interviews/${interviewId}/report/download`)
      if (!res.ok) throw new Error("Failed to download")
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `echo-report-${interviewId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error(err)
      alert("Failed to download PDF")
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
    >
      <Download className="w-4 h-4" />
      {loading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  )
}
