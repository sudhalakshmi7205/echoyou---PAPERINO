'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import NeuralSidebar from './NeuralSidebar'
import NeuralTopNav from './NeuralTopNav'

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  const pathname = usePathname()

  // For Admin route, render dedicated full-page admin layout directly
  if (pathname.startsWith('/dashboard/admin')) {
    return <>{children}</>
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#05060B',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Floating Neural Sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <NeuralSidebar expanded={expanded} setExpanded={setExpanded} />
      </div>

      {/* Top Navigation */}
      <NeuralTopNav expanded={expanded} />

      {/* Main content */}
      <main
        className={`flex-1 relative transition-all duration-300 pl-0 ${
          expanded ? 'md:pl-[236px]' : 'md:pl-[96px]'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
