'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cpu, CheckCircle2, Activity, ShieldCheck, Zap, X } from 'lucide-react'

interface Satellite {
  label: string
  sub: string
  href: string
  color: string
  difficulty: string
  completed: number
  avgScore: number
  tip: string
  glowColor: string
}

export default function NeuralDashboardPage({ user, profile, interviews, achievements }: {
  user: any
  profile: any
  interviews: any[]
  achievements: any[]
}) {
  const [mounted, setMounted] = useState(false)
  const [typedName, setTypedName] = useState('')
  const [hoveredSat, setHoveredSat] = useState<number | null>(null)
  const [activeSat, setActiveSat] = useState<number | null>(null)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const [aiModalOpen, setAiModalOpen] = useState(false)
  
  const firstName = user?.firstName || 'Commander'

  const satellites: Satellite[] = [
    { label: 'Technical', sub: 'DSA & CS', href: '/dashboard/interviews/new?type=technical', color: '#8A5CFF', glowColor: 'rgba(138,92,255,0.4)', difficulty: 'Medium-Hard', completed: 4, avgScore: 78, tip: 'Practice dynamic programming questions.' },
    { label: 'Behavioural', sub: 'Soft Skills', href: '/dashboard/interviews/new?type=behavioural', color: '#35F3A7', glowColor: 'rgba(53,243,167,0.4)', difficulty: 'Easy-Medium', completed: 2, avgScore: 88, tip: 'Use the STAR method for structure.' },
    { label: 'System Design', sub: 'Architecture', href: '/dashboard/interviews/new?type=system_design', color: '#42A5FF', glowColor: 'rgba(66,165,255,0.4)', difficulty: 'Hard', completed: 1, avgScore: 72, tip: 'Design for scalability and redundancy.' },
    { label: 'Resume follow-up', sub: 'Resume QA', href: '/dashboard/resume-followups', color: '#00E8FF', glowColor: 'rgba(0,232,255,0.4)', difficulty: 'Adaptive', completed: 3, avgScore: 82, tip: 'Refresh memory of your oldest projects.' },
    { label: 'HR Round', sub: 'Culture Fit', href: '/dashboard/interviews/new?type=hr', color: '#FF6B6B', glowColor: 'rgba(255,107,107,0.4)', difficulty: 'Easy', completed: 1, avgScore: 90, tip: 'Research company core principles.' }
  ]

  // Typing animation for name
  useEffect(() => {
    setMounted(true)
    let i = 0
    const interval = setInterval(() => {
      setTypedName(firstName.slice(0, i + 1))
      i++
      if (i >= firstName.length) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [firstName])

  const completedInterviews = interviews.filter(i => i.status === 'completed')
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const thisWeekInterviews = interviews.filter(i => new Date(i.createdAt || Date.now()) >= oneWeekAgo)
  const avgScore = completedInterviews.length > 0
    ? Math.round(completedInterviews.filter(i => i.score !== null).reduce((s, i) => s + i.score, 0) / Math.max(completedInterviews.filter(i => i.score !== null).length, 1))
    : 0
  const highestScore = completedInterviews.length > 0 ? Math.max(...completedInterviews.map(i => i.score || 0)) : 0
  const totalMinutes = completedInterviews.reduce((s, i) => s + (i.duration || 0), 0)
  const inProgress = interviews.find(i => i.status === 'in_progress')

  const glassCard = (extra?: object) => ({
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 28,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
    ...extra,
  })

  const handleSatClick = (idx: number) => {
    setActiveSat(idx)
    setTimeout(() => {
      window.location.href = satellites[idx].href
    }, 800)
  }

  if (!mounted) return null

  // Increased orbit radius to support larger 130px spheres without overlapping
  const ORBIT_RADIUS = 280

  return (
    <div 
      className="px-4 md:px-8 pt-0 pb-16 relative z-10 w-full max-w-full overflow-hidden"
    >

      {/* ── NEURAL BACKGROUND LAYERS ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#05060B' }} />
        <div style={{
          position: 'absolute', width: '60vw', height: '60vw',
          top: '-10%', left: '20%',
          background: 'radial-gradient(ellipse, rgba(138,92,255,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(100px)',
        }} />
        <div style={{
          position: 'absolute', width: '40vw', height: '40vw',
          bottom: '0%', right: '5%',
          background: 'radial-gradient(ellipse, rgba(0,232,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(138,92,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(138,92,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* ── GREETING ── */}
        <div style={{ paddingTop: 40, marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Welcome back,
            </p>
            <h1 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
              {typedName}
              <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#8A5CFF', borderRadius: 2, animation: 'blink 1s step-end infinite', verticalAlign: 'middle', marginLeft: 2 }} />
            </h1>
            <p style={{ marginTop: 12, fontSize: 14, background: 'linear-gradient(90deg, #8A5CFF, #42A5FF, #00E8FF)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
              Your AI Interview Intelligence Center
            </p>
          </div>
        </div>

        {/* 📱 MOBILE VIEW LAUNCHPAD (Shown on small screens for clean mobile fit) */}
        <div className="block md:hidden space-y-4 mb-8">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-1">
            ⚡ Quick Practice Modes
          </p>
          <div className="grid grid-cols-1 gap-3">
            {satellites.map((sat, idx) => (
              <Link
                key={idx}
                href={sat.href}
                className="p-4 rounded-2xl border bg-[#0D111A]/90 backdrop-blur-md flex items-center justify-between transition-all hover:scale-[1.02] active:scale-95"
                style={{ borderColor: `${sat.color}40`, boxShadow: `0 0 15px ${sat.color}15` }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm border shadow-lg"
                    style={{ backgroundColor: `${sat.color}20`, borderColor: sat.color, color: sat.color }}
                  >
                    {sat.label.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{sat.label}</h4>
                    <p className="text-[11px] text-zinc-400 font-mono">{sat.sub} · {sat.difficulty}</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: `${sat.color}30`, border: `1px solid ${sat.color}50` }}>
                  Start &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 🖥️ DESKTOP 3D SYNCHRONIZED ORBITAL LAUNCHPAD (Hidden on mobile) */}
        <div className="hidden md:flex justify-center items-center h-[680px] relative perspective-[1500px] transform-style-3d mb-15 mt-5 overflow-visible">
          {/* Constantly rotating parent orbital system container */}
          <div
            className="orbit-system-rotate"
            style={{
              position: 'absolute',
              width: ORBIT_RADIUS * 2,
              height: ORBIT_RADIUS * 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformStyle: 'preserve-3d',
              animationPlayState: hoveredSat !== null || activeSat !== null ? 'paused' : 'running',
            }}
          >
            {/* Visual Orbit Ring */}
            <div style={{
              position: 'absolute',
              width: '100%', height: '100%',
              borderRadius: '50%',
              border: '1.5px dashed rgba(138,92,255,0.12)',
              pointerEvents: 'none',
              transform: 'translateZ(0px)',
            }} />

            {/* ── ENERGY BEAM LINE TO SESSION CORE ON HOVER / POINTER OR CLICK ── */}
            {(() => {
              const targetSat = hoveredSat !== null ? hoveredSat : activeSat
              if (targetSat === null) return null

              const activeSatData = satellites[targetSat]
              const angleDeg = targetSat * (360 / satellites.length) - 90
              const rad = angleDeg * (Math.PI / 180)
              const xSat = ORBIT_RADIUS + ORBIT_RADIUS * Math.cos(rad)
              const ySat = ORBIT_RADIUS + ORBIT_RADIUS * Math.sin(rad)
              const xCore = ORBIT_RADIUS
              const yCore = ORBIT_RADIUS

              return (
                <svg
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 45,
                    overflow: 'visible',
                  }}
                >
                  <defs>
                    <filter id="beam-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id={`beam-grad-${targetSat}`} x1={xSat} y1={ySat} x2={xCore} y2={yCore} gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor={activeSatData.color} stopOpacity="1" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#8A5CFF" stopOpacity="1" />
                    </linearGradient>
                  </defs>

                  {/* Wide Outer Glow Line */}
                  <line
                    x1={xSat} y1={ySat}
                    x2={xCore} y2={yCore}
                    stroke={activeSatData.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity="0.75"
                    filter="url(#beam-glow)"
                  />

                  {/* Core Energy Beam Line */}
                  <line
                    x1={xSat} y1={ySat}
                    x2={xCore} y2={yCore}
                    stroke={`url(#beam-grad-${targetSat})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="energy-beam-pulse"
                  />

                  {/* Energy Sparkle Particle Travelling to Core */}
                  <circle cx={xSat} cy={ySat} r="7" fill="#ffffff" filter="url(#beam-glow)">
                    <animate
                      attributeName="cx"
                      from={xSat}
                      to={xCore}
                      dur="0.35s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      from={ySat}
                      to={yCore}
                      dur="0.35s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              )
            })()}

            {/* Revolving Satellites with 100% Upright Horizontal Text */}
            {satellites.map((sat, idx) => {
              const isActive = activeSat === idx
              const isHovered = hoveredSat === idx
              const angleDeg = idx * (360 / satellites.length) - 90
              const rad = angleDeg * (Math.PI / 180)
              const leftPos = ORBIT_RADIUS + ORBIT_RADIUS * Math.cos(rad) - 65
              const topPos = ORBIT_RADIUS + ORBIT_RADIUS * Math.sin(rad) - 65

              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: leftPos,
                    top: topPos,
                    width: 130,
                    height: 130,
                    zIndex: isHovered || isActive ? 50 : 10,
                  }}
                >
                  {/* Node that counters the parent rotation so text is ALWAYS 100% upright & horizontal */}
                  <div
                    className="orbit-satellite-counter"
                    style={{
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                      transform: isActive
                        ? 'translateZ(100px) scale(1.35)'
                        : isHovered
                        ? 'translateZ(80px) scale(1.2)'
                        : 'translateZ(0px) scale(1)',
                      transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      animationPlayState: hoveredSat !== null || activeSat !== null ? 'paused' : 'running',
                    }}
                      onMouseEnter={() => {
                        setHoveredSat(idx)

                        // Calculate outward tooltip placement away from central SESSION CORE and bottom stats cards
                        const cosVal = Math.cos(rad)
                        const sinVal = Math.sin(rad)

                        const styles: React.CSSProperties = {
                          position: 'absolute',
                          width: 250,
                          padding: 16,
                          background: 'rgba(7,9,18,0.98)',
                          border: `1.5px solid ${sat.color}`,
                          borderRadius: 16,
                          boxShadow: `0 20px 50px rgba(0,0,0,0.95), 0 0 35px ${sat.color}45`,
                          backdropFilter: 'blur(24px)',
                          WebkitBackdropFilter: 'blur(24px)',
                          zIndex: 99999,
                          textAlign: 'left',
                          pointerEvents: 'auto',
                          opacity: 0,
                          animation: 'fadeSlideIn 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                        }

                        // Vertical position handling (Prevent bottom stats cards overflow)
                        if (sinVal > 0.1) {
                          // Lower satellites (like Resume Follow-Up & System Design) - place tooltip ABOVE to avoid bottom cutoff
                          styles.bottom = 135
                        } else if (sinVal < -0.3) {
                          // Upper satellites (like Technical & HR Round)
                          styles.bottom = 135
                        } else {
                          styles.bottom = 135
                        }

                        // Horizontal position handling
                        if (cosVal > 0.3) {
                          styles.left = 0
                        } else if (cosVal < -0.3) {
                          styles.right = 0
                        } else {
                          styles.left = '50%'
                          styles.transform = 'translateX(-50%)'
                        }

                        setTooltipStyle(styles)
                      }}
                      onMouseLeave={() => setHoveredSat(null)}
                      onClick={() => handleSatClick(idx)}
                    >
                      {/* Glowing Dark Luminous 3D Glass Sphere */}
                      <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3) 0%, ${sat.color}45 25%, #0A0D18 70%, #05060B 100%)`,
                        border: `2px solid ${sat.color}`,
                        boxShadow: isHovered || isActive
                          ? `0 0 50px ${sat.color}, 0 0 100px ${sat.color}80, inset 0 0 35px ${sat.color}80`
                          : `0 0 30px ${sat.color}60, 0 0 60px ${sat.color}30, inset 0 0 20px ${sat.color}40`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}>
                        {/* 3D Specular Highlight Shine */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 55%)`,
                          pointerEvents: 'none'
                        }} />
                        
                        {/* Inner Core Light Burst */}
                        <div style={{
                          position: 'absolute',
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${sat.color}70 0%, transparent 70%)`,
                          filter: 'blur(6px)',
                          pointerEvents: 'none'
                        }} />

                        <span style={{
                          fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 11,
                          color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.6px',
                          lineHeight: 1.2, padding: '0 8px', wordBreak: 'break-word',
                          textShadow: `0 0 12px ${sat.color}, 0 2px 8px rgba(0,0,0,0.9)`,
                          zIndex: 10,
                        }}>
                          {sat.label}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-inter)', fontSize: 8,
                          color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px',
                          marginTop: 4, fontWeight: 800,
                          background: `${sat.color}40`,
                          padding: '1.5px 6px',
                          borderRadius: 4,
                          border: `1px solid ${sat.color}60`,
                          textShadow: `0 0 8px ${sat.color}`,
                          zIndex: 10,
                        }}>
                          {sat.sub}
                        </span>
                        
                      {/* Interactive Details Tooltip (Shown on Hover) */}
                      {isHovered && !isActive && (
                        <div style={tooltipStyle}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-space-grotesk)', textTransform: 'uppercase', letterSpacing: '0.8px', textShadow: `0 0 10px ${sat.color}` }}>
                              {sat.label}
                            </span>
                            <span style={{ fontSize: 11, color: '#ffffff', fontFamily: 'var(--font-inter)', fontWeight: 800, background: `${sat.color}40`, padding: '2px 8px', borderRadius: 6, border: `1px solid ${sat.color}` }}>
                              {sat.difficulty}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 10, marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#e4e4e7', fontFamily: 'var(--font-inter)', fontWeight: 700 }}>
                              <span>Avg Score:</span>
                              <span style={{ color: '#ffffff', fontWeight: 900, textShadow: `0 0 8px ${sat.color}` }}>{sat.avgScore > 0 ? `${sat.avgScore}%` : '--'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#e4e4e7', fontFamily: 'var(--font-inter)', fontWeight: 700 }}>
                              <span>Sessions:</span>
                              <span style={{ color: '#ffffff', fontWeight: 900, textShadow: `0 0 8px ${sat.color}` }}>{sat.completed}</span>
                            </div>
                          </div>

                          <div style={{ fontSize: 11, color: '#67e8f9', fontFamily: 'var(--font-inter)', fontWeight: 700, fontStyle: 'italic', marginBottom: 12, lineHeight: 1.4, background: 'rgba(0,232,255,0.08)', padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(0,232,255,0.2)' }}>
                            💡 <strong>Tip:</strong> {sat.tip}
                          </div>

                          <div style={{
                            width: '100%', padding: '10px 0', borderRadius: 10,
                            background: `linear-gradient(135deg, ${sat.color}, #0D111A)`,
                            border: `1.5px solid ${sat.color}`,
                            boxShadow: `0 0 20px ${sat.color}60`,
                            color: '#ffffff', fontSize: 12, fontWeight: 900,
                            textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.08em',
                            fontFamily: 'var(--font-inter)',
                          }}>
                            Launch Interview &rarr;
                          </div>
                        </div>
                      )} </div>

                    </div>
                </div>
              )
            })}
          </div>

          {/* 4. STATIONARY Central SESSION CORE (Enlarged to 220px Reactor) */}
          <div style={{
            position: 'absolute',
            width: 220, height: 220, borderRadius: '50%',
            background: activeSat !== null
              ? `radial-gradient(circle, ${satellites[activeSat].color}40 0%, rgba(11,14,20,0.95) 70%)`
              : 'linear-gradient(135deg, rgba(138,92,255,0.2) 0%, rgba(0,232,255,0.05) 100%)',
            border: activeSat !== null
              ? `3px solid ${satellites[activeSat].color}`
              : '2.5px solid rgba(138,92,255,0.45)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: activeSat !== null
              ? `0 0 100px ${satellites[activeSat].glowColor}, 0 0 40px #ffffff, inset 0 0 50px ${satellites[activeSat].color}`
              : '0 0 65px rgba(138,92,255,0.5), inset 0 0 40px rgba(138,92,255,0.25)',
            zIndex: 30,
            padding: 24,
            textAlign: 'center',
            userSelect: 'none',
            transform: activeSat !== null ? 'translateZ(50px) scale(1.15)' : 'translateZ(0px) scale(1)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
          }}>
            <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '1px solid rgba(0,232,255,0.3)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
            <span style={{ fontSize: 38, display: 'block', textShadow: '0 0 15px #8A5CFF', animation: 'float 4s ease-in-out infinite' }}>⚡</span>
            <h3 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '1px', marginTop: 6 }}>SESSION CORE</h3>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Interview Engine</p>
          </div>

        </div>

        {/* ── FLOATING STAT WIDGETS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10">
          {[
            { label: 'Avg Score', value: avgScore > 0 ? `${avgScore}%` : '--', sub: 'Interview rating', color: '#8A5CFF', icon: '◎' },
            { label: 'Highest Score', value: highestScore > 0 ? `${highestScore}%` : '--', sub: 'Personal best', color: '#42A5FF', icon: '▲' },
            { label: 'Sessions', value: completedInterviews.length.toString(), sub: 'Completed', color: '#00E8FF', icon: '◆' },
            { label: 'Practice Time', value: totalMinutes > 0 ? `${totalMinutes}m` : '--', sub: 'Total duration', color: '#8A5CFF', icon: '◐' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                ...glassCard(),
                borderColor: `${stat.color}20`,
                boxShadow: `0 0 0 0 ${stat.color}`,
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-8px) perspective(800px) rotateX(4deg)'
                el.style.boxShadow = `0 20px 60px ${stat.color}25, 0 0 0 1px ${stat.color}30`
                el.style.borderColor = `${stat.color}50`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = ''
                el.style.boxShadow = ''
                el.style.borderColor = `${stat.color}20`
              }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(ellipse, ${stat.color}20, transparent 70%)`, filter: 'blur(20px)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {stat.label}
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 36, fontWeight: 700, color: stat.color, lineHeight: 1, textShadow: `0 0 20px ${stat.color}60` }}>{stat.value}</h2>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>{stat.sub}</p>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${stat.color}15`, border: `1px solid ${stat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: stat.color, boxShadow: `0 0 12px ${stat.color}30` }}>{stat.icon}</div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 24, right: 24, height: 1, background: `linear-gradient(90deg, transparent, ${stat.color}50, transparent)` }} />
            </div>
          ))}
        </div>

        {/* ── IN PROGRESS BANNER ── */}
        {inProgress && (
          <div style={{
            ...glassCard({ padding: '20px 28px' }),
            marginBottom: 32,
            background: 'rgba(138,92,255,0.08)',
            borderColor: 'rgba(138,92,255,0.3)',
            boxShadow: '0 0 30px rgba(138,92,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#35F3A7', boxShadow: '0 0 10px #35F3A7' }} />
              <div>
                <p style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 600, color: '#fff', fontSize: 15 }}>
                  Session in progress — {inProgress.role}
                </p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                  {inProgress.type?.replace('_', ' ')} · {inProgress.difficulty}
                </p>
              </div>
            </div>
            <Link href={`/dashboard/interviews/${inProgress.id}/session`} style={{
              padding: '8px 20px', borderRadius: 10,
              background: 'linear-gradient(135deg, #8A5CFF, #00E8FF)',
              color: '#fff', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(138,92,255,0.4)',
            }}>
              Resume →
            </Link>
          </div>
        )}

        {/* ── MAIN GRID (Stacked 1 column on mobile, 2 columns on desktop) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          
          {/* LEFT — Neural Memory Log (This Week's Activity) */}
          <div style={glassCard()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div className="flex items-center gap-3">
                <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 18, color: '#fff' }}>
                  This Week's Memory Log 📅
                </h2>
                <span className="text-[11px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                  {thisWeekInterviews.length} sessions
                </span>
              </div>

              <Link 
                href="/dashboard/interviews"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/40 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-all group shadow-sm"
              >
                <span>📜 My Full History</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {thisWeekInterviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px' }} className="space-y-3">
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
                  No interview sessions recorded this week!
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link 
                    href="/dashboard/interviews"
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 transition-all"
                  >
                    📜 View Past History
                  </Link>
                  <Link 
                    href="/dashboard/interviews/new"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
                  >
                    🚀 Start New Interview
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {thisWeekInterviews.map((interview, i) => (
                  <div key={interview.id} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                    {i < thisWeekInterviews.length - 1 && (
                      <div style={{
                        position: 'absolute', left: 15, top: 32, bottom: -8,
                        width: 1,
                        background: 'linear-gradient(to bottom, rgba(138,92,255,0.4), transparent)',
                      }} />
                    )}
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                      background: interview.status === 'completed' ? 'rgba(53,243,167,0.15)' : interview.status === 'in_progress' ? 'rgba(138,92,255,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${interview.status === 'completed' ? 'rgba(53,243,167,0.4)' : interview.status === 'in_progress' ? 'rgba(138,92,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12,
                      boxShadow: interview.status === 'completed' ? '0 0 10px rgba(53,243,167,0.3)' : interview.status === 'in_progress' ? '0 0 10px rgba(138,92,255,0.3)' : 'none',
                    }}>
                      {interview.status === 'completed' ? '✓' : interview.status === 'in_progress' ? '▶' : '○'}
                    </div>
                    <Link href={`/interview/${interview.id}`} style={{
                      flex: 1, padding: '12px 16px', borderRadius: 14, marginBottom: 8,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      textDecoration: 'none', display: 'block',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(138,92,255,0.08)'
                        el.style.borderColor = 'rgba(138,92,255,0.2)'
                        el.style.transform = 'translateX(4px)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(255,255,255,0.02)'
                        el.style.borderColor = 'rgba(255,255,255,0.05)'
                        el.style.transform = ''
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <p style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 600, fontSize: 14, color: '#fff' }}>
                          {interview.role}
                        </p>
                        {interview.score !== null && (
                          <span style={{
                            fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 18,
                            color: interview.score >= 80 ? '#35F3A7' : interview.score >= 60 ? '#42A5FF' : '#FF6B6B',
                          }}>{Math.round(interview.score)}%</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(138,92,255,0.1)', color: 'rgba(138,92,255,0.8)', fontFamily: 'var(--font-inter)' }}>
                          {interview.type?.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-inter)' }} suppressHydrationWarning>
                          {new Date(interview.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Productivity widgets column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quick Actions */}
            <div style={glassCard()}>
              <h3 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 18 }}>
                Quick Launch
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Technical Interview', href: '/dashboard/interviews/new?type=technical', color: '#8A5CFF' },
                  { label: 'ATS Resume Lab', href: '/dashboard/resume', color: '#42A5FF' },
                  { label: 'Resume Followup AI', href: '/dashboard/resume-followups', color: '#00E8FF' },
                  { label: 'Analytics Dashboard', href: '/dashboard/analytics', color: '#8A5CFF' },
                ].map(action => (
                  <Link key={action.href} href={action.href} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12,
                    background: `${action.color}08`,
                    border: `1px solid ${action.color}20`,
                    textDecoration: 'none', transition: 'all 0.2s',
                    fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)',
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = `${action.color}15`
                      el.style.borderColor = `${action.color}50`
                      el.style.color = '#fff'
                      el.style.transform = 'translateX(4px)'
                      el.style.boxShadow = `0 0 20px ${action.color}20`
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = `${action.color}08`
                      el.style.borderColor = `${action.color}20`
                      el.style.color = 'rgba(255,255,255,0.7)'
                      el.style.transform = ''
                      el.style.boxShadow = ''
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: action.color, boxShadow: `0 0 6px ${action.color}`, flexShrink: 0 }} />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Performance summary */}
            <div style={glassCard()}>
              <h3 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 20 }}>
                Performance Core
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="34" fill="none"
                      stroke="url(#scoreGrad)" strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - avgScore / 100)}`}
                      transform="rotate(-90 40 40)"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8A5CFF" />
                        <stop offset="100%" stopColor="#00E8FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 18, color: '#fff' }}>
                      {avgScore > 0 ? avgScore : '--'}
                    </span>
                  </div>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Score</p>
                  <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 22, fontWeight: 700, color: '#8A5CFF', marginTop: 4 }}>
                    {avgScore > 0 ? `${avgScore}%` : 'N/A'}
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
                    {completedInterviews.length} sessions completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        
        .orbit-system-rotate {
          animation: orbitRotate 45s linear infinite;
        }

        .orbit-satellite-counter {
          animation: satelliteCounter 45s linear infinite;
        }

        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes satelliteCounter {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: var(--current-transform, translateX(-50%)) translateY(10px); }
          to { opacity: 1; transform: var(--current-transform, translateX(-50%)) translateY(0); }
        }

        @keyframes energyPulse {
          0% { stroke-dashoffset: 120; opacity: 0.6; }
          50% { opacity: 1; stroke-width: 5; }
          100% { stroke-dashoffset: 0; opacity: 0.6; }
        }

        .energy-beam-pulse {
          stroke-dasharray: 12 8;
          animation: energyPulse 0.35s linear infinite;
        }
      `}</style>
      {/* 🟢 INTERACTIVE LIVE AI DIAGNOSTICS MODAL */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0B0E17] border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(53,243,167,0.2)] space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    EchoAI Engine Status
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium">All Core LLMs Operational</p>
                </div>
              </div>
              <button 
                onClick={() => setAiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics List */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-zinc-300">Active High-Reasoning LLM</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">DeepSeek R1 / Llama 70B</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-zinc-300">Avg LPU Latency</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">142ms ⚡</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-zinc-300">ATS & Security Filters</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={() => setAiModalOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(53,243,167,0.4)] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
