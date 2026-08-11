'use client'

import { Search } from 'lucide-react'

export default function DashboardSearch() {
  return (
    <div className="relative max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all"
        placeholder="Search past interviews, feedback, or topics..."
      />
    </div>
  )
}
