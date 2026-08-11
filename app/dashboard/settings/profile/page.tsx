'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '')
      setLastName(user.lastName ?? '')
    }
  }, [user])

  async function save() {
    if (!user) return
    setSaving(true)
    try {
      await user.update({ firstName, lastName })
      alert("Profile updated successfully")
    } catch (err) {
      console.error(err)
      alert("Failed to update profile")
    }
    setSaving(false)
  }

  async function updateAvatar(file: File) {
    if (!user) return
    try {
      await user.setProfileImage({ file })
    } catch (err) {
      console.error(err)
      alert("Failed to update avatar")
    }
  }

  if (!isLoaded) return <div className="animate-pulse h-64 bg-gray-900/50 rounded-xl" />

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-[#111620] border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Profile photo</h2>
        <div className="flex items-center gap-6">
          <img
            src={user?.imageUrl}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-800"
          />
          <div>
            <input
              type="file" accept="image/*"
              onChange={e => e.target.files?.[0] && updateAvatar(e.target.files[0])}
              className="hidden" id="avatar-input"
            />
            <label htmlFor="avatar-input" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors inline-block">
              Change photo
            </label>
            <p className="text-xs text-gray-400 mt-2">JPG or PNG · max 5MB</p>
          </div>
        </div>
      </section>

      <section className="bg-[#111620] border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Personal info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">First name</label>
            <input 
              value={firstName} 
              onChange={e => setFirstName(e.target.value)} 
              className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Last name</label>
            <input 
              value={lastName} 
              onChange={e => setLastName(e.target.value)} 
              className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:border-cyan-500 outline-none"
            />
          </div>
        </div>
        
        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Email: <span className="text-white">{user?.primaryEmailAddress?.emailAddress}</span>
          </span>
          <span className="text-xs font-medium bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Verified
          </span>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <button 
            onClick={save} 
            disabled={saving} 
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </section>
    </div>
  )
}
