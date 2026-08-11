'use client'
import { useState } from 'react'
import { savePreferences } from '../../actions'

export default function NotificationsForm({ initialPrefs }: { initialPrefs: any }) {
  const [form, setForm] = useState({
    emailOnComplete: initialPrefs.emailOnComplete,
    emailWeeklySummary: initialPrefs.emailWeeklySummary,
    emailTips: initialPrefs.emailTips,
    inAppAchievements: initialPrefs.inAppAchievements,
    inAppReminders: initialPrefs.inAppReminders
  })
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await savePreferences(form)
      alert("Notifications saved!")
    } catch (err) {
      console.error(err)
      alert("Failed to save")
    }
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-[#111620] border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Email Notifications</h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.emailOnComplete}
              onChange={e => setForm(f => ({ ...f, emailOnComplete: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-800 text-cyan-500 focus:ring-cyan-500/20"
            />
            <div>
              <div className="text-sm font-medium text-white">Interview completion</div>
              <div className="text-xs text-gray-500">Receive an email when your interview report is ready</div>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.emailWeeklySummary}
              onChange={e => setForm(f => ({ ...f, emailWeeklySummary: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-800 text-cyan-500 focus:ring-cyan-500/20"
            />
            <div>
              <div className="text-sm font-medium text-white">Weekly summary</div>
              <div className="text-xs text-gray-500">A weekly digest of your performance and streaks</div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.emailTips}
              onChange={e => setForm(f => ({ ...f, emailTips: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-800 text-cyan-500 focus:ring-cyan-500/20"
            />
            <div>
              <div className="text-sm font-medium text-white">Tips & Tricks</div>
              <div className="text-xs text-gray-500">Receive occasional career and interview tips</div>
            </div>
          </label>
        </div>
      </section>

      <section className="bg-[#111620] border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">In-App Notifications</h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.inAppAchievements}
              onChange={e => setForm(f => ({ ...f, inAppAchievements: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-800 text-cyan-500 focus:ring-cyan-500/20"
            />
            <div>
              <div className="text-sm font-medium text-white">Achievements</div>
              <div className="text-xs text-gray-500">Show a popup when you unlock a new achievement</div>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.inAppReminders}
              onChange={e => setForm(f => ({ ...f, inAppReminders: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-800 text-cyan-500 focus:ring-cyan-500/20"
            />
            <div>
              <div className="text-sm font-medium text-white">Reminders</div>
              <div className="text-xs text-gray-500">Show reminders for upcoming scheduled interviews</div>
            </div>
          </label>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save notifications'}
          </button>
        </div>
      </section>
    </div>
  )
}
