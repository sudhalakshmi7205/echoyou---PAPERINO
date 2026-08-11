'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Briefcase, Settings, Save, Loader2, Sparkles, Award, ExternalLink, ShieldCheck, Globe, Code, Camera, X, ArrowLeft } from 'lucide-react'

const DEVELOPER_AVATARS = [
  { id: 'clerk', name: 'Google Account Photo', gender: 'all', url: '' },
  
  // 👩‍💻 6 Pretty Female Developer Avatars (Including Sudha's Chibi Anime Coders!)
  { id: 'f1', name: '👩‍💻 Frontend Engineer (Chibi Jacket)', gender: 'female', url: '/avatars/female_dev_1.png' },
  { id: 'f2', name: '🧠 AI & ML Specialist (Anime Glasses)', gender: 'female', url: '/avatars/female_dev_2.png' },
  { id: 'f3', name: '💻 Fullstack Developer (Purple Hoodie)', gender: 'female', url: '/avatars/female_dev_3.png' },
  { id: 'f4', name: '⚙️ Backend Architect (Green Hoodie)', gender: 'female', url: '/avatars/female_dev_4.png' },
  { id: 'f5', name: '📊 Data Scientist (Pink Hoodie)', gender: 'female', url: '/avatars/female_dev_5.png' },
  { id: 'f6', name: '⚡ DevOps & Cloud Engineer', gender: 'female', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe&hair=long01&hairColor=362819' },
  
  // 👨‍💻 6 Handsome Male Developer Avatars (Including Sudha's Chibi Anime Coders!)
  { id: 'm1', name: '👨‍💻 Java Fullstack Lead (Matrix Hoodie)', gender: 'male', url: '/avatars/male_dev_1.png' },
  { id: 'm2', name: '🧠 Deep Learning Lead (Lock Hoodie)', gender: 'male', url: '/avatars/male_dev_2.png' },
  { id: 'm3', name: '🌐 Cloud Systems Architect (Dark Hoodie)', gender: 'male', url: '/avatars/male_dev_3.png' },
  { id: 'm4', name: '🧮 Algorithms & DSA Specialist (Orange Hoodie & Glasses)', gender: 'male', url: '/avatars/male_dev_4.png' },
  { id: 'm5', name: '🛡️ Cybersecurity Specialist (Desk Engineer)', gender: 'male', url: '/avatars/male_dev_5.png' },
  { id: 'm6', name: '🚀 Product Software Engineer', gender: 'male', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&hair=short01&hairColor=2c1b18' },
]

export default function ProfileClient({ 
  profile, 
  clerkUser, 
  preferences,
  interviewStats = { passedInterviewsCount: 0, totalInterviewsCount: 0, hasResume: false }
}: { 
  profile: any, 
  clerkUser: any, 
  preferences: any,
  interviewStats?: { passedInterviewsCount: number, totalInterviewsCount: number, hasResume: boolean }
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'achievements' | 'settings'>('personal')
  const [loading, setLoading] = useState(false)
  const [isGeneratingBio, setIsGeneratingBio] = useState(false)

  // Avatar Selection State
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile.customAvatarUrl || clerkUser.imageUrl)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [avatarGenderFilter, setAvatarGenderFilter] = useState<'all' | 'female' | 'male'>('all')

  // Filtered Avatars
  const filteredAvatars = DEVELOPER_AVATARS.filter(a => avatarGenderFilter === 'all' || a.gender === 'all' || a.gender === avatarGenderFilter)

  // Calculate Neural Badges
  const passedCount = interviewStats.passedInterviewsCount || 0
  const NEURAL_BADGES = [
    {
      id: 'novice',
      title: '🥉 Neural Novice',
      req: 'Pass 1 Interview with >50% Score',
      target: 1,
      current: Math.min(1, passedCount),
      unlocked: passedCount >= 1,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
    },
    {
      id: 'practitioner',
      title: '🥈 Neural Practitioner',
      req: 'Pass 5 Interviews with >50% Score',
      target: 5,
      current: Math.min(5, passedCount),
      unlocked: passedCount >= 5,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
    },
    {
      id: 'veteran',
      title: '🥇 Neural Veteran',
      req: 'Pass 10 Interviews with >50% Score',
      target: 10,
      current: Math.min(10, passedCount),
      unlocked: passedCount >= 10,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
    },
    {
      id: 'master_20',
      title: '👑 Neural Master (20 Passed)',
      req: 'Pass 20 Interviews with >50% Score',
      target: 20,
      current: Math.min(20, passedCount),
      unlocked: passedCount >= 20,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
    },
    {
      id: 'hr_placement',
      title: '🤝 Placement HR Certified',
      req: 'Complete 2027 Campus Placements HR Round',
      target: 1,
      current: interviewStats.totalInterviewsCount > 0 ? 1 : 0,
      unlocked: interviewStats.totalInterviewsCount >= 1,
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
    },
    {
      id: 'ats_verified',
      title: '📄 Neural ATS Verified',
      req: 'Upload & Parse ATS Compliant Resume',
      target: 1,
      current: interviewStats.hasResume ? 1 : 0,
      unlocked: interviewStats.hasResume,
      color: 'from-sky-500/20 to-cyan-500/10 border-sky-500/40 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
    }
  ]

  // Personal Info State
  const [bio, setBio] = useState(profile.aiBio || '')
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || '')
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl || '')
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl || '')

  // Professional State
  const [role, setRole] = useState(profile.role || 'Java Developer')
  const [targetTier, setTargetTier] = useState(profile.targetTier || 'Product-Based Companies')
  const [experience, setExperience] = useState(profile.experience || 'Fresher (2027 Passout)')
  const [skills, setSkills] = useState<string[]>(profile.languages?.length ? profile.languages : ['Java', 'Spring Boot', 'SQL', 'Data Structures', 'React'])
  const [newSkill, setNewSkill] = useState('')
  const [goal, setGoal] = useState(profile.goal || 'Crack Campus Placements at Top Tech Companies')

  // Settings State
  const [emailOnComplete, setEmailOnComplete] = useState(preferences.emailOnComplete ?? true)
  const [emailWeeklySummary, setEmailWeeklySummary] = useState(preferences.emailWeeklySummary ?? true)
  const [defaultDifficulty, setDefaultDifficulty] = useState(preferences.defaultDifficulty || 'medium')

  // Calculate Placement Readiness Index (0 - 100%)
  const readinessIndex = Math.min(100, (skills.length * 12) + (bio ? 20 : 0) + (role ? 20 : 0))

  const handleAutoGenerateBio = () => {
    setIsGeneratingBio(true)
    setTimeout(() => {
      setBio(`Driven ${role || 'Software Developer'} passionate about building high-performance applications. Proficient in ${skills.slice(0, 3).join(', ')} with a strong focus on ${goal || 'Problem Solving and System Design'}. Actively preparing for top-tier campus placement drives.`)
      setIsGeneratingBio(false)
    }, 800)
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          role,
          experience,
          languages: skills,
          goal,
          customAvatarUrl: selectedAvatar
        })
      })
      router.refresh()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('profileAvatarUpdated'))
      }
      alert('Profile saved successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      await fetch('/api/preferences/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOnComplete,
          emailWeeklySummary,
          defaultDifficulty
        })
      })
      router.refresh()
      alert('Settings saved successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  return (
    <div className="space-y-6">
      
      {/* 💻 DEVELOPER AVATAR SELECTION MODAL */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E131F] border-2 border-cyan-500/50 rounded-3xl p-6 max-w-xl w-full space-y-6 shadow-[0_0_80px_rgba(34,211,238,0.3)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span>💻</span> Choose Developer Avatar
                </h2>
                <p className="text-xs text-zinc-400">Select a developer profile avatar or use your Google Account photo.</p>
              </div>
              <button 
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gender Filter Tabs */}
            <div className="flex gap-2 p-1 bg-black/50 rounded-xl border border-white/10">
              <button
                onClick={() => setAvatarGenderFilter('all')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${avatarGenderFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-zinc-400 hover:text-white'}`}
              >
                All Avatars
              </button>
              <button
                onClick={() => setAvatarGenderFilter('female')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${avatarGenderFilter === 'female' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-zinc-400 hover:text-white'}`}
              >
                👩‍💻 Female Programmers
              </button>
              <button
                onClick={() => setAvatarGenderFilter('male')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${avatarGenderFilter === 'male' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-zinc-400 hover:text-white'}`}
              >
                👨‍💻 Male Programmers
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto p-1">
              {filteredAvatars.map(avatar => {
                const imgUrl = avatar.url || clerkUser.imageUrl
                const isSelected = selectedAvatar === imgUrl
                return (
                  <button
                    key={avatar.id}
                    onClick={() => {
                      setSelectedAvatar(imgUrl)
                      setIsAvatarModalOpen(false)
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105' 
                        : 'border-white/10 bg-black/40 hover:border-cyan-500/40 hover:bg-white/5'
                    }`}
                  >
                    <img src={imgUrl} alt={avatar.name} className="w-16 h-16 rounded-full border border-white/20 object-cover bg-black/40" />
                    <span className="text-[11px] font-bold text-zinc-200 text-center leading-tight">{avatar.name}</span>
                  </button>
                )
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⬅️ NAVIGATE BACK TO DASHBOARD BUTTON */}
      <div className="flex items-center justify-between pb-2">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-xs font-bold text-zinc-300 hover:text-cyan-300 transition-all group shadow-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-cyan-400" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase">Candidate Profile Hub</span>
      </div>

      {/* 🚀 CANDIDATE PASSPORT BANNER */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-900/30 via-cyan-900/20 to-black/60 border border-purple-500/30 backdrop-blur-2xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 z-10">
          <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 blur-md opacity-70 group-hover:opacity-100 animate-pulse transition-opacity" />
            <img 
              src={selectedAvatar} 
              alt="Avatar" 
              className="relative w-24 h-24 rounded-full border-2 border-cyan-400 object-cover shadow-2xl group-hover:scale-105 transition-transform" 
            />
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
              <Camera className="w-6 h-6 text-cyan-300" />
            </div>
            <span className="absolute bottom-0 right-0 bg-emerald-500 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[10px] text-black font-bold z-20">✓</span>
          </div>

          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">{clerkUser.firstName} {clerkUser.lastName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                Candidate Verified
              </span>
            </div>
            <p className="text-sm font-semibold text-purple-300">{role} &bull; <span className="text-zinc-400">{targetTier}</span></p>
            
            {/* Quick Skill Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-2">
              {skills.slice(0, 4).map(s => (
                <span key={s} className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-zinc-300">
                  {s}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="text-[10px] text-purple-400 font-bold">+{skills.length - 4} more</span>
              )}
            </div>
          </div>
        </div>

        {/* 🎯 Placement Readiness Meter */}
        <div className="z-10 bg-black/50 border border-cyan-500/30 p-4 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-md min-w-[240px]">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-zinc-800" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-cyan-400" strokeWidth="3.5" strokeDasharray={`${readinessIndex}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-xs font-black text-white">{readinessIndex}%</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Placement Readiness</span>
            <span className="text-xs text-zinc-300 font-semibold">{readinessIndex >= 80 ? '🎯 Placement Ready' : '⚡ Profile Building'}</span>
          </div>
        </div>
      </div>

      {/* 🔮 CYBER GLASS CONTAINER WITH NAVIGATION */}
      <div className="bg-[#0E131F]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 bg-black/40 border-b md:border-b-0 md:border-r border-white/10 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'personal' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <User className="w-4 h-4" /> Personal & Social
          </button>

          <button 
            onClick={() => setActiveTab('professional')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'professional' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <Briefcase className="w-4 h-4" /> Career & Tech Stack
          </button>

          <button 
            onClick={() => setActiveTab('achievements')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'achievements' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <Award className="w-4 h-4" /> 🧠 NEURAL BADGES
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings className="w-4 h-4" /> Account & Preferences
          </button>
        </div>

        {/* Dynamic Content Panel */}
        <div className="flex-1 p-6 md:p-8">
          
          {/* TAB 1: PERSONAL & SOCIAL */}
          {activeTab === 'personal' && (
            <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Personal & Social Identity</h2>
                <p className="text-xs text-zinc-400">Manage your bio and social portfolio links for interviewer verification.</p>
              </div>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">First Name</label>
                    <input type="text" value={clerkUser.firstName} disabled className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-zinc-400 text-xs cursor-not-allowed font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Last Name</label>
                    <input type="text" value={clerkUser.lastName} disabled className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-zinc-400 text-xs cursor-not-allowed font-medium" />
                  </div>
                </div>

                {/* AI Bio Generator Box */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">Candidate AI Summary (Bio)</label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateBio}
                      disabled={isGeneratingBio}
                      className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:text-cyan-300 transition-colors bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30"
                    >
                      {isGeneratingBio ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{isGeneratingBio ? 'Generating...' : '✨ Auto-Generate with AI'}</span>
                    </button>
                  </div>
                  <textarea 
                    value={bio} 
                    onChange={e => setBio(e.target.value)}
                    placeholder="Describe your technical background, projects, and career aspiration..."
                    className="w-full h-32 bg-black/50 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-3 text-white text-xs outline-none resize-none leading-relaxed transition-all"
                  />
                </div>

                {/* Social Profiles */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">Portfolio & Code Repositories</label>
                  
                  <div className="relative">
                    <Globe className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-black/50 border border-white/15 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Code className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      value={githubUrl}
                      onChange={e => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full bg-black/50 border border-white/15 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Globe className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      value={portfolioUrl}
                      onChange={e => setPortfolioUrl(e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full bg-black/50 border border-white/15 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={loading} 
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Identity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAREER & TECH STACK */}
          {activeTab === 'professional' && (
            <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Career Target & Tech Stack</h2>
                <p className="text-xs text-zinc-400">Configure your target role and skills so AI mock interviews adapt specifically to you.</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Target Role</label>
                    <input 
                      type="text" 
                      value={role} 
                      onChange={e => setRole(e.target.value)}
                      placeholder="e.g. Java Fullstack Developer"
                      className="w-full bg-black/50 border border-white/15 focus:border-purple-400 rounded-xl px-4 py-3 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Target Company Tier</label>
                    <select
                      value={targetTier}
                      onChange={e => setTargetTier(e.target.value)}
                      className="w-full bg-[#111620] border border-white/15 focus:border-purple-400 rounded-xl px-4 py-3 text-xs text-white outline-none"
                    >
                      <option value="Product-Based Companies">Product-Based (Zoho, Swiggy, Razorpay)</option>
                      <option value="MAANG / Tier-1 Tech">MAANG / Tier-1 (Google, Amazon, Meta)</option>
                      <option value="Mass Recruiters (TCS/Infosys)">Mass Recruiters (TCS, Infosys, Accenture)</option>
                      <option value="High-Growth Startups">High-Growth Startups</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Experience Level</label>
                  <input 
                    type="text" 
                    value={experience} 
                    onChange={e => setExperience(e.target.value)}
                    placeholder="e.g. Fresher (2027 Batch)"
                    className="w-full bg-black/50 border border-white/15 focus:border-purple-400 rounded-xl px-4 py-3 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Technical Skills & Languages</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map(s => (
                      <span key={s} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-200 rounded-lg text-xs font-semibold border border-purple-500/40 shadow-sm">
                        {s}
                        <button onClick={() => removeSkill(s)} className="text-purple-400 hover:text-white font-bold">&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addSkill()}
                      placeholder="Add a technology (e.g. Docker, Python) & hit Enter"
                      className="flex-1 bg-black/50 border border-white/15 focus:border-purple-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                    <button onClick={addSkill} className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider">
                      Add
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={loading} 
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Tech Stack
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NEURAL BADGES (LIVE DB MILESTONE UNLOCKS) */}
          {activeTab === 'achievements' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1 uppercase tracking-wider flex items-center gap-2">
                    <span>🧠</span> NEURAL BADGES
                  </h2>
                  <p className="text-xs text-zinc-400">Unlocked milestones and verified skill badges calculated automatically from your performance.</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400">
                  {NEURAL_BADGES.filter(b => b.unlocked).length} / {NEURAL_BADGES.length} Unlocked
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {NEURAL_BADGES.map(badge => {
                  const percent = Math.min(100, Math.round((badge.current / badge.target) * 100))
                  return (
                    <div 
                      key={badge.id}
                      className={`p-5 rounded-2xl border transition-all relative overflow-hidden bg-gradient-to-br ${
                        badge.unlocked ? badge.color : 'from-black/60 to-black/40 border-white/10 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                            {badge.title}
                          </h3>
                          <p className="text-xs text-zinc-300/90 font-medium">{badge.req}</p>
                        </div>
                        {badge.unlocked ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                            UNLOCKED ✓
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            🔒 LOCKED ({badge.current}/{badge.target})
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
                          <span>Milestone Progress</span>
                          <span className={badge.unlocked ? 'text-emerald-400' : 'text-cyan-400'}>{percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              badge.unlocked ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Account & Preferences</h2>
                <p className="text-xs text-zinc-400">Configure email notifications and default interview difficulty.</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-black/50 border border-white/10 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-all">
                  <div>
                    <div className="text-white text-xs font-bold mb-0.5">Email Evaluation Reports</div>
                    <div className="text-[11px] text-zinc-400">Receive detailed PDF report via email after each interview session.</div>
                  </div>
                  <input type="checkbox" checked={emailOnComplete} onChange={e => setEmailOnComplete(e.target.checked)} className="w-5 h-5 accent-emerald-500" />
                </label>

                <label className="flex items-center justify-between p-4 bg-black/50 border border-white/10 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-all">
                  <div>
                    <div className="text-white text-xs font-bold mb-0.5">Weekly Progress Summary</div>
                    <div className="text-[11px] text-zinc-400">Receive weekly performance stats and weakness analysis.</div>
                  </div>
                  <input type="checkbox" checked={emailWeeklySummary} onChange={e => setEmailWeeklySummary(e.target.checked)} className="w-5 h-5 accent-emerald-500" />
                </label>

                <div className="p-4 bg-black/50 border border-white/10 rounded-2xl">
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Default Interview Difficulty</label>
                  <select 
                    value={defaultDifficulty}
                    onChange={e => setDefaultDifficulty(e.target.value)}
                    className="w-full bg-[#111620] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="easy">Easy (Encouraging with Hints)</option>
                    <option value="medium">Medium (Standard Placement Level)</option>
                    <option value="hard">Hard (Strict FAANG / Product-Based Level)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={handleSaveSettings} 
                    disabled={loading} 
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

