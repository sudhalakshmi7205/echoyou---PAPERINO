'use client'
import { useState, useEffect } from 'react'

type PromptType = 'interview' | 'evaluation' | 'resume'

export default function PromptEditor({ active, history }: { active: any, history: any[] }) {
  const [activeTab, setActiveTab] = useState<PromptType>('interview')
  
  // Set initial content based on selected tab
  const getActiveContent = (type: PromptType) => active[type]?.content || ''
  
  const [content, setContent] = useState(getActiveContent(activeTab))
  const [saving, setSaving] = useState(false)
  
  // Fallbacks
  const fallbacks: Record<PromptType, string> = {
    interview: "You are Echo, a technical interviewer...",
    evaluation: "You are a senior engineering interviewer...",
    resume: "Extract the summary and skills from the resume..."
  }

  // Update editor content when tab changes
  useEffect(() => {
    setContent(getActiveContent(activeTab))
  }, [activeTab, active])

  async function publish() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content || fallbacks[activeTab], type: activeTab })
      })
      if (!res.ok) throw new Error("Failed to publish")
      
      alert(`Successfully published new ${activeTab} prompt.`)
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert("Failed to publish")
      setSaving(false)
    }
  }

  const TABS: { id: PromptType, label: string }[] = [
    { id: 'interview', label: 'Interview Engine' },
    { id: 'evaluation', label: 'Evaluation Engine' },
    { id: 'resume', label: 'Resume Parser' }
  ]

  const filteredHistory = history.filter(p => p.type === activeTab)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-[#111620] border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-800 bg-[#0B0E14]">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-800/30' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#0B0E14]">
            <h2 className="text-sm font-semibold text-white capitalize">{activeTab} Prompt</h2>
            {active[activeTab] && <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold rounded">LIVE</span>}
          </div>
          
          <div className="p-6">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Enter ${activeTab} system prompt here...`}
              className="w-full h-96 font-mono text-sm bg-[#0B0E14] text-gray-300 border border-gray-800 rounded-lg p-4 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none scrollbar-thin scrollbar-thumb-gray-800"
            />
            <div className="mt-6 flex justify-end">
              <button 
                onClick={publish} 
                disabled={saving || content === getActiveContent(activeTab)} 
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-500 text-black text-sm font-semibold rounded-lg transition-colors"
              >
                {saving ? 'Publishing...' : 'Publish new version'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <div className="bg-[#111620] border border-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[600px]">
          <div className="px-6 py-4 border-b border-gray-800 bg-[#0B0E14]">
            <h2 className="text-sm font-semibold text-white capitalize">{activeTab} History</h2>
          </div>
          <div className="divide-y divide-gray-800 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-800">
            {filteredHistory.map(p => (
              <div key={p.id} className="p-4 hover:bg-gray-800/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-400 text-xs">{new Date(p.createdAt).toLocaleString()}</span>
                  {p.isActive && <span className="text-[10px] uppercase font-bold bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">Active</span>}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">By: {p.createdBy.substring(0, 8)}...</span>
                  <button 
                    onClick={() => setContent(p.content)} 
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 rounded transition-colors"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
            {filteredHistory.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">No versions found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
