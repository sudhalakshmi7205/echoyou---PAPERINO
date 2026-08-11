'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileSearch, Map, LineChart, User, Trophy, FileText, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'

import { useUser } from '@clerk/nextjs'
import { isAdminEmail } from '@/lib/adminAuth'

export default function Sidebar({ isCollapsed, toggleSidebar }: { isCollapsed?: boolean, toggleSidebar?: () => void }) {
  const pathname = usePathname()
  const { user } = useUser()
  const isAdmin = isAdminEmail(user?.primaryEmailAddress?.emailAddress)

  const baseLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'echoATS', href: '/dashboard/resume', icon: FileSearch },
    { name: 'Resume Followups', href: '/dashboard/resume-followups', icon: Briefcase },
    { name: 'echoROADMAP', href: '/dashboard/roadmap', icon: Map },
    { name: 'echoANALYTICS', href: '/dashboard/analytics', icon: LineChart },
    { name: 'My Profile', href: '/dashboard/profile', icon: User },
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
    { name: 'My Resume', href: '/dashboard/my-resume', icon: FileText },
  ]

  const links = isAdmin
    ? [...baseLinks, { name: 'Admin Panel 🛡️', href: '/dashboard/admin', icon: Briefcase }]
    : baseLinks

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 bg-[#111620]/90 backdrop-blur-xl border-r border-gray-800/60 z-40 hidden md:flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'} border-b border-gray-800/60`}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/80 bg-[#0B0E14] flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.6)] shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 to-cyan-400/40 animate-[spin_3s_linear_infinite]" />
            <div className="w-4 h-4 rounded-full border border-cyan-300/80 relative z-10 bg-[#0B0E14]/50 backdrop-blur-sm" />
          </div>
          {!isCollapsed && (
            <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              EchoYou
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 relative group-hover:block">
        {!isCollapsed && (
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-4">Main Menu</div>
        )}
        
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              title={isCollapsed ? link.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.05)]' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              )}
              <link.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400/70'}`} />
              {!isCollapsed && (
                <span className="font-medium text-sm whitespace-nowrap">{link.name}</span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Toggle Button */}
      {toggleSidebar && (
        <div className="p-4 border-t border-gray-800/60 flex justify-center">
          <button 
            onClick={toggleSidebar}
            className="w-full flex justify-center items-center p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      )}
    </aside>
  )
}
