'use client'

import { InterviewConfig } from '../InterviewForm'

export default function Step3Settings({ 
  config, 
  update, 
  onNext,
  onBack
}: { 
  config: InterviewConfig, 
  update: (v: Partial<InterviewConfig>) => void, 
  onNext: () => void,
  onBack: () => void
}) {
  const type = config.type || 'technical'

  // Focus areas multi-select handler
  const handleToggleFocusArea = (area: string) => {
    const current = config.focusAreas || []
    if (current.includes(area)) {
      update({ focusAreas: current.filter(x => x !== area) })
    } else {
      update({ focusAreas: [...current, area] })
    }
  }

  // Focus topics multi-select handler (HR)
  const handleToggleFocusTopic = (topic: string) => {
    const current = config.focusTopics || []
    if (current.includes(topic)) {
      update({ focusTopics: current.filter(x => x !== topic) })
    } else {
      update({ focusTopics: [...current, topic] })
    }
  }

  // Competencies multi-select handler (Behavioural)
  const handleToggleCompetency = (comp: string) => {
    const current = config.competencies || []
    if (current.includes(comp)) {
      update({ competencies: current.filter(x => x !== comp) })
    } else {
      update({ competencies: [...current, comp] })
    }
  }

  // Design topics multi-select handler (System Design)
  const handleToggleTopic = (topic: string) => {
    const current = config.topics || []
    if (current.includes(topic)) {
      update({ topics: current.filter(x => x !== topic) })
    } else {
      update({ topics: [...current, topic] })
    }
  }

  // Resume focus multi-select handler
  const handleToggleResumeArea = (area: string) => {
    const current = config.areasToFocus || []
    if (current.includes(area)) {
      update({ areasToFocus: current.filter(x => x !== area) })
    } else {
      update({ areasToFocus: [...current, area] })
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-2">
        Step 3 — Custom Configuration
      </h2>
      <h1 className="text-2xl font-semibold mb-2">Configure Session Parameters</h1>
      <p className="text-gray-400 text-sm mb-8">
        Echo will tailor the AI interviewer behavior specifically to your answers.
      </p>

      <div className="space-y-6 mb-8">
        {/* COMMON FIELDS: Difficulty & Language & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty
            </label>
            <div className="flex gap-2">
              {['easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update({ difficulty: d })}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-colors ${
                    config.difficulty === d 
                      ? 'border-purple-500 bg-purple-500/10 text-purple-200' 
                      : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration
            </label>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update({ duration: d })}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    config.duration === d 
                      ? 'border-purple-500 bg-purple-500/10 text-purple-200' 
                      : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DYNAMIC FIELD MODULES */}
        
        {/* A. Technical Interview */}
        {type === 'technical' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Programming Language
              </label>
              <select 
                value={config.programmingLanguage || 'JavaScript'}
                onChange={(e) => update({ programmingLanguage: e.target.value })}
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              >
                {['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'C#'].map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Experience Level
              </label>
              <div className="flex gap-4">
                {['Fresher', '1-3 Years', 'Senior'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => update({ experienceLevel: lvl })}
                    className={`flex-1 py-2 px-4 rounded-lg border text-xs font-medium transition-colors ${
                      config.experienceLevel === lvl 
                        ? 'border-purple-500 bg-purple-500/10 text-purple-200' 
                        : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Focus Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {['DSA', 'OOP', 'DBMS', 'OS', 'CN', 'Java', 'Web Development', 'React', 'Backend'].map(area => {
                  const active = (config.focusAreas || []).includes(area)
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleToggleFocusArea(area)}
                      className={`py-1.5 px-3 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                          : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {area}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Include Live Coding Scenario
                </label>
                <p className="text-xs text-gray-500">Provide coding problems to solve during session</p>
              </div>
              <input 
                type="checkbox"
                checked={config.includeLiveCoding || false}
                onChange={(e) => update({ includeLiveCoding: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-[#2A2A2A]"
              />
            </div>
          </div>
        )}

        {/* B. HR Interview */}
        {type === 'hr' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Experience Level
              </label>
              <div className="flex gap-4">
                {['Junior', 'Mid-Level', 'Senior'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => update({ experienceLevel: lvl })}
                    className={`flex-1 py-2 px-4 rounded-lg border text-xs font-medium transition-colors ${
                      config.experienceLevel === lvl 
                        ? 'border-purple-500 bg-purple-500/10 text-purple-200' 
                        : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interview Style
              </label>
              <select 
                value={config.interviewStyle || 'Formal HR'}
                onChange={(e) => update({ interviewStyle: e.target.value })}
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              >
                {['Formal HR', 'Friendly HR', 'Startup HR', 'Corporate HR'].map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Focus Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {['Self Introduction', 'Strengths & Weaknesses', 'Teamwork', 'Leadership', 'Conflict Resolution', 'Salary Discussion', 'Career Goals'].map(topic => {
                  const active = (config.focusTopics || []).includes(topic)
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleToggleFocusTopic(topic)}
                      className={`py-1.5 px-3 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                          : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {topic}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* C. Behavioural Interview */}
        {type === 'behavioural' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Experience Level
              </label>
              <div className="flex gap-4">
                {['Junior', 'Mid-Level', 'Senior'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => update({ experienceLevel: lvl })}
                    className={`flex-1 py-2 px-4 rounded-lg border text-xs font-medium transition-colors ${
                      config.experienceLevel === lvl 
                        ? 'border-purple-500 bg-purple-500/10 text-purple-200' 
                        : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Enable STAR Method Evaluation
                </label>
                <p className="text-xs text-gray-500">Evaluates answers on Situation, Task, Action, and Result</p>
              </div>
              <input 
                type="checkbox"
                checked={config.starMethodMode || false}
                onChange={(e) => update({ starMethodMode: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-[#2A2A2A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Competencies to Evaluate
              </label>
              <div className="flex flex-wrap gap-2">
                {['Communication', 'Leadership', 'Problem Solving', 'Ownership', 'Adaptability', 'Time Management'].map(comp => {
                  const active = (config.competencies || []).includes(comp)
                  return (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => handleToggleCompetency(comp)}
                      className={`py-1.5 px-3 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                          : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {comp}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* D. System Design Interview */}
        {type === 'system_design' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                System Scale
              </label>
              <select 
                value={config.systemScale || 'Large Scale'}
                onChange={(e) => update({ systemScale: e.target.value })}
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              >
                {['Small', 'Medium', 'Large Scale'].map(scale => (
                  <option key={scale} value={scale}>{scale}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Topics to Include
              </label>
              <div className="flex flex-wrap gap-2">
                {['HLD', 'LLD', 'Distributed Systems', 'APIs', 'Databases', 'Caching', 'Load Balancing', 'Microservices'].map(topic => {
                  const active = (config.topics || []).includes(topic)
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleToggleTopic(topic)}
                      className={`py-1.5 px-3 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                          : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {topic}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Enable Architecture Whiteboard Canvas
                </label>
                <p className="text-xs text-gray-500">Provide drawing tools to sketch system components</p>
              </div>
              <input 
                type="checkbox"
                checked={config.whiteboardMode || false}
                onChange={(e) => update({ whiteboardMode: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-[#2A2A2A]"
              />
            </div>
          </div>
        )}

        {/* E. Resume Follow-Up Interview */}
        {type === 'resume_followup' && (
          <div className="space-y-6">
            
            {/* 📄 Upload Current Resume Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>📄</span> Upload Current Resume for AI Analysis
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Upload your latest PDF/DOCX resume so the AI interviewer extracts your actual projects, tech stack & certifications.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  Required for Resume QA
                </span>
              </div>

              <div className="relative border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 p-6 rounded-xl text-center bg-black/40 transition-all group cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      update({ resumeFileName: file.name, isResumeUploaded: true })
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {config.resumeFileName ? (
                  <div className="flex items-center justify-center gap-3 text-emerald-400 font-semibold text-xs">
                    <span className="text-base">✅</span>
                    <span>Attached: <strong>{config.resumeFileName}</strong></span>
                    <span className="text-[10px] text-zinc-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Ready for Interview</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-cyan-400 font-bold text-xs flex items-center justify-center gap-1.5">
                      <span>📤</span> Drag & Drop or Click to Upload Current Resume
                    </div>
                    <p className="text-[11px] text-zinc-500">Supports PDF, DOCX, TXT (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Areas to Focus
              </label>
              <div className="flex flex-wrap gap-2">
                {['Projects', 'Skills', 'Experience', 'Certifications', 'Education'].map(area => {
                  const active = (config.areasToFocus || []).includes(area)
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleToggleResumeArea(area)}
                      className={`py-1.5 px-3 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                          : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {area}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Ask Project Deep-Dive Questions
                </label>
                <p className="text-xs text-gray-500">Include probing questions specifically targeting project architecture</p>
              </div>
              <input 
                type="checkbox"
                checked={config.askProjectDeepDive || false}
                onChange={(e) => update({ askProjectDeepDive: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-[#2A2A2A]"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
        >
          &larr; Back
        </button>
        <button 
          onClick={onNext}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  )
}
