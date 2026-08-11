'use client'

import { useEffect, useState } from 'react'

export default function Greeting({ user, profile }: { user: any, profile: any }) {
  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {greeting}, {user?.firstName || 'there'}! <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-gray-400 mt-1">
          {profile?.role ? `Ready to ace your next ${profile.role} interview?` : 'Ready for your next interview?'}
        </p>
      </div>
    </div>
  )
}
