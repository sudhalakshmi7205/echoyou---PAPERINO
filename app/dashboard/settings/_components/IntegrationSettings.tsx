'use client'
import { useState, useEffect } from 'react'
import { getWebhook, saveWebhook } from '../actions'

export default function IntegrationSettings() {
  const [url, setUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const webhook = await getWebhook()
        if (webhook) {
          setUrl(webhook.url)
          setIsActive(webhook.isActive)
        }
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await saveWebhook(url, isActive)
      alert("Settings saved successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to save settings")
    }
    setSaving(false)
  }

  if (loading) return null

  return (
    <div className="bg-[#111620] border border-gray-800 rounded-xl p-6 shadow-2xl mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">ATS Integrations (B2B)</h2>
      <p className="text-sm text-gray-400 mb-6">
        Automatically push interview reports and scores to your Applicant Tracking System (like Greenhouse or Lever) via Webhooks when a candidate finishes an interview.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Webhook URL</label>
          <input 
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://hooks.greenhouse.io/..."
            className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="checkbox"
            id="active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-gray-800 text-cyan-500 focus:ring-cyan-500/20"
          />
          <label htmlFor="active" className="text-sm text-gray-300">Enable Webhook Dispatch</label>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
