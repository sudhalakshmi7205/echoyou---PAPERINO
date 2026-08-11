'use client'
import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { generateShareLink } from '../actions'

export default function ShareButton({ interviewId }: { interviewId: string }) {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    setLoading(true)
    try {
      const link = await generateShareLink(interviewId)
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error(err)
      alert("Failed to generate share link")
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleShare}
      disabled={loading || copied}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${copied ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      {copied ? 'Link Copied!' : loading ? 'Generating...' : 'Share Report'}
    </button>
  )
}
