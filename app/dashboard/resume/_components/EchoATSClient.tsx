'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Loader2,
  UploadCloud,
  Zap,
  FileText,
  Search,
  ChevronDown,
  Briefcase
} from 'lucide-react'
import { runATSAnalysis, deleteATSAnalysis, getAISuggestionsUpdate, saveAIUpdatedResume } from '../ats-analyzer/actions'
import LatestScanCard from './LatestScanCard'
import MatchRateHero from './MatchRateHero'
import SearchabilitySection from './SearchabilitySection'
import HardSkillsTable from './HardSkillsTable'
import SoftSkillsTable from './SoftSkillsTable'
import RecruiterTips from './RecruiterTips'
import PredictedSkills from './PredictedSkills'

import ATSHistory from './ATSHistory'
import type { ATSBulletAnalysis } from '@/lib/ai/ats-analyzer'

// ─── 40+ Common Software & IT Roles ───
const SOFTWARE_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'React Developer',
  'Angular Developer',
  'Vue.js Developer',
  'Node.js Developer',
  'Python Developer',
  'Java Developer',
  '.NET Developer',
  'Go Developer',
  'Rust Developer',
  'PHP Developer',
  'Ruby on Rails Developer',
  'iOS Developer (Swift)',
  'Android Developer (Kotlin)',
  'Flutter / React Native Developer',
  'DevOps Engineer',
  'Cloud Engineer (AWS/Azure/GCP)',
  'Site Reliability Engineer (SRE)',
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI / ML Research Engineer',
  'Data Analyst',
  'Business Intelligence Analyst',
  'Database Administrator (DBA)',
  'Cybersecurity Engineer',
  'Security Analyst',
  'Network Engineer',
  'Systems Administrator',
  'QA Engineer / SDET',
  'Automation Test Engineer',
  'Embedded Systems Engineer',
  'Firmware Engineer',
  'Blockchain Developer',
  'Game Developer',
  'UI/UX Designer',
  'Product Manager (Tech)',
  'Technical Program Manager',
  'Scrum Master / Agile Coach',
  'Solutions Architect',
  'Enterprise Architect',
  'Technical Writer',
  'IT Support Engineer',
  'IT Project Manager',
  'ERP Consultant (SAP/Oracle)',
  'Salesforce Developer',
  'ServiceNow Developer',
  'Power Platform Developer',
]

interface Resume {
  id: string
  fileName: string
  skills: string[]
  aiSummary: string | null
}

interface ATSHistoryItem {
  id: string
  resumeId: string
  targetRole: string
  jobDescription: string
  matchScore: number
  formatScore: number
  keywordScore: number
  missingKeywords: string[]
  feedback: any
  createdAt: Date
}

export default function EchoATSClient({
  resumes: initialResumes,
  history: initialHistory,
  clerkId,
  todayScansCount = 0
}: {
  resumes: Resume[]
  history: ATSHistoryItem[]
  clerkId: string
  todayScansCount?: number
}) {
  const [resumes, setResumes] = useState<Resume[]>(initialResumes)
  const [history, setHistory] = useState<ATSHistoryItem[]>(initialHistory)
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id || '')
  const [targetRole, setTargetRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [jdMode, setJdMode] = useState<'paste' | 'role'>('paste')
  const [localDailyCount, setLocalDailyCount] = useState(todayScansCount)
  const [roleSearchQuery, setRoleSearchQuery] = useState('')
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)

  // Selected Analysis details
  const [activeAnalysis, setActiveAnalysis] = useState<ATSHistoryItem | null>(
    history[0] || null
  )
  const [showReport, setShowReport] = useState(!!history[0])

  // Loading States
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  // AI Suggestions Modal State
  const [aiSuggestions, setAiSuggestions] = useState<{
    improvedBio: string
    addedSkills: string[]
  } | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const reportRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Deterministic date formatter to prevent SSR/Client hydration mismatch
  const formatDate = (dateInput: Date | string) => {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) return ''
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }

  const getScoreLevel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 50) return 'Good'
    return 'Needs Improvement'
  }

  // Filtered roles for searchable dropdown
  const filteredRoles = SOFTWARE_ROLES.filter(role =>
    role.toLowerCase().includes(roleSearchQuery.toLowerCase())
  )

  // ─── File Upload ───
  async function handleFileUpload(file: File) {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.')
      return
    }

    setIsUploading(true)
    setProgress(15)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('clerkId', clerkId)

      const timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90))
      }, 300)

      const res = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData
      })
      clearInterval(timer)

      if (!res.ok) throw new Error('Upload failed')
      setProgress(100)

      // Fetch latest list of resumes
      const updatedResumesRes = await fetch(`/api/resume/list?clerkId=${clerkId}`)
      if (updatedResumesRes.ok) {
        const list = await updatedResumesRes.json()
        setResumes(list)
        if (list.length > 0) setSelectedResumeId(list[0].id)
      }

      setTimeout(() => {
        setIsUploading(false)
      }, 500)
    } catch (err) {
      console.error(err)
      alert('Error uploading resume')
      setIsUploading(false)
    }
  }

  // ─── Analyze Handler ───
  async function handleAnalyze() {
    if (!selectedResumeId) {
      alert('Please upload a PDF resume first.')
      return
    }

    if (localDailyCount >= 2) {
      alert('Daily scan quota limit reached (2/2 scans used today). Please try again tomorrow at midnight!')
      return
    }

    // Determine the effective JD
    const effectiveJD = jdMode === 'paste' ? jdText : ''
    const effectiveRole = jdMode === 'role' ? targetRole : targetRole

    setIsAnalyzing(true)
    try {
      const analysis = await runATSAnalysis(selectedResumeId, effectiveRole, effectiveJD)
      const updatedHistory = [analysis as any, ...history]
      setHistory(updatedHistory)
      setActiveAnalysis(analysis as any)
      setLocalDailyCount(prev => prev + 1)
      setShowReport(true)
      // Scroll to report
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // ─── Delete Scan ───
  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this scan?')) return

    try {
      await deleteATSAnalysis(id)
      const updated = history.filter((x) => x.id !== id)
      setHistory(updated)
      if (activeAnalysis?.id === id) {
        setActiveAnalysis(updated[0] || null)
        if (!updated[0]) setShowReport(false)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to delete scan.')
    }
  }

  // ─── AI Suggestions ───
  async function fetchAISuggestions() {
    if (!activeAnalysis) return
    setLoadingSuggestions(true)
    try {
      const suggestions = await getAISuggestionsUpdate(
        activeAnalysis.resumeId,
        activeAnalysis.id
      )
      setAiSuggestions(suggestions)
    } catch (err) {
      console.error(err)
      alert('Could not fetch suggestions.')
    } finally {
      setLoadingSuggestions(false)
    }
  }

  async function handleApplySuggestions() {
    if (!aiSuggestions || !activeAnalysis) return
    setIsApplying(true)
    try {
      await saveAIUpdatedResume(
        activeAnalysis.resumeId,
        aiSuggestions.improvedBio,
        aiSuggestions.addedSkills
      )
      alert('AI suggestions successfully applied to your resume!')
      setAiSuggestions(null)
      const updatedResumesRes = await fetch(`/api/resume/list?clerkId=${clerkId}`)
      if (updatedResumesRes.ok) {
        const list = await updatedResumesRes.json()
        setResumes(list)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to apply suggestions.')
    } finally {
      setIsApplying(false)
    }
  }

  const handlePrint = () => window.print()

  // ─── Helper: derive quick status booleans from analysis feedback ───
  function deriveStatusFlags(analysis: ATSHistoryItem) {
    const fb = analysis.feedback || {}
    const formatIssues = fb.formatIssues || []
    const formatPassCount = formatIssues.filter((f: any) => f.passed).length
    const searchabilityPassed = formatPassCount >= Math.ceil(formatIssues.length * 0.6)
    const formattingPassed = (fb.categories?.formatScore || analysis.formatScore || 70) >= 60
    const skillsMatchPassed = (fb.categories?.hardSkillsScore || analysis.keywordScore || 50) >= 60
    const recruiterTipsPassed = (analysis.matchScore || 50) >= 60
    return { searchabilityPassed, formattingPassed, skillsMatchPassed, recruiterTipsPassed }
  }

  return (
    <div className="space-y-6">

      {/* ═══ PRINT ONLY LAYOUT ═══ */}
      {activeAnalysis && (
        <div className="hidden print:block bg-white text-black p-10 font-sans min-h-screen">
          <div className="border-b border-gray-300 pb-4 mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight">EchoATS Report</h1>
            <p className="text-sm text-gray-500 mt-1">Targeting: {activeAnalysis.targetRole} · {formatDate(activeAnalysis.createdAt)}</p>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-8 text-center">
            <div className="border border-gray-300 p-4 rounded-xl">
              <span className="text-xs uppercase text-gray-500 font-semibold block">Overall Match</span>
              <span className="text-3xl font-bold text-black mt-1 block">{activeAnalysis.matchScore}%</span>
            </div>
            <div className="border border-gray-300 p-4 rounded-xl">
              <span className="text-xs uppercase text-gray-500 font-semibold block">Format Score</span>
              <span className="text-3xl font-bold text-black mt-1 block">{activeAnalysis.formatScore}%</span>
            </div>
            <div className="border border-gray-300 p-4 rounded-xl">
              <span className="text-xs uppercase text-gray-500 font-semibold block">Keyword Score</span>
              <span className="text-3xl font-bold text-black mt-1 block">{activeAnalysis.keywordScore}%</span>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Missing Keywords</h2>
              <p className="text-sm text-gray-700">{activeAnalysis.missingKeywords?.join(', ') || 'None'}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Strengths</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {activeAnalysis.feedback?.strengths?.map((x: string, i: number) => <li key={i}>{x}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Actionable Suggestions</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {activeAnalysis.feedback?.actionableSteps?.map((x: string, i: number) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ═══ LATEST RESUME SCAN CARD ═══ */}
      {activeAnalysis && !showReport && (() => {
        const flags = deriveStatusFlags(activeAnalysis)
        return (
          <div className="print:hidden">
            <LatestScanCard
              score={activeAnalysis.matchScore}
              targetRole={activeAnalysis.targetRole || 'Target Position'}
              companyName={activeAnalysis.feedback?.parsedJD?.company}
              searchabilityPassed={flags.searchabilityPassed}
              formattingPassed={flags.formattingPassed}
              skillsMatchPassed={flags.skillsMatchPassed}
              recruiterTipsPassed={flags.recruiterTipsPassed}
              onViewReport={() => {
                setShowReport(true)
                setTimeout(() => {
                  reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }, 100)
              }}
            />
          </div>
        )
      })()}

      {/* ═══ NEW SCAN — JOBSCAN-STYLE TWO PANEL UPLOAD ═══ */}
      <div className="print:hidden">
        <div className="bg-[#0f2b26] border border-[#2dd4bf]/20 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(45,212,191,0.12)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2dd4bf]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#0f766e]/12 rounded-full blur-[120px] pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#2dd4bf]" />
                New Scan
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Upload your resume and provide a job description to get your ATS match score.</p>
            </div>

            {/* Daily Quota Badge */}
            <div className={`px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold flex items-center gap-2 ${
              localDailyCount >= 2
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-[#2dd4bf]/10 border-[#2dd4bf]/30 text-[#2dd4bf]'
            }`}>
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Available scans: {2 - localDailyCount}</span>
            </div>
          </div>

          {/* ─── Two Panel Layout ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">

            {/* LEFT PANEL: Upload a Resume */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#2dd4bf] flex items-center justify-center text-black font-black text-xs">1</div>
                <h4 className="text-sm font-bold text-white">Upload a resume</h4>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0]
                  if (file) handleFileUpload(file)
                }}
                onDragOver={(e) => e.preventDefault()}
                className="flex-1 min-h-[220px] border-2 border-dashed border-[#2dd4bf]/25 hover:border-[#2dd4bf]/50 bg-[#0a2420] hover:bg-[#112e29] rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#2dd4bf]/12 border border-[#2dd4bf]/25 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(45,212,191,0.15)]">
                  <UploadCloud className="w-7 h-7 text-[#2dd4bf]" />
                </div>

                {selectedResumeId && resumes.find(r => r.id === selectedResumeId) ? (
                  <div className="text-center">
                    <p className="text-sm font-bold text-white flex items-center gap-2 justify-center">
                      📄 {resumes.find(r => r.id === selectedResumeId)?.fileName}
                    </p>
                    <span className="text-[10px] font-mono bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/30 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">✓ Uploaded & Ready</span>
                    <p className="text-xs text-zinc-500 mt-1.5">Click to change or drop another file</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-white">
                      Drag & Drop or <span className="font-bold text-[#2dd4bf]">Upload Your Resume</span>
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">as .pdf or .docx file, or use a Saved Resume</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                />
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="p-3 rounded-xl bg-[#0a1a18] border border-[#0f766e]/20 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Uploading & Parsing Resume...</span>
                    <span className="text-[#2dd4bf] font-mono">{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#0f766e] to-[#2dd4bf] transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {/* Saved Resumes Selector */}
              {resumes.length > 1 && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1 block">or use a Saved Resume</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full bg-[#0a2420] border border-[#2dd4bf]/15 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2dd4bf]/50 transition-colors appearance-none"
                  >
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>{r.fileName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* RIGHT PANEL: Job Description / Role Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#2dd4bf] flex items-center justify-center text-black font-black text-xs">2</div>
                <h4 className="text-sm font-bold text-white">Paste a job description</h4>
              </div>

              {/* Toggle: Paste JD / Choose Role */}
              <div className="flex rounded-xl overflow-hidden border border-[#2dd4bf]/20 bg-[#0a2420]">
                <button
                  onClick={() => setJdMode('paste')}
                  className={`flex-1 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    jdMode === 'paste'
                      ? 'bg-[#2dd4bf]/15 text-[#2dd4bf] border-b-2 border-[#2dd4bf]'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Paste JD
                </button>
                <button
                  onClick={() => setJdMode('role')}
                  className={`flex-1 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    jdMode === 'role'
                      ? 'bg-[#2dd4bf]/15 text-[#2dd4bf] border-b-2 border-[#2dd4bf]'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Choose Role
                </button>
              </div>

              {/* Mode A: Paste JD */}
              {jdMode === 'paste' && (
                <div className="space-y-3">
                  <textarea
                    rows={8}
                    placeholder="Copy and paste job description here. Aim to exclude: Benefits, Perks, and Legal Disclaimers"
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    className="w-full bg-[#0a2420] border border-[#2dd4bf]/15 focus:border-[#2dd4bf]/50 rounded-xl p-4 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none resize-none transition-all min-h-[180px]"
                  />
                  {/* Optional Target Role */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1 block">Target Job Title <span className="text-zinc-600 lowercase">(optional)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Full Stack Developer"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full bg-[#0a2420] border border-[#2dd4bf]/15 focus:border-[#2dd4bf]/50 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Mode B: Choose Role */}
              {jdMode === 'role' && (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-400">
                    Don&apos;t have a JD? Select a common software role and we&apos;ll evaluate your resume against industry standards for that position.
                  </p>

                  {/* Searchable Role Dropdown */}
                  <div className="relative">
                    <div
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      className="w-full bg-[#0a2420] border border-[#2dd4bf]/20 hover:border-[#2dd4bf]/50 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <span className={`text-xs ${targetRole ? 'text-white font-medium' : 'text-zinc-500'}`}>
                        {targetRole || 'Select a role...'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showRoleDropdown && (
                      <div className="absolute top-full mt-1 left-0 right-0 bg-[#0f2b26] border border-[#2dd4bf]/25 rounded-xl shadow-2xl shadow-[#0f766e]/20 z-50 max-h-[280px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        {/* Search */}
                        <div className="sticky top-0 bg-[#0f2b26] border-b border-[#2dd4bf]/15 p-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                            <input
                              type="text"
                              value={roleSearchQuery}
                              onChange={(e) => setRoleSearchQuery(e.target.value)}
                              placeholder="Search roles..."
                              autoFocus
                              className="w-full bg-[#0a2420] border border-[#2dd4bf]/15 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#2dd4bf]/40"
                            />
                          </div>
                        </div>
                        {/* Role List */}
                        <div className="overflow-y-auto max-h-[220px] p-1">
                          {filteredRoles.map((role) => (
                            <button
                              key={role}
                              onClick={() => {
                                setTargetRole(role)
                                setShowRoleDropdown(false)
                                setRoleSearchQuery('')
                              }}
                              className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all cursor-pointer ${
                                targetRole === role
                                  ? 'bg-[#2dd4bf]/15 text-[#2dd4bf] font-bold'
                                  : 'text-zinc-300 hover:bg-[#2dd4bf]/10 hover:text-white'
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                          {filteredRoles.length === 0 && (
                            <p className="text-xs text-zinc-500 text-center py-4">No roles found</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Role Preview */}
                  {targetRole && jdMode === 'role' && (
                    <div className="p-3 rounded-xl bg-[#2dd4bf]/10 border border-[#2dd4bf]/25">
                      <p className="text-xs text-[#2dd4bf] font-bold flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5" />
                        Selected: {targetRole}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Your resume will be analyzed against common {targetRole} requirements.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─── Bottom Bar: Scan Button ─── */}
          <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-[#2dd4bf]/15 relative z-10">
            {localDailyCount >= 2 ? (
              <p className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl flex-1 text-center">
                ⚠️ Daily scan limit reached (2/2). Resetting tomorrow at midnight!
              </p>
            ) : (
              <div className="flex-1" />
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedResumeId || localDailyCount >= 2}
              className="px-8 py-3.5 bg-gradient-to-r from-[#0f766e] to-[#2dd4bf] hover:from-[#0f766e]/90 hover:to-[#2dd4bf]/90 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(45,212,191,0.25)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer flex-shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Scan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ HISTORY SIDEBAR (below upload on mobile, side on desktop) ═══ */}
      {history.length > 0 && (
        <div className="print:hidden">
          <ATSHistory
            history={history}
            activeId={activeAnalysis?.id}
            onSelectScan={(scan) => {
              setActiveAnalysis(scan)
              setShowReport(true)
              setTimeout(() => {
                reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 100)
            }}
            onDeleteScan={(id, e) => handleDelete(id, e)}
            resumes={resumes}
          />
        </div>
      )}

      {/* ═══ FULL MATCH REPORT — Jobscan Section Order ═══ */}
      {activeAnalysis && showReport && (() => {
        const feedback = activeAnalysis.feedback || {}

        // Category scores
        const categories = feedback.categories || {
          hardSkillsScore: activeAnalysis.keywordScore || 75,
          jobTitleScore: 75,
          softSkillsScore: 80,
          experienceScore: 75,
          formatScore: activeAnalysis.formatScore || 85
        }

        // Keywords
        const keywords = feedback.keywords || {
          matchedKeywords: feedback.matchingKeywords || [],
          criticalMissing: activeAnalysis.missingKeywords || [],
          niceToHaveMissing: [],
          partialKeywords: [],
          lowPriorityKeywords: [],
          missingKeywords: activeAnalysis.missingKeywords || []
        }

        // Skills Gap
        const skillsGap = feedback.skillsGap || {
          hardSkillsMissing: activeAnalysis.missingKeywords || [],
          softSkillsMissing: [],
          hardSkillsMatched: feedback.matchingKeywords || [],
          softSkillsMatched: []
        }

        // Format
        const formatIssues = feedback.formatIssues || []
        const bulletAnalysis = feedback.bulletAnalysis || []
        const locationSuggestions = feedback.locationSuggestions || []
        const parsedJD = feedback.parsedJD || {}

        // Previous scan comparison
        const previousScan = history.find(h => h.id !== activeAnalysis.id && (h.targetRole === activeAnalysis.targetRole || h.jobDescription === activeAnalysis.jobDescription))
        const prevScore = previousScan ? previousScan.matchScore : null
        const statusLevel = feedback.statusLevel || getScoreLevel(activeAnalysis.matchScore)
        const matchBand = feedback.matchBand || `${activeAnalysis.matchScore}% — ${statusLevel} Match`

        // Status flags
        const flags = deriveStatusFlags(activeAnalysis)

        return (
          <div ref={reportRef} className="space-y-8 print:hidden">

            {/* ① Match Rate Hero */}
            <MatchRateHero
              score={activeAnalysis.matchScore}
              matchBand={matchBand}
              statusLevel={statusLevel}
              explanation={feedback.scoreExplanation || `Your resume achieved a ${activeAnalysis.matchScore}% match rate.`}
              disclaimer="This is a guidance estimate — actual ATS behavior varies by company."
              resumeName={resumes.find(r => r.id === activeAnalysis.resumeId)?.fileName || 'Resume'}
              targetRole={activeAnalysis.targetRole || 'Target Position'}
              companyName={parsedJD.company}
              dateAnalyzed={formatDate(activeAnalysis.createdAt)}
              prevScore={prevScore}
              searchabilityPassed={flags.searchabilityPassed}
              formattingPassed={flags.formattingPassed}
              hardSkillsPassed={flags.skillsMatchPassed}
              softSkillsPassed={(categories.softSkillsScore || 60) >= 60}
              recruiterTipsPassed={flags.recruiterTipsPassed}
              onScanAgain={() => {
                setShowReport(false)
                setActiveAnalysis(null)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />

            {/* ② Searchability */}
            <SearchabilitySection
              formatIssues={formatIssues}
            />

            {/* ③ Hard Skills Table */}
            <HardSkillsTable
              matchedKeywords={keywords.matchedKeywords || skillsGap.hardSkillsMatched || []}
              criticalMissing={keywords.criticalMissing || skillsGap.hardSkillsMissing || []}
              niceToHaveMissing={keywords.niceToHaveMissing || []}
              partialKeywords={keywords.partialKeywords || []}
            />

            {/* ④ Soft Skills Table */}
            <SoftSkillsTable
              matchedSoftSkills={skillsGap.softSkillsMatched || []}
              missingSoftSkills={skillsGap.softSkillsMissing || []}
            />

            {/* ⑤ Recruiter Tips */}
            <RecruiterTips
              targetRole={activeAnalysis.targetRole || ''}
              resumeText={feedback.resumeText || ''}
              strengths={feedback.strengths || []}
              weaknesses={feedback.weaknesses || feedback.actionableSteps || []}
              locationSuggestions={locationSuggestions}
              formatIssues={formatIssues}
            />

            {/* ⑥ Predicted Skills */}
            <PredictedSkills
              preferredSkills={parsedJD.preferredSkills || []}
              technologies={parsedJD.technologies || []}
              tools={parsedJD.tools || []}
              alreadyMatched={[...(keywords.matchedKeywords || []), ...(skillsGap.hardSkillsMatched || [])]}
            />


          </div>
        )
      })()}
    </div>
  )
}
