'use client'
import { useClerk } from '@clerk/nextjs'
import { useState } from 'react'

export default function AccountPage() {
  const { signOut } = useClerk()
  const [confirm, setConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function deleteAccount() {
    if (confirm !== 'DELETE') return
    setDeleting(true)

    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' })
      if (!res.ok) throw new Error("Failed to delete account from database")

      await signOut({ redirectUrl: '/' })
    } catch (err) {
      console.error(err)
      alert("Failed to delete account. Please contact support.")
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-[#111620] border border-red-900/50 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5 mix-blend-screen pointer-events-none" />
        
        <h2 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-400 mb-6">
          Deleting your account permanently removes all interviews, reports, skills data, and personal information. 
          <span className="font-semibold text-gray-300"> This action cannot be undone.</span>
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type <span className="font-mono bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">DELETE</span> to confirm
            </label>
            <input
              placeholder='Type "DELETE" to confirm'
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full max-w-sm bg-[#0B0E14] border border-red-900/50 text-white rounded-lg px-4 py-2 focus:border-red-500 outline-none"
            />
          </div>
          
          <button
            onClick={deleteAccount}
            disabled={confirm !== 'DELETE' || deleting}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete my account'}
          </button>
        </div>
      </section>
    </div>
  )
}
