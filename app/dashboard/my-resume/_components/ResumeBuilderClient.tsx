'use client'

import { useState } from 'react'
import {
  Download, Layout, Plus, Trash2, ChevronDown, ChevronUp,
  FileText, Sparkles, Check, FileCode, Loader2,
  Lightbulb, Zap, Award, Briefcase, UploadCloud,
  Code2, GraduationCap, User, Eye, ChevronRight, ChevronLeft
} from 'lucide-react'
import { ResumeData } from './types'
import Template1 from './templates/Template1'
import Template2 from './templates/Template2'
import Template3 from './templates/Template3'
import Template4 from './templates/Template4'
import Template5 from './templates/Template5'
import WriteWithAIButton from './WriteWithAIButton'

/* ──────────────────── TEMPLATE META ──────────────────── */
const TEMPLATES = [
  { id: 1, name: 'Classic Blue',   accent: '#1e3a8a',  desc: 'Navy blue accents, clean corporate layout' },
  { id: 2, name: 'Emerald Green',  accent: '#047857',  desc: 'Emerald green highlights, minimal modern layout' },
  { id: 3, name: 'Royal Purple',   accent: '#7c3aed',  desc: 'Purple accents matching brand, premium look' },
  { id: 4, name: 'Crimson Red',    accent: '#b91c1c',  desc: 'Deep red accent color, strong professional contrast' },
  { id: 5, name: 'Slate Gray',     accent: '#475569',  desc: 'Slate gray accents, executive styling' },
]

/* ──────────────────── STEP DEFINITIONS ──────────────────── */
const STEPS = [
  { key: 'template',      label: 'Template',          icon: Layout },
  { key: 'personal',      label: 'Personal Info',     icon: User },
  { key: 'summary',       label: 'Summary',           icon: FileText },
  { key: 'education',     label: 'Education',         icon: GraduationCap },
  { key: 'skills',        label: 'Skills',            icon: Code2 },
  { key: 'experience',    label: 'Experience',        icon: Briefcase },
  { key: 'projects',      label: 'Projects',          icon: Lightbulb },
  { key: 'certifications',label: 'Certifications',    icon: Award },
  { key: 'achievements',  label: 'Achievements',      icon: Zap },
  { key: 'preview',       label: 'Final Preview',     icon: Eye },
]

interface SuggestedSkills {
  languages: string[]
  frameworks: string[]
  databases: string[]
  tools: string[]
  softSkills: string[]
}

export default function ResumeBuilderClient({ initialData }: { initialData: any }) {
  /* ── Resume Data State ── */
  const [data, setData] = useState<ResumeData>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: '',
    location: '',
    role: initialData.role || '',
    githubUrl: initialData.githubUrl || '',
    linkedinUrl: initialData.linkedinUrl || '',
    portfolioUrl: initialData.portfolioUrl || '',
    aiBio: initialData.aiBio || '',
    experience: initialData.companies?.map((c: string) => ({
      title: initialData.role,
      company: c,
      date: '2020 - Present',
      description: 'Worked on building scalable applications and maintaining core infrastructure.'
    })) || [],
    education: [
      { degree: 'Bachelor of Technology', school: 'University Name', date: '2019 - 2023' }
    ],
    projects: [],
    certifications: [],
    achievements: [],
    languages: initialData.languages || [],
    coreSkills: [],
    frameworks: [],
    tools: [],
    languagesKnown: ''
  })

  /* ── UI State ── */
  const [activeTemplate, setActiveTemplate] = useState(1)
  const [currentStep, setCurrentStep] = useState(0)

  /* ── JD Skills Extractor State ── */
  const [jdText, setJdText] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [suggestedSkills, setSuggestedSkills] = useState<SuggestedSkills | null>(null)

  /* ── Helpers ── */
  const handlePrint = () => window.print()

  const handleExportWord = () => {
    // Generate clean doc layout for MS Word import
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Resume</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.4; padding: 20px; font-size: 11pt; }
          h1 { text-align: center; font-size: 18pt; margin-bottom: 5px; }
          .header-sub { text-align: center; font-size: 10pt; color: #555; margin-bottom: 20px; }
          h2 { font-size: 12pt; border-bottom: 2px solid #333; padding-bottom: 3px; margin-top: 20px; margin-bottom: 10px; text-transform: uppercase; }
          .flex-row { display: flex; justify-content: space-between; font-weight: bold; }
          .school { font-style: italic; color: #555; }
          ul { margin-top: 5px; margin-bottom: 10px; padding-left: 20px; }
          li { text-align: justify; margin-bottom: 3px; }
        </style>
      </head>
      <body>
        <h1>${data.firstName} ${data.lastName}</h1>
        <div class="header-sub">
          ${[data.email, data.phone, data.location].filter(Boolean).join(' | ')}
          <br>
          ${[data.linkedinUrl, data.githubUrl, data.portfolioUrl].filter(Boolean).join(' | ')}
        </div>
        
        ${data.aiBio ? `<h2>Professional Summary</h2><p>${data.aiBio}</p>` : ''}
        
        ${data.education?.length > 0 ? `
          <h2>Education</h2>
          ${data.education.map(edu => `
            <div class="flex-row">
              <span>${edu.degree}</span>
              <span>${edu.date}</span>
            </div>
            <div class="school">${edu.school}</div>
          `).join('')}
        ` : ''}

        <h2>Skills</h2>
        <ul>
          ${data.languages?.length > 0 ? `<li><strong>Technical Skills:</strong> ${data.languages.join(', ')}</li>` : ''}
          ${data.frameworks?.length > 0 ? `<li><strong>Frameworks:</strong> ${data.frameworks.join(', ')}</li>` : ''}
          ${data.tools?.length > 0 ? `<li><strong>Tools:</strong> ${data.tools.join(', ')}</li>` : ''}
          ${data.coreSkills?.length > 0 ? `<li><strong>Soft Skills:</strong> ${data.coreSkills.join(', ')}</li>` : ''}
        </ul>

        ${data.experience?.length > 0 ? `
          <h2>Experience</h2>
          ${data.experience.map(exp => `
            <div class="flex-row">
              <span>${exp.title} — ${exp.company}</span>
              <span>${exp.date}</span>
            </div>
            <ul>
              ${exp.description.split('\n').filter(Boolean).map(bullet => `<li>${bullet.replace(/^-\s*/, '')}</li>`).join('')}
            </ul>
          `).join('')}
        ` : ''}

        ${data.projects?.length > 0 ? `
          <h2>Projects</h2>
          ${data.projects.map(proj => `
            <div><strong>${proj.name}</strong> ${proj.tech ? `| Tech Stack: ${proj.tech}` : ''}</div>
            <ul>
              ${proj.description.split('\n').filter(Boolean).map(bullet => `<li>${bullet.replace(/^-\s*/, '')}</li>`).join('')}
            </ul>
          `).join('')}
        ` : ''}

        ${data.languagesKnown ? `<h2>Languages Known</h2><p>${data.languagesKnown}</p>` : ''}
      </body>
      </html>
    `
    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.firstName}_${data.lastName}_Resume.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const goNext = () => setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
  const goBack = () => setCurrentStep(s => Math.max(s - 1, 0))

  /* ── AI JD Skills Extraction ── */
  const handleExtractSkills = async () => {
    if (!jdText.trim()) return
    setIsExtracting(true)
    try {
      const res = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: jdText,
          type: 'extract-skills'
        })
      })
      const result = await res.json()
      if (result.result) {
        const parsed = JSON.parse(result.result)
        setSuggestedSkills(parsed)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to extract skills. Please make sure the Job Description is valid.")
    } finally {
      setIsExtracting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setJdText(event.target?.result as string)
        }
        reader.readAsText(file)
      } else {
        // Mock extract text from PDF/DOCX
        setJdText(`Job requirements for ${file.name.replace(/\.[^/.]+$/, "")}: Need React, TypeScript, Node.js, Java Spring Boot, Hibernate, JUnit, PostgreSQL, Git, VS Code, Agile methodology, Teamwork.`);
      }
    }
  }

  const handleAddSkill = (skill: string, category: 'languages' | 'frameworks' | 'tools' | 'coreSkills') => {
    const currentList = data[category] || []
    if (!currentList.includes(skill)) {
      setData({
        ...data,
        [category]: [...currentList, skill]
      })
    }
  }

  const handleRemoveSkill = (skill: string, category: 'languages' | 'frameworks' | 'tools' | 'coreSkills') => {
    const currentList = data[category] || []
    setData({
      ...data,
      [category]: currentList.filter(s => s !== skill)
    })
  }

  /* ── Input Classes ── */
  const inputCls = 'w-full bg-[#0D1117] border border-gray-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all'
  const sectionCardCls = 'bg-[#111620]/80 border border-white/[0.06] rounded-2xl backdrop-blur-sm'

  /* ──────────────── RENDER STEP CONTENT ──────────────── */
  const renderStep = () => {
    const stepKey = STEPS[currentStep].key

    /* ── TEMPLATE SELECTION ── */
    if (stepKey === 'template') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Choose a Template</h2>
            <p className="text-sm text-gray-400">Pick a professional ATS-friendly design. You can switch anytime.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                className={`group relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                  activeTemplate === t.id
                    ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(138,92,255,0.15)]'
                    : 'border-gray-700/50 bg-[#111620] hover:border-gray-600'
                }`}
              >
                {activeTemplate === t.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className="w-full h-24 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: t.accent + '18', borderLeft: `4px solid ${t.accent}` }}>
                  <span className="text-3xl font-bold opacity-20" style={{ color: t.accent }}>{t.id}</span>
                </div>
                <h3 className="font-bold text-white">{t.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )
    }

    /* ── PERSONAL INFO ── */
    if (stepKey === 'personal') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Personal Information</h2>
            <p className="text-sm text-gray-400">Basic details shown at the top of your resume.</p>
          </div>
          <div className={`${sectionCardCls} p-5 space-y-4`}>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name *" value={data.firstName} onChange={e => setData({...data, firstName: e.target.value})} className={inputCls} />
              <input type="text" placeholder="Last Name" value={data.lastName} onChange={e => setData({...data, lastName: e.target.value})} className={inputCls} />
            </div>
            <input type="text" placeholder="Target Role *" value={data.role} onChange={e => setData({...data, role: e.target.value})} className={inputCls} />
            <div className="grid grid-cols-2 gap-4">
              <input type="email" placeholder="Email *" value={data.email} onChange={e => setData({...data, email: e.target.value})} className={inputCls} />
              <input type="text" placeholder="Phone" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className={inputCls} />
            </div>
            <input type="text" placeholder="Location (e.g. Chennai, India)" value={data.location} onChange={e => setData({...data, location: e.target.value})} className={inputCls} />
            <div className="pt-2 border-t border-white/5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Social Links</h3>
              <div className="space-y-3">
                <input type="text" placeholder="LinkedIn URL" value={data.linkedinUrl} onChange={e => setData({...data, linkedinUrl: e.target.value})} className={inputCls} />
                <input type="text" placeholder="GitHub URL" value={data.githubUrl} onChange={e => setData({...data, githubUrl: e.target.value})} className={inputCls} />
                <input type="text" placeholder="Portfolio URL" value={data.portfolioUrl} onChange={e => setData({...data, portfolioUrl: e.target.value})} className={inputCls} />
              </div>
            </div>
          </div>
        </div>
      )
    }

    /* ── PROFESSIONAL SUMMARY ── */
    if (stepKey === 'summary') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Professional Summary</h2>
            <p className="text-sm text-gray-400">A brief career overview. Keep it 3-4 impactful sentences.</p>
          </div>
          <div className={`${sectionCardCls} p-5 space-y-3`}>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Write your summary or let AI generate one</span>
              <WriteWithAIButton type="summary" currentText={data.aiBio || `${data.role} professional`} onGenerate={(t) => setData({...data, aiBio: t})} />
            </div>
            <textarea
              rows={5}
              placeholder="Experienced software engineer with expertise in..."
              value={data.aiBio}
              onChange={e => setData({...data, aiBio: e.target.value})}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      )
    }

    /* ── EDUCATION ── */
    if (stepKey === 'education') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Education</h2>
            <p className="text-sm text-gray-400">Add your academic qualifications.</p>
          </div>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className={`${sectionCardCls} p-5 relative group`}>
                <button onClick={() => setData({...data, education: data.education.filter((_, idx) => idx !== i)})} className="absolute top-3 right-3 p-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-3">
                  <input type="text" placeholder="Degree (e.g. B.Tech Computer Science)" value={edu.degree} onChange={e => { const n = [...data.education]; n[i].degree = e.target.value; setData({...data, education: n}) }} className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="University / School" value={edu.school} onChange={e => { const n = [...data.education]; n[i].school = e.target.value; setData({...data, education: n}) }} className={inputCls} />
                    <input type="text" placeholder="Date (e.g. 2019 - 2023)" value={edu.date} onChange={e => { const n = [...data.education]; n[i].date = e.target.value; setData({...data, education: n}) }} className={inputCls} />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setData({...data, education: [...data.education, { degree: '', school: '', date: '' }]})} className="w-full py-3 border-2 border-dashed border-gray-700/50 rounded-xl text-sm font-semibold text-gray-400 hover:border-purple-500/50 hover:text-purple-300 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        </div>
      )
    }

    /* ── SKILLS ── */
    if (stepKey === 'skills') {
      const renderJDSection = () => (
        <div className="bg-[#181F2E]/60 border border-white/[0.05] rounded-xl p-5 space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Tailor Skills with Job Description
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Paste or upload a JD to extract and match keywords.</p>
            </div>
          </div>
          <textarea
            rows={4}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste target Job Description requirements here..."
            className="w-full bg-[#0D1117] border border-gray-800 rounded-xl p-3 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 resize-none transition-all"
          />
          <div className="flex gap-3">
            <button
              onClick={handleExtractSkills}
              disabled={isExtracting || !jdText.trim()}
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isExtracting ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Extracting...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" /> Suggest Skills</>
              )}
            </button>
            <label className="px-4 py-2 bg-gray-850 hover:bg-gray-800 border border-gray-700 text-xs font-semibold rounded-xl text-gray-300 cursor-pointer flex items-center gap-1.5 transition-colors">
              <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
              Upload file
              <input type="file" accept=".txt,.pdf,.docx" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          {/* Suggested Skills matching board */}
          {suggestedSkills && (
            <div className="mt-4 border-t border-white/[0.04] pt-4 space-y-4">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>SKILLS MATCH REPORT</span>
                <button onClick={() => setSuggestedSkills(null)} className="hover:text-white">Clear</button>
              </div>

              {[
                { label: 'Programming Languages', key: 'languages', dataKey: 'languages' },
                { label: 'Frameworks & Libraries', key: 'frameworks', dataKey: 'frameworks' },
                { label: 'Databases & Tools', key: 'tools', dataKey: 'tools' },
                { label: 'Soft Skills', key: 'softSkills', dataKey: 'coreSkills' }
              ].map(cat => {
                const list = suggestedSkills[cat.key as keyof SuggestedSkills] || []
                if (list.length === 0) return null
                return (
                  <div key={cat.key} className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">{cat.label}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {list.map(skill => {
                        const isAdded = (data[cat.dataKey as 'languages'|'frameworks'|'tools'|'coreSkills'] || []).includes(skill)
                        return (
                          <button
                            key={skill}
                            onClick={() => {
                              if (isAdded) {
                                handleRemoveSkill(skill, cat.dataKey as any)
                              } else {
                                handleAddSkill(skill, cat.dataKey as any)
                              }
                            }}
                            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-[#0D1117] border-gray-800 text-gray-400 hover:border-gray-700'
                            }`}
                          >
                            <span>{skill}</span>
                            {isAdded ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <span className="text-purple-400 font-bold text-[10px]">+ Add</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )

      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Skills</h2>
            <p className="text-sm text-gray-400">Separate skills with commas. Be specific for ATS matching.</p>
          </div>

          {/* Job Description Skill Suggestions Panel */}
          {renderJDSection()}

          <div className={`${sectionCardCls} p-5 space-y-5`}>
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Programming Languages</label>
              <input type="text" placeholder="Python, JavaScript, Java, C++" value={data.languages.join(', ')} onChange={e => setData({...data, languages: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Core Concepts</label>
              <input type="text" placeholder="DSA, OOP, DBMS, System Design" value={data.coreSkills.join(', ')} onChange={e => setData({...data, coreSkills: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Frameworks & Libraries</label>
              <input type="text" placeholder="React, Next.js, Node.js, Spring Boot" value={data.frameworks.join(', ')} onChange={e => setData({...data, frameworks: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Tools & Platforms</label>
              <input type="text" placeholder="Git, Docker, AWS, Firebase" value={data.tools.join(', ')} onChange={e => setData({...data, tools: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Languages Known (Spoken)</label>
              <input type="text" placeholder="English, Tamil, Hindi" value={data.languagesKnown} onChange={e => setData({...data, languagesKnown: e.target.value})} className={inputCls} />
            </div>
          </div>
        </div>
      )
    }

    /* ── EXPERIENCE ── */
    if (stepKey === 'experience') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Experience / Internships</h2>
            <p className="text-sm text-gray-400">Use action verbs and quantify results where possible.</p>
          </div>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i} className={`${sectionCardCls} p-5 relative group`}>
                <button onClick={() => setData({...data, experience: data.experience.filter((_, idx) => idx !== i)})} className="absolute top-3 right-3 p-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Job Title" value={exp.title} onChange={e => { const n = [...data.experience]; n[i].title = e.target.value; setData({...data, experience: n}) }} className={inputCls} />
                    <input type="text" placeholder="Company" value={exp.company} onChange={e => { const n = [...data.experience]; n[i].company = e.target.value; setData({...data, experience: n}) }} className={inputCls} />
                  </div>
                  <input type="text" placeholder="Date (e.g. Jan 2022 - Present)" value={exp.date} onChange={e => { const n = [...data.experience]; n[i].date = e.target.value; setData({...data, experience: n}) }} className={inputCls} />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-gray-400">Bullet points (one per line)</span>
                    <WriteWithAIButton type="bullets" currentText={`${exp.title} at ${exp.company}. ${exp.description}`} onGenerate={(t) => { const n = [...data.experience]; n[i].description = t; setData({...data, experience: n}) }} />
                  </div>
                  <textarea rows={4} placeholder="- Built feature X increasing performance by 30%&#10;- Led a team of 5 engineers..." value={exp.description} onChange={e => { const n = [...data.experience]; n[i].description = e.target.value; setData({...data, experience: n}) }} className={`${inputCls} resize-none`} />
                </div>
              </div>
            ))}
            <button onClick={() => setData({...data, experience: [...data.experience, { title: '', company: '', date: '', description: '' }]})} className="w-full py-3 border-2 border-dashed border-gray-700/50 rounded-xl text-sm font-semibold text-gray-400 hover:border-purple-500/50 hover:text-purple-300 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        </div>
      )
    }

    /* ── PROJECTS ── */
    if (stepKey === 'projects') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Projects</h2>
            <p className="text-sm text-gray-400">Showcase your best work with tech stacks and outcomes.</p>
          </div>
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i} className={`${sectionCardCls} p-5 relative group`}>
                <button onClick={() => setData({...data, projects: data.projects.filter((_, idx) => idx !== i)})} className="absolute top-3 right-3 p-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Project Name" value={proj.name} onChange={e => { const n = [...data.projects]; n[i].name = e.target.value; setData({...data, projects: n}) }} className={inputCls} />
                    <input type="text" placeholder="Tech Stack (e.g. React, Node.js)" value={proj.tech} onChange={e => { const n = [...data.projects]; n[i].tech = e.target.value; setData({...data, projects: n}) }} className={inputCls} />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-gray-400">Bullet points (one per line)</span>
                    <WriteWithAIButton type="bullets" currentText={`Project ${proj.name} using ${proj.tech}. ${proj.description}`} onGenerate={(t) => { const n = [...data.projects]; n[i].description = t; setData({...data, projects: n}) }} />
                  </div>
                  <textarea rows={4} placeholder="- Developed a full-stack platform serving 10K+ users..." value={proj.description} onChange={e => { const n = [...data.projects]; n[i].description = e.target.value; setData({...data, projects: n}) }} className={`${inputCls} resize-none`} />
                </div>
              </div>
            ))}
            <button onClick={() => setData({...data, projects: [...data.projects, { name: '', tech: '', description: '' }]})} className="w-full py-3 border-2 border-dashed border-gray-700/50 rounded-xl text-sm font-semibold text-gray-400 hover:border-purple-500/50 hover:text-purple-300 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        </div>
      )
    }

    /* ── CERTIFICATIONS ── */
    if (stepKey === 'certifications') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Certifications</h2>
            <p className="text-sm text-gray-400">Add relevant professional certifications.</p>
          </div>
          <div className="space-y-4">
            {data.certifications.map((cert, i) => (
              <div key={i} className={`${sectionCardCls} p-5 relative group`}>
                <button onClick={() => setData({...data, certifications: data.certifications.filter((_, idx) => idx !== i)})} className="absolute top-3 right-3 p-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" placeholder="Certification Name" value={cert.name} onChange={e => { const n = [...data.certifications]; n[i].name = e.target.value; setData({...data, certifications: n}) }} className={`${inputCls} col-span-1`} />
                  <input type="text" placeholder="Issuing Organization" value={cert.issuer} onChange={e => { const n = [...data.certifications]; n[i].issuer = e.target.value; setData({...data, certifications: n}) }} className={inputCls} />
                  <input type="text" placeholder="Date (e.g. Aug 2024)" value={cert.date} onChange={e => { const n = [...data.certifications]; n[i].date = e.target.value; setData({...data, certifications: n}) }} className={inputCls} />
                </div>
              </div>
            ))}
            <button onClick={() => setData({...data, certifications: [...data.certifications, { name: '', issuer: '', date: '' }]})} className="w-full py-3 border-2 border-dashed border-gray-700/50 rounded-xl text-sm font-semibold text-gray-400 hover:border-purple-500/50 hover:text-purple-300 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </div>
        </div>
      )
    }

    /* ── ACHIEVEMENTS ── */
    if (stepKey === 'achievements') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Achievements <span className="text-xs text-gray-500 font-normal">(Optional)</span></h2>
            <p className="text-sm text-gray-400">Awards, hackathon wins, publications, or notable accomplishments.</p>
          </div>
          <div className={`${sectionCardCls} p-5 space-y-3`}>
            {data.achievements.map((ach, i) => (
              <div key={i} className="flex gap-2 items-center group">
                <input
                  type="text"
                  value={ach}
                  placeholder="e.g. Winner, Smart India Hackathon 2024"
                  onChange={e => { const n = [...data.achievements]; n[i] = e.target.value; setData({...data, achievements: n}) }}
                  className={`${inputCls} flex-1`}
                />
                <button onClick={() => setData({...data, achievements: data.achievements.filter((_, idx) => idx !== i)})} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => setData({...data, achievements: [...data.achievements, '']})} className="w-full py-3 border-2 border-dashed border-gray-700/50 rounded-xl text-sm font-semibold text-gray-400 hover:border-purple-500/50 hover:text-purple-300 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Achievement
            </button>
          </div>
        </div>
      )
    }

    /* ── FINAL PREVIEW ── */
    if (stepKey === 'preview') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Final Preview</h2>
            <p className="text-sm text-gray-400">Review your resume. Switch templates or go back to edit any section.</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTemplate === t.id ? 'bg-purple-500 text-white' : 'bg-[#111620] text-gray-400 border border-gray-700/50 hover:border-purple-500/50'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="text-center text-sm text-gray-500">Scroll the preview panel on the right to see your full resume →</div>
        </div>
      )
    }

    return null
  }

  /* ──────────────── MAIN RENDER ──────────────── */
  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-64px)] overflow-hidden">

      {/* ═══ LEFT PANE: Editor ═══ */}
      <div className="w-full lg:w-[48%] border-r border-white/[0.06] bg-[#0B0E14] flex flex-col h-[calc(100vh-64px)] print:hidden z-10 relative">

        {/* Header Bar */}
        <div className="p-5 border-b border-white/[0.06] flex-shrink-0 flex justify-between items-center">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Layout className="w-5 h-5 text-cyan-400" />
            Resume Builder
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleExportWord}
              className="flex items-center gap-2 bg-[#1A2230] hover:bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl font-semibold transition-all text-xs"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              Export Word (.doc)
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl font-bold transition-all text-xs shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="px-5 py-3 border-b border-white/[0.06] flex-shrink-0 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = i === currentStep
              const isDone = i < currentStep
              return (
                <button
                  key={step.key}
                  onClick={() => setCurrentStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      : isDone
                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {step.label}
                  {isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStep()}
        </div>

        {/* Nav Buttons */}
        <div className="p-4 border-t border-white/[0.06] flex justify-between flex-shrink-0">
          <button
            onClick={goBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={goNext}
            disabled={currentStep === STEPS.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ═══ RIGHT PANE: Live Preview ═══ */}
      <div className="flex-1 bg-gray-950 flex flex-col items-center overflow-y-auto print:bg-white print:block pb-12 z-0 relative">
        <div className="sticky top-0 z-20 w-full p-3 bg-gray-950/80 backdrop-blur-md border-b border-white/[0.06] flex justify-center print:hidden">
          <div className="text-xs font-medium text-gray-500">Live Preview — {TEMPLATES.find(t => t.id === activeTemplate)?.name} Template</div>
        </div>

        <div className="mt-6 shadow-2xl print:shadow-none print:mt-0 transition-all duration-300 origin-top scale-[0.72] lg:scale-[0.78] xl:scale-[0.85]">
          {activeTemplate === 1 && <Template1 data={data} />}
          {activeTemplate === 2 && <Template2 data={data} />}
          {activeTemplate === 3 && <Template3 data={data} />}
          {activeTemplate === 4 && <Template4 data={data} />}
          {activeTemplate === 5 && <Template5 data={data} />}
        </div>
      </div>
    </div>
  )
}
