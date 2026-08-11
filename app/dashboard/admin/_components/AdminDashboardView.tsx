'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users, Video, FileSearch, Map, Shield, Activity, 
  Search, CheckCircle, Cpu, TrendingUp, Sparkles, RefreshCw, BarChart2, Loader2,
  LayoutDashboard, ArrowLeft, Zap, Wrench, ToggleLeft, ToggleRight, Check, X,
  Trash2, AlertTriangle, CheckSquare, Square
} from 'lucide-react'

interface AdminDashboardViewProps {
  adminEmail: string
}

interface RealUser {
  id: string
  name: string
  email: string
  role: string
  joinedDate: string
  imageUrl?: string
}

interface RealInterview {
  id: string
  role: string
  type: string
  difficulty: string
  score: number
  status: string
  date: string
}

type AdminTab = 'overview' | 'features' | 'users' | 'interviews' | 'resume' | 'roadmap' | 'system'

interface FeatureControlItem {
  key: string
  name: string
  category: string
  description: string
  icon: any
  color: string
}

const FEATURE_LIST: FeatureControlItem[] = [
  { key: 'mock_interviews', name: 'AI Live Mock Interviews', category: 'Core AI Engine', description: 'Voice & text mock interview simulations with AI interviewer', icon: Video, color: '#42A5FF' },
  { key: 'ats_resume', name: 'EchoATS Resume Scanner', category: 'Career Tools', description: 'PDF text parsing, skill extraction & ATS score analyzer', icon: FileSearch, color: '#00FF66' },
  { key: 'leaderboard', name: 'Global Leaderboard & Rankings', category: 'Gamification', description: 'Student rankings, streak points & achievement badges', icon: BarChart2, color: '#8A5CFF' },
  { key: 'coding_lab', name: 'AI Coding Lab & Hints', category: 'Coding Tools', description: 'In-browser Monaco code editor & AI code hint generator', icon: Cpu, color: '#00E8FF' },
  { key: 'onboarding', name: 'User Onboarding Flow', category: 'User Management', description: 'Initial student intake questionnaire & profile sync', icon: Users, color: '#A855F7' },
  { key: 'role_roadmap', name: 'Role-Based Roadmap Track', category: 'EchoRoadmap', description: 'Interactive 2-column circuit flowcharts for career roles', icon: Map, color: '#F59E0B' },
  { key: 'dsa_roadmap', name: 'DSA Prep Patterns Track', category: 'EchoRoadmap', description: 'Universal topic bar & 24 algorithmic LeetCode pattern sums', icon: Map, color: '#00FF66' },
  { key: 'cs_roadmap', name: 'Core CS Fundamentals Track', category: 'EchoRoadmap', description: '3D Solar System orbiting spheres & 12-Phase OOPS syllabus', icon: Map, color: '#F43F5E' },
]

export default function AdminDashboardView({ adminEmail }: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [togglingKey, setTogglingKey] = useState<string | null>(null)
  
  // Real data state
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    totalResumesScanned: 0,
    activeRoadmapLearners: 0
  })
  const [users, setUsers] = useState<RealUser[]>([])
  const [recentInterviews, setRecentInterviews] = useState<RealInterview[]>([])
  const [systemHealth, setSystemHealth] = useState({
    dbLatencyMs: 0,
    status: 'Operational',
    apiQuotaUsed: 'Normal',
    geminiStatus: 'Operational'
  })

  // Feature Toggles state
  const [featureToggles, setFeatureToggles] = useState<Record<string, boolean>>({
    mock_interviews: true,
    ats_resume: true,
    leaderboard: true,
    coding_lab: true,
    onboarding: true,
    role_roadmap: true,
    dsa_roadmap: true,
    cs_roadmap: true,
  })

  // AI Models state (Configured with Top Recommended Models)
  const [featureModels, setFeatureModels] = useState<Record<string, string>>({
    mock_interviews: 'llama-3.3-70b-versatile',
    interview_feedback: 'deepseek-r1-distill-llama-70b',
    ats_resume: 'mixtral-8x7b-32768',
    resume_builder: 'llama-3.3-70b-versatile',
    coding_lab: 'deepseek-r1-distill-llama-70b',
    roadmap: 'llama-3.3-70b-versatile',
  })
  const [featureMetadata, setFeatureMetadata] = useState<Record<string, { name: string; category: string; description: string }> | null>(null)
  const [availableModels, setAvailableModels] = useState<Array<{ id: string; name: string; provider: string; description: string }>>([
    { id: 'llama-3.3-70b-versatile', name: 'Groq Llama 3.3 70B (Versatile)', provider: 'Groq', description: 'Best overall model for complex reasoning and interview dialogue.' },
    { id: 'llama-3.1-8b-instant', name: 'Groq Llama 3.1 8B (Instant)', provider: 'Groq', description: 'Ultra fast low latency model for instant responses.' },
    { id: 'mixtral-8x7b-32768', name: 'Groq Mixtral 8x7B (32k Context)', provider: 'Groq', description: 'Large context window for long resumes and code files.' },
    { id: 'deepseek-r1-distill-llama-70b', name: 'Groq DeepSeek R1 (70B Distill)', provider: 'Groq', description: 'Advanced reasoning model for complex code & system design.' },
    { id: 'gemini-1.5-flash', name: 'Google Gemini 1.5 Flash', provider: 'Google', description: 'Multimodal high speed Google AI model.' },
    { id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro', provider: 'Google', description: 'Deep reasoning Google AI model.' },
  ])
  const [updatingModelKey, setUpdatingModelKey] = useState<string | null>(null)

  // Multi-Select Deletion State
  const [selectedInterviewIds, setSelectedInterviewIds] = useState<string[]>([])
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [deleting, setDeleting] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean
    type: 'interview' | 'user'
    ids: string[]
    title: string
  }>({ show: false, type: 'interview', ids: [], title: '' })

  const fetchRealAdminData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setStats(data.stats)
          setUsers(data.users || [])
          setRecentInterviews(data.recentInterviews || [])
          if (data.systemHealth) setSystemHealth(data.systemHealth)
        }
      }

      const togglesRes = await fetch('/api/admin/feature-toggles')
      if (togglesRes.ok) {
        const togglesData = await togglesRes.json()
        if (togglesData.toggles) {
          setFeatureToggles(togglesData.toggles)
        }
      }

      const modelsRes = await fetch('/api/admin/ai-models')
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json()
        if (modelsData.featureModels) setFeatureModels(modelsData.featureModels)
        if (modelsData.availableModels) setAvailableModels(modelsData.availableModels)
        if (modelsData.featureMetadata) setFeatureMetadata(modelsData.featureMetadata)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error loading live admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAiModel = async (featureKey: string, modelId: string) => {
    setUpdatingModelKey(featureKey)
    try {
      const res = await fetch('/api/admin/ai-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureKey, modelId })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.featureModels) {
          setFeatureModels(data.featureModels)
        }
      }
    } catch (err) {
      console.error('Error updating AI model:', err)
    } finally {
      setUpdatingModelKey(null)
    }
  }

  useEffect(() => {
    fetchRealAdminData()
  }, [])

  const handleToggleFeature = async (key: string, currentStatus: boolean) => {
    setTogglingKey(key)
    try {
      const res = await fetch('/api/admin/feature-toggles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, isEnabled: !currentStatus })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.toggles) {
          setFeatureToggles(data.toggles)
        }
      }
    } catch (err) {
      console.error('Error toggling feature status:', err)
    } finally {
      setTogglingKey(null)
    }
  }

  // Handle Multi-Select Checkboxes for Interviews
  const toggleSelectInterview = (id: string) => {
    setSelectedInterviewIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAllInterviews = () => {
    if (selectedInterviewIds.length === recentInterviews.length) {
      setSelectedInterviewIds([])
    } else {
      setSelectedInterviewIds(recentInterviews.map(i => i.id))
    }
  }

  // Handle Multi-Select Checkboxes for Users
  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    )
  }

  const toggleSelectAllUsers = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(users.map(u => u.id))
    }
  }

  // Execute Supabase Hard Deletion
  const executeSupabaseDelete = async () => {
    if (!confirmModal.ids.length) return
    setDeleting(true)
    try {
      const res = await fetch('/api/admin/delete-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: confirmModal.type,
          ids: confirmModal.ids
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        // Remove deleted items from UI state instantly
        if (confirmModal.type === 'interview') {
          setRecentInterviews(prev => prev.filter(i => !confirmModal.ids.includes(i.id)))
          setSelectedInterviewIds([])
          setStats(prev => ({ ...prev, totalInterviews: Math.max(0, prev.totalInterviews - confirmModal.ids.length) }))
        } else if (confirmModal.type === 'user') {
          setUsers(prev => prev.filter(u => !confirmModal.ids.includes(u.id)))
          setSelectedUserIds([])
          setStats(prev => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - confirmModal.ids.length) }))
        }
      } else {
        alert(data.error || 'Failed to delete from Supabase')
      }
    } catch (err) {
      console.error('Deletion error:', err)
      alert('Error connecting to Supabase database for deletion.')
    } finally {
      setDeleting(false)
      setConfirmModal({ show: false, type: 'interview', ids: [], title: '' })
    }
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Command Center', icon: LayoutDashboard, badge: null, color: '#8A5CFF' },
    { id: 'features' as AdminTab, label: 'System Control', icon: Wrench, badge: '8 Features', color: '#F59E0B' },
    { id: 'users' as AdminTab, label: 'User Directory', icon: Users, badge: users.length ? `${users.length}` : null, color: '#42A5FF' },
    { id: 'interviews' as AdminTab, label: 'Interview Logs', icon: Video, badge: recentInterviews.length ? `${recentInterviews.length}` : null, color: '#8A5CFF' },
    { id: 'resume' as AdminTab, label: 'EchoATS Analytics', icon: FileSearch, badge: null, color: '#42A5FF' },
    { id: 'roadmap' as AdminTab, label: 'Roadmap Tracker', icon: Map, badge: null, color: '#00E8FF' },
    { id: 'system' as AdminTab, label: 'System Health', icon: Cpu, badge: 'Live', color: '#8A5CFF' },
  ]

  return (
    <div className="min-h-screen bg-[#05060B] text-white font-sans flex select-none relative">
      
      {/* 🛡️ Dedicated EchoYou Glassmorphic Admin Left Sidebar */}
      <aside className="w-64 bg-white/[0.02] backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-5 shrink-0 z-30 shadow-[0_8px_60px_rgba(0,0,0,0.6)]">
        
        <div className="space-y-6">
          {/* EchoYou Logo */}
          <div className="border-b border-white/10 pb-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full shrink-0 bg-[conic-gradient(from_0deg,#8A5CFF,#42A5FF,#00E8FF,#8A5CFF)] p-0.5 shadow-[0_0_20px_rgba(138,92,255,0.6)]">
                <div className="w-full h-full rounded-full bg-[#05060B] flex items-center justify-center">
                  <Zap size={15} className="text-[#8A5CFF]" />
                </div>
              </div>
              <div>
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-[#8A5CFF] via-[#42A5FF] to-[#00E8FF] bg-clip-text text-transparent">
                  EchoYou Admin
                </span>
                <div className="text-[10px] font-semibold text-amber-400/90 tracking-wide uppercase mt-0.5">
                  Super Control Panel
                </div>
              </div>
            </Link>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1.5 text-xs">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">
              Admin Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-medium ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/10 text-white border border-purple-500/30 shadow-[0_0_20px_rgba(138,92,255,0.2)] font-bold' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" style={{ color: isActive ? item.color : '#9CA3AF' }} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isActive ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40' : 'bg-white/10 text-zinc-400'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="bg-white/[0.03] border border-white/10 p-3 rounded-xl text-xs">
            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Super Admin</div>
            <div className="text-cyan-400 font-semibold truncate mt-0.5">{adminEmail}</div>
          </div>

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" />
            <span>Return to User Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* 🚀 Main Content View */}
      <main className="flex-1 min-h-screen overflow-y-auto bg-[#05060B] p-8 md:p-10 space-y-8 relative">
        
        {/* Background Dark Radial Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] pointer-events-none rounded-full" />

        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
              EchoYou Admin / {activeTab.toUpperCase()}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2">
              {activeTab === 'overview' && 'System Command Center'}
              {activeTab === 'features' && 'System & Feature Control (8 Components)'}
              {activeTab === 'users' && 'Student Account Directory'}
              {activeTab === 'interviews' && 'AI Mock Interview Logs'}
              {activeTab === 'resume' && 'EchoATS Resume Lab Analytics'}
              {activeTab === 'roadmap' && 'Roadmap Milestone Tracker'}
              {activeTab === 'system' && 'API Quota & System Health'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchRealAdminData}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 hover:border-cyan-500/40 text-zinc-300 hover:text-white bg-white/[0.03] transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Refresh Live Data</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        {loading ? (
          <div className="py-24 text-center space-y-4 relative z-10">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Fetching Real Database & Feature Toggle Status...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-3xl text-center space-y-2 relative z-10">
            <p className="text-sm font-bold text-rose-400">{error}</p>
            <button 
              onClick={fetchRealAdminData}
              className="px-4 py-2 bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/40"
            >
              Retry Loading Live Data
            </button>
          </div>
        ) : (
          <div className="relative z-10 space-y-8 pb-20">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-2xl shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 uppercase font-semibold tracking-wider">Registered Users</span>
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-3">{stats.totalUsers}</div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Live Clerk Auth
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-2xl shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 uppercase font-semibold tracking-wider">Mock Interviews Run</span>
                    <Video className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-3">{stats.totalInterviews}</div>
                  <div className="text-xs text-cyan-400 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Database records
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-2xl shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 uppercase font-semibold tracking-wider">ATS Resumes Scanned</span>
                    <FileSearch className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-3">{stats.totalResumesScanned}</div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Profile uploads
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-2xl shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 uppercase font-semibold tracking-wider">Active Learners</span>
                    <Map className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-3">{stats.activeRoadmapLearners}</div>
                  <div className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                    <BarChart2 className="w-3.5 h-3.5" /> Live active learners
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SYSTEM & FEATURE CONTROL (STRICTLY IN SYSTEM CONTROL TAB) */}
            {activeTab === 'features' && (
              <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-2xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-amber-400" /> System Feature Maintenance Control Panel
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Turn off any feature to enter Developer Maintenance Mode. When OFF, the feature remains <strong>100% accessible to you ({adminEmail})</strong> for making code changes, while students see an "Under Maintenance" message.
                    </p>
                  </div>

                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                    8 Sub-Components Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {FEATURE_LIST.map((feat) => {
                    const Icon = feat.icon
                    const isON = featureToggles[feat.key] ?? true
                    const isToggling = togglingKey === feat.key

                    return (
                      <div 
                        key={feat.key} 
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                          isON 
                            ? 'bg-black/40 border-white/10' 
                            : 'bg-amber-500/[0.05] border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5" style={{ color: feat.color }} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm text-white">{feat.name}</h3>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                                  {feat.category}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{feat.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Control Status Footer */}
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 font-semibold">User Status:</span>
                            {isON ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-[11px]">
                                <Check className="w-3.5 h-3.5" /> ONLINE for Students
                              </span>
                            ) : (
                              <span className="text-amber-300 font-bold flex items-center gap-1 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 text-[11px]">
                                <X className="w-3.5 h-3.5" /> Maintenance Mode (Admin Only)
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleToggleFeature(feat.key, isON)}
                            disabled={isToggling}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                              isON
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            }`}
                          >
                            {isToggling ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isON ? (
                              <>
                                <ToggleRight className="w-4 h-4 text-rose-400" />
                                <span>Turn OFF (Maintenance)</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 text-emerald-400" />
                                <span>Turn ON (Make Public)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* 🧠 AI Engine Model Configurator per Feature (STRICTLY 6 CORE FEATURES) */}
                <div className="pt-6 border-t border-white/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-cyan-400" /> AI Engine Model Selection per Feature (6 Core Features)
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Select and change the underlying AI LLM model for each core feature independently (Groq Llama 3.3 70B, DeepSeek R1 70B, Mixtral 8x7B, Gemini 1.5).
                      </p>
                    </div>

                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                      6 Core AI Features
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                    {featureMetadata ? (
                      Object.entries(featureMetadata).map(([key, meta]) => (
                        <div key={key} className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-cyan-400" /> {meta.name}
                            </span>
                            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                              {meta.category}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">{meta.description}</p>
                          
                          <div className="pt-1">
                            <select
                              value={featureModels[key] || 'llama-3.3-70b-versatile'}
                              onChange={(e) => handleUpdateAiModel(key, e.target.value)}
                              disabled={updatingModelKey === key}
                              className="w-full bg-[#06080D] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500/50"
                            >
                              {availableModels.map(m => (
                                <option key={m.id} value={m.id}>{m.provider} - {m.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: USER DIRECTORY & REGISTRATION ANALYTICS WITH BULK SELECTION */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                
                {/* 📈 Registration Stats Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/[0.03] border border-purple-500/30 p-5 rounded-2xl backdrop-blur-2xl">
                    <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Registered Students</div>
                    <div className="text-3xl font-black text-white mt-1">{users.length} Users</div>
                    <div className="text-[11px] text-purple-300 mt-1 font-mono">Live Clerk Authentication DB</div>
                  </div>

                  <div className="bg-white/[0.03] border border-emerald-500/30 p-5 rounded-2xl backdrop-blur-2xl">
                    <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Registered Today</div>
                    <div className="text-3xl font-black text-emerald-400 mt-1">
                      {users.filter(u => u.joinedDate === new Date().toISOString().split('T')[0]).length} New Users
                    </div>
                    <div className="text-[11px] text-emerald-300 mt-1 font-mono">Today's Signups</div>
                  </div>

                  <div className="bg-white/[0.03] border border-cyan-500/30 p-5 rounded-2xl backdrop-blur-2xl">
                    <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Registered This Month</div>
                    <div className="text-3xl font-black text-cyan-400 mt-1">
                      {users.length} Users
                    </div>
                    <div className="text-[11px] text-cyan-300 mt-1 font-mono">Monthly Active Growth</div>
                  </div>
                </div>

                {/* 👥 Student Directory Table with Multi-Select Bulk Actions */}
                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-2xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-400" /> Registered Student Directory ({users.length})
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">Select accounts to perform single or bulk deletion from Supabase Postgres.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Search name or email..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black/40 text-zinc-400 uppercase tracking-wider border-b border-white/10 font-semibold">
                        <tr>
                          <th className="p-3 w-10 text-center">
                            <button onClick={toggleSelectAllUsers} className="text-zinc-400 hover:text-white">
                              {selectedUserIds.length > 0 && selectedUserIds.length === users.length ? (
                                <CheckSquare className="w-4 h-4 text-purple-400" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </th>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Registration Date</th>
                          <th className="p-3">User ID</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-zinc-300">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-6 text-center text-zinc-500">
                              No matching registered users found.
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((u) => {
                            const isSelected = selectedUserIds.includes(u.id)
                            return (
                              <tr key={u.id} className={`transition-colors ${isSelected ? 'bg-purple-500/10' : 'hover:bg-white/[0.03]'}`}>
                                <td className="p-3 text-center">
                                  <button onClick={() => toggleSelectUser(u.id)} className="text-zinc-400 hover:text-white">
                                    {isSelected ? <CheckSquare className="w-4 h-4 text-purple-400" /> : <Square className="w-4 h-4" />}
                                  </button>
                                </td>
                                <td className="p-3 font-semibold text-white flex items-center gap-3">
                                  {u.imageUrl ? (
                                    <img src={u.imageUrl} alt={u.name} className="w-7 h-7 rounded-full border border-white/10" />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-500/30">
                                      {u.name.charAt(0)}
                                    </div>
                                  )}
                                  <span>{u.name}</span>
                                </td>
                                <td className="p-3 text-zinc-300 font-medium">{u.email}</td>
                                <td className="p-3">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'Super Admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'}`}>
                                    {u.role}
                                  </span>
                                </td>
                                <td className="p-3 text-zinc-400">{u.joinedDate}</td>
                                <td className="p-3 text-[10px] text-zinc-500 truncate max-w-[140px] font-mono">{u.id}</td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => setConfirmModal({
                                      show: true,
                                      type: 'user',
                                      ids: [u.id],
                                      title: `Delete user record for ${u.name} (${u.email}) permanently from Supabase Postgres?`
                                    })}
                                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all text-xs font-semibold"
                                    title="Delete from Supabase DB"
                                  >
                                    <Trash2 className="w-4 h-4 text-rose-400" />
                                  </button>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: INTERVIEW LOGS WITH BULK SELECTION & SUPABASE DELETION */}
            {activeTab === 'interviews' && (
              <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <Video className="w-5 h-5 text-cyan-400" /> Database Interview Logs ({recentInterviews.length})
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Select log entries to delete single or multiple logs from Supabase Postgres.</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {recentInterviews.length > 0 && (
                      <button 
                        onClick={toggleSelectAllInterviews}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 transition-all flex items-center gap-1.5"
                      >
                        {selectedInterviewIds.length > 0 && selectedInterviewIds.length === recentInterviews.length ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                        <span>Select All Logs</span>
                      </button>
                    )}
                    <span className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 font-semibold">
                      PostgreSQL Live Feed
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {recentInterviews.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 text-xs border border-white/10 rounded-2xl">
                      No interviews conducted yet. Create your first interview session in Command Center!
                    </div>
                  ) : (
                    recentInterviews.map((log) => {
                      const isSelected = selectedInterviewIds.includes(log.id)
                      return (
                        <div 
                          key={log.id} 
                          className={`border p-4 rounded-2xl space-y-2 transition-all ${
                            isSelected 
                              ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                              : 'bg-black/40 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button onClick={() => toggleSelectInterview(log.id)} className="text-zinc-400 hover:text-white">
                                {isSelected ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4" />}
                              </button>
                              <span className="font-bold text-sm text-white">{log.role}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs text-zinc-500">{log.date}</span>
                              <button
                                onClick={() => setConfirmModal({
                                  show: true,
                                  type: 'interview',
                                  ids: [log.id],
                                  title: `Delete interview log for ${log.role} (${log.date}) permanently from Supabase Postgres?`
                                })}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all text-xs font-semibold flex items-center gap-1"
                                title="Delete from Supabase DB"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-zinc-400 pl-7">
                            <span>Type: <strong className="text-cyan-300 capitalize">{log.type}</strong></span>
                            <span>•</span>
                            <span>Difficulty: <strong className="text-purple-300 capitalize">{log.difficulty}</strong></span>
                            <span>•</span>
                            <span>ID: <strong className="text-zinc-500 font-mono text-[10px]">{log.id}</strong></span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs pl-7">
                            <span className="text-zinc-400">Status: <strong className="text-emerald-400 capitalize">{log.status}</strong></span>
                            <span className="text-zinc-400">Score: <strong className="text-amber-400 font-bold">{log.score}/100</strong></span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: ATS RESUME LAB */}
            {activeTab === 'resume' && (
              <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-emerald-400" /> EchoATS Resume Lab Analytics
                  </h2>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">
                    Active Scanner
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-2">
                    <div className="text-zinc-400 font-medium">Total Resume Scans Conducted</div>
                    <div className="text-3xl font-black text-emerald-400">{stats.totalResumesScanned} Uploads</div>
                    <div className="text-[11px] text-zinc-500">Tracked across EchoATS scanner tool</div>
                  </div>

                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-2">
                    <div className="text-zinc-400 font-semibold text-xs">Top Missing Keywords Flagged by AI:</div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">Docker / Kubernetes</span>
                      <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">CI/CD Pipeline</span>
                      <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">Microservices</span>
                      <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">System Architecture</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ROADMAP TRACKER */}
            {activeTab === 'roadmap' && (
              <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Map className="w-5 h-5 text-amber-400" /> EchoRoadmap Learner Track Monitor
                  </h2>
                  <span className="text-xs text-amber-400 font-semibold">3 Core Universes Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-black/40 border border-cyan-500/30 p-4 rounded-2xl space-y-1">
                    <div className="text-cyan-400 font-bold uppercase text-[10px] tracking-wider">Role-Based Universe</div>
                    <div className="text-white text-base font-bold">Circuit Flowcharts</div>
                    <div className="text-zinc-500 text-[11px]">Frontend, Fullstack, AI/ML Stacks</div>
                  </div>

                  <div className="bg-black/40 border border-emerald-500/30 p-4 rounded-2xl space-y-1">
                    <div className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider">DSA Prep Universe</div>
                    <div className="text-white text-base font-bold">24 Algorithmic Patterns</div>
                    <div className="text-zinc-500 text-[11px]">Topic-based LeetCode Sums</div>
                  </div>

                  <div className="bg-black/40 border border-purple-500/30 p-4 rounded-2xl space-y-1">
                    <div className="text-purple-400 font-bold uppercase text-[10px] tracking-wider">Core CS Universe</div>
                    <div className="text-white text-base font-bold">12-Phase OOPS & CS</div>
                    <div className="text-zinc-500 text-[11px]">3D Solar System Spheres</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SYSTEM HEALTH */}
            {activeTab === 'system' && (
              <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-400" /> System Health & API Quota
                  </h2>
                  <span className="text-xs text-emerald-400 font-semibold">PostgreSQL + Clerk Live</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-1">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Database Latency</div>
                    <div className="text-emerald-400 font-bold text-sm">{systemHealth.dbLatencyMs} ms Ping</div>
                    <div className="text-zinc-400 text-[11px]">Live SQL query benchmark via Prisma</div>
                  </div>

                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-1">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Super Admin Whitelist</div>
                    <div className="text-amber-400 font-bold text-sm truncate">{adminEmail}</div>
                    <div className="text-zinc-400 text-[11px]">Server-side email protection active</div>
                  </div>

                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-1">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Gemini AI Engine</div>
                    <div className="text-cyan-400 font-bold text-sm">Operational (Groq/Gemini)</div>
                    <div className="text-zinc-400 text-[11px]">Quota Health: Normal</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 🚨 FLOATING BULK DELETION ACTION BAR FOR INTERVIEWS */}
        {selectedInterviewIds.length > 0 && activeTab === 'interviews' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0D111A]/95 border border-rose-500/40 p-4 rounded-2xl backdrop-blur-2xl shadow-[0_0_40px_rgba(244,63,94,0.3)] flex items-center gap-4 text-xs font-sans animate-in slide-in-from-bottom duration-200">
            <span className="text-white font-bold flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>{selectedInterviewIds.length} Interview Log(s) Selected</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedInterviewIds([])}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white bg-white/5 transition-all text-xs font-semibold"
              >
                Clear Selection
              </button>

              <button
                onClick={() => setConfirmModal({
                  show: true,
                  type: 'interview',
                  ids: selectedInterviewIds,
                  title: `Permanently delete ${selectedInterviewIds.length} selected interview log(s) from Supabase Postgres database?`
                })}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-xs shadow-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected ({selectedInterviewIds.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* 🚨 FLOATING BULK DELETION ACTION BAR FOR USERS */}
        {selectedUserIds.length > 0 && activeTab === 'users' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0D111A]/95 border border-rose-500/40 p-4 rounded-2xl backdrop-blur-2xl shadow-[0_0_40px_rgba(244,63,94,0.3)] flex items-center gap-4 text-xs font-sans animate-in slide-in-from-bottom duration-200">
            <span className="text-white font-bold flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-purple-400" />
              <span>{selectedUserIds.length} User Record(s) Selected</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedUserIds([])}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white bg-white/5 transition-all text-xs font-semibold"
              >
                Clear Selection
              </button>

              <button
                onClick={() => setConfirmModal({
                  show: true,
                  type: 'user',
                  ids: selectedUserIds,
                  title: `Permanently delete ${selectedUserIds.length} selected student record(s) from Supabase Postgres database?`
                })}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-xs shadow-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected ({selectedUserIds.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* ⚠️ SUPABASE HARD DELETION CONFIRMATION MODAL */}
        {confirmModal.show && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0D111A] border border-rose-500/40 p-6 rounded-3xl backdrop-blur-2xl shadow-[0_0_50px_rgba(244,63,94,0.3)] space-y-5 animate-in zoom-in-95 duration-150">
              
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-white tracking-tight">Confirm Supabase Database Deletion</h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                  {confirmModal.title}
                </p>
                <p className="text-[11px] text-rose-400 font-bold font-mono uppercase pt-1">
                  ⚠️ Warning: This action cannot be undone. Records will be hard-deleted from Supabase.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmModal({ show: false, type: 'interview', ids: [], title: '' })}
                  disabled={deleting}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white bg-white/5 transition-all text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={executeSupabaseDelete}
                  disabled={deleting}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Permanently Delete</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  )
}
