'use client'
import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'

export default function NotificationBell() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Polling logic for future implementation, for now static 0 or mock 
    // fetch('/api/notifications/count').then(r => r.json()).then(d => setCount(d.count))
  }, [])

  return (
    <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
      <Bell className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
          {count}
        </span>
      )}
    </button>
  )
}
