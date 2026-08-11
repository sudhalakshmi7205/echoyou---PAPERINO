'use client'
import { useState } from 'react'
import { savePreferences } from '../../actions'

export default function PreferencesForm({ initialPrefs }: { initialPrefs: any }) {
  const [form, setForm] = useState({
    defaultDifficulty: initialPrefs.defaultDifficulty,
    defaultDuration: initialPrefs.defaultDuration,
    defaultLanguage: initialPrefs.defaultLanguage,
    cameraEnabled: initialPrefs.cameraEnabled,
    autoStartCountdown: initialPrefs.autoStartCountdown
  })
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await savePreferences(form)
      alert("Preferences saved!")
    } catch (err) {
      console.error(err)
      alert("Failed to save")
    }
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-[#111620] border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Interview defaults</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Default difficulty</label>
            <select 
              value={form.defaultDifficulty} 
              onChange={e => setForm(f => ({ ...f, defaultDifficulty: e.target.value }))}
              className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:border-cyan-500 outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Default duration (minutes)</label>
            <select 
              value={form.defaultDuration} 
              onChange={e => setForm(f => ({ ...f, defaultDuration: parseInt(e.target.value) }))}
              className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:border-cyan-500 outline-none"
            >
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Default language</label>
            <select 
              value={form.defaultLanguage} 
              onChange={e => setForm(f => ({ ...f, defaultLanguage: e.target.value }))}
              className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:border-cyan-500 outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
            </select>
          </div>
        </div>
      </section>

      <section className="bg-[#111620] border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Media</h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.cameraEnabled}
              onChange={e => setForm(f => ({ ...f, cameraEnabled: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-800 text-cyan-500 focus:ring-cyan-500/20"
            />
            <div>
              <div className="text-sm font-medium text-white">Enable camera by default</div>
              <div className="text-xs text-gray-500">You can always toggle this per interview</div>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.autoStartCountdown}
              onChange={e => setForm(f => ({ ...f, autoStartCountdown: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-800 text-cyan-500 focus:ring-cyan-500/20"
            />
            <div>
              <div className="text-sm font-medium text-white">Auto-start countdown in lobby</div>
              <div className="text-xs text-gray-500">Automatically start interview after checks pass</div>
            </div>
          </label>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save preferences'}
          </button>
        </div>
      </section>
    </div>
  )
}
