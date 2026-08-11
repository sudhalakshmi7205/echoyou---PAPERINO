'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileSearch, Map, LineChart,
  User, Trophy, FileText, Briefcase, History,
  ChevronRight, Zap
} from 'lucide-react'

import { useUser } from '@clerk/nextjs'
import { isAdminEmail } from '@/lib/adminAuth'

const baseLinks = [
  { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard, color: '#8A5CFF' },
  { name: 'My History', href: '/dashboard/interviews', icon: History, color: '#35F3A7' },
  { name: 'EchoATS', href: '/dashboard/resume', icon: FileSearch, color: '#42A5FF' },
  { name: 'EchoRoadmap', href: '/dashboard/roadmap', icon: Map, color: '#8A5CFF' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: LineChart, color: '#42A5FF' },
  { name: 'Profile', href: '/dashboard/profile', icon: User, color: '#00E8FF' },
  { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy, color: '#8A5CFF' },
  { name: 'My Resume', href: '/dashboard/my-resume', icon: FileText, color: '#42A5FF' },
]

export default function NeuralSidebar({
  expanded,
  setExpanded
}: {
  expanded: boolean
  setExpanded: (val: boolean) => void
}) {
  const pathname = usePathname()
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const { user } = useUser()

  const isAdmin = isAdminEmail(user?.primaryEmailAddress?.emailAddress)

  const links = isAdmin
    ? [...baseLinks, { name: 'Admin Panel', href: '/dashboard/admin', icon: Briefcase, color: '#FFD700' }]
    : baseLinks

  return (
    <aside
      className="hidden md:flex"
      style={{
        position: 'fixed',
        left: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '16px 12px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        boxShadow: '0 8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        width: expanded ? 200 : 60,
        overflow: 'hidden',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => { setExpanded(false); setHoveredIdx(null) }}
    >
      {/* Exact Cyber Neon Concentric Ring Brand Logo */}
      <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, minWidth: 36 }}>
        <img 
          src="/echoyou_brand_logo.svg" 
          alt="EchoYou Cyber Logo" 
          style={{ width: 36, height: 36, flexShrink: 0, filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.5))' }}
        />
        {expanded && (
          <span style={{
            fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 16,
            background: 'linear-gradient(90deg, #D946EF 0%, #38BDF8 100%)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap',
            letterSpacing: '0.02em'
          }}>EchoYou</span>
        )}
      </Link>

      {/* Divider */}
      <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

      {/* Nav links */}
      {links.map((link, idx) => {
        const isActive = pathname === link.href
        const Icon = link.icon
        return (
          <Link
            key={link.href}
            href={link.href}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 12,
              width: '100%', textDecoration: 'none', position: 'relative',
              background: isActive
                ? `linear-gradient(135deg, ${link.color}20, rgba(255,255,255,0.04))`
                : hoveredIdx === idx ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: isActive ? `1px solid ${link.color}40` : '1px solid transparent',
              boxShadow: isActive ? `0 0 16px ${link.color}25` : 'none',
              transition: 'all 0.2s',
              overflow: 'hidden',
              minWidth: 36,
            }}
          >
            {/* Active beam */}
            {isActive && (
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: `linear-gradient(to bottom, ${link.color}, transparent)`,
                borderRadius: '0 3px 3px 0',
                boxShadow: `0 0 8px ${link.color}`,
              }} />
            )}
            <Icon
              size={18}
              style={{
                color: isActive ? link.color : hoveredIdx === idx ? '#fff' : 'rgba(255,255,255,0.4)',
                filter: isActive ? `drop-shadow(0 0 6px ${link.color})` : 'none',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            />
            {expanded && (
              <span style={{
                fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
              }}>
                {link.name}
              </span>
            )}
          </Link>
        )
      })}
    </aside>
  )
}
