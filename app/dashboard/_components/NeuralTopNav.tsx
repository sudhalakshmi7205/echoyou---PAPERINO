import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Sparkles, Terminal, Command, Menu, X, LayoutDashboard, 
  Video, FileSearch, Map, Award, User, Plus, ChevronRight, Zap
} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

const COMMANDS = [
  { name: 'Start Technical Interview Prep', category: 'Interviews', href: '/dashboard/interviews/new?type=technical' },
  { name: 'Start HR Interview Prep', category: 'Interviews', href: '/dashboard/interviews/new?type=hr' },
  { name: 'Start Behavioural Interview Prep', category: 'Interviews', href: '/dashboard/interviews/new?type=behavioural' },
  { name: 'Start System Design Prep', category: 'Interviews', href: '/dashboard/interviews/new?type=system_design' },
  { name: 'Start Resume Follow-Up Prep', category: 'Interviews', href: '/dashboard/interviews/new?type=resume_followup' },
  { name: 'EchoATS Resume & JD Analyzer', category: 'ATS', href: '/dashboard/resume' },
  { name: 'EchoRoadmap AI Career Planner', category: 'Roadmap', href: '/dashboard/roadmap' },
  { name: 'Resume Builder Editor', category: 'Resume', href: '/dashboard/my-resume' },
  { name: 'Analytics Dashboard Overview', category: 'Dashboard', href: '/dashboard' },
  { name: 'Saved Resumes Database', category: 'Resume', href: '/dashboard/resume' },
]

const MOBILE_NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-cyan-400' },
  { label: 'Mock Interviews', href: '/dashboard/interviews', icon: Video, color: 'text-purple-400' },
  { label: 'EchoATS Resume', href: '/dashboard/resume', icon: FileSearch, color: 'text-emerald-400' },
  { label: 'Career Roadmap', href: '/dashboard/roadmap', icon: Map, color: 'text-amber-400' },
  { label: 'Leaderboard & Badges', href: '/dashboard/leaderboard', icon: Award, color: 'text-rose-400' },
  { label: 'Candidate Profile', href: '/dashboard/profile', icon: User, color: 'text-blue-400' },
]

export default function NeuralTopNav({ expanded }: { expanded?: boolean }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [time, setTime] = useState('')
  const [customAvatar, setCustomAvatar] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchAvatar = async () => {
    try {
      const res = await fetch('/api/user/avatar')
      if (!res.ok) return
      const data = await res.json()
      if (data.customAvatarUrl) {
        setCustomAvatar(data.customAvatarUrl)
      }
    } catch {
      // Silently ignore avatar fetch failures
    }
  }

  useEffect(() => {
    fetchAvatar()
    const handleAvatarUpdate = () => fetchAvatar()
    window.addEventListener('profileAvatarUpdated', handleAvatarUpdate)
    return () => window.removeEventListener('profileAvatarUpdated', handleAvatarUpdate)
  }, [])

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.name.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        router.push(filteredCommands[selectedIndex].href)
        setIsOpen(false)
        setQuery('')
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <>
      <header 
        className={`sticky top-0 z-40 bg-[#05060B]/80 backdrop-blur-2xl border-b border-white/10 h-20 flex items-center justify-between gap-4 px-4 md:px-7 transition-all duration-300 ${
          expanded ? 'md:pl-[236px]' : 'md:pl-[96px]'
        }`}
      >
        {/* Mobile Left Bar: Hamburger Button & Logo */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/echoyou_brand_logo.svg" alt="EchoYou Cyber Logo" className="w-8 h-8 shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            <span className="font-black text-base tracking-tight bg-gradient-to-r from-fuchsia-500 to-sky-400 bg-clip-text text-transparent">EchoYou</span>
          </Link>
        </div>

      {/* Global Command Search Box (Hidden on small mobile screens to prevent right-side overflow) */}
      <div 
        ref={dropdownRef}
        className="hidden sm:block flex-1 max-w-[520px] relative"
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(138,92,255,0.2)',
          borderRadius: 14,
          padding: '0 14px', height: 42,
          transition: 'all 0.3s',
        }}
          onFocus={() => setIsOpen(true)}
        >
          <Sparkles size={15} style={{ color: '#8A5CFF', flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search dashboard, resume builders, and interview tools..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: 13,
              fontFamily: 'var(--font-inter)',
            }}
          />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '2px 6px', borderRadius: 6,
            color: 'rgba(255,255,255,0.4)', fontSize: 10,
            fontWeight: 'bold', fontFamily: 'monospace'
          }}>
            <Command size={10} />
            <span>K</span>
          </div>
        </div>

        {/* Global Command Menu Overlay */}
        <AnimatePresence>
          {isOpen && filteredCommands.length > 0 && (
            <div style={{
              position: 'absolute', top: '120%', left: 0, right: 0,
              background: '#0B0D14', border: '1px solid rgba(138,92,255,0.25)',
              borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5), 0 0 20px rgba(138,92,255,0.1)',
              zIndex: 110, maxHeight: 320, overflowY: 'auto'
            }}>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between' }}>
                <span>COMMAND SEARCH</span>
                <span>↑↓ navigate · ↵ enter</span>
              </div>
              {filteredCommands.map((cmd, i) => {
                const isActive = i === selectedIndex
                return (
                  <div
                    key={cmd.name}
                    onClick={() => {
                      router.push(cmd.href)
                      setIsOpen(false)
                      setQuery('')
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', cursor: 'pointer',
                      background: isActive ? 'rgba(138,92,255,0.12)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Terminal size={14} style={{ color: isActive ? '#00E8FF' : 'rgba(255,255,255,0.3)' }} />
                      <span style={{ fontSize: 13, color: isActive ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: isActive ? 'bold' : 'normal' }}>
                        {cmd.name}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold',
                      padding: '2px 8px', borderRadius: 6,
                      background: isActive ? 'rgba(0,232,255,0.1)' : 'rgba(255,255,255,0.03)',
                      color: isActive ? '#00E8FF' : 'rgba(255,255,255,0.35)',
                      border: isActive ? '1px solid rgba(0,232,255,0.2)' : '1px solid transparent'
                    }}>
                      {cmd.category}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Clock */}
        <div style={{
          fontFamily: 'var(--font-space-grotesk)', fontSize: 13, fontWeight: 600,
          color: 'rgba(255,255,255,0.35)',
          display: 'none',
        }} className="md-clock"
          suppressHydrationWarning
        >{time}</div>

        {/* Holographic Avatar */}
        <div style={{
          position: 'relative',
          padding: 2,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8A5CFF, #00E8FF)',
          boxShadow: '0 0 16px rgba(138,92,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', background: '#0B0D14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {customAvatar ? (
              <img 
                src={customAvatar} 
                alt="Candidate Avatar" 
                onClick={() => router.push('/dashboard/profile')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                title="Go to Profile"
              />
            ) : (
              <UserButton appearance={{
                elements: {
                  avatarBox: { width: 34, height: 34 }
                }
              }} />
            )}
          </div>
        </div>
      </div>
    </header>

    {/* 📱 CYBER MOBILE SLIDE-OVER DRAWER MENU */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Slide Drawer Content */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-4/5 max-w-xs bg-[#0B0E17] border-r border-cyan-500/30 h-full p-6 flex flex-col justify-between z-10 shadow-[0_0_50px_rgba(34,211,238,0.2)]"
          >
            <div className="space-y-6">
              {/* Header: Logo & Close */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <img src="/echoyou_brand_logo.svg" alt="EchoYou Cyber Logo" className="w-8 h-8 shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  <span className="font-black text-base tracking-tight bg-gradient-to-r from-fuchsia-500 to-sky-400 bg-clip-text text-transparent">EchoYou</span>
                </div>
                
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Start Interview Action */}
              <Link
                href="/dashboard/interviews/new"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Interview</span>
              </Link>

              {/* Navigation Items */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Navigation</p>
                {MOBILE_NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                        isActive 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Footer Profile & Auth */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {customAvatar ? (
                  <img src={customAvatar} alt="Avatar" className="w-10 h-10 rounded-full border border-cyan-400 object-cover" />
                ) : (
                  <UserButton />
                )}
                <div>
                  <p className="text-xs font-bold text-white">EchoYou Student</p>
                  <p className="text-[10px] text-cyan-400 font-semibold uppercase">Verified Candidate</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </>
)
}
