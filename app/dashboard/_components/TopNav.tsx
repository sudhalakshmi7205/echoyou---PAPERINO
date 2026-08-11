'use client'

import { UserButton } from '@clerk/nextjs'
import DashboardSearch from './DashboardSearch'

export default function TopNav() {
  return (
    <header className="bg-[#111620]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30 h-16 w-full">
      <div className="h-full px-6 flex items-center justify-between lg:justify-end gap-4 w-full">
        <div className="flex-1 max-w-xl lg:ml-0 md:ml-12 sm:block hidden">
          <DashboardSearch />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          </div>
        </div>
      </div>
    </header>
  )
}
