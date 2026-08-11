'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, ArrowLeft, Calendar, Clock, Code2, BookOpen, 
  Target, Briefcase, Building, Layers, Zap, CheckCircle2, Star, Sparkles
} from 'lucide-react'
import CustomDatePicker from './CustomDatePicker'

interface OnboardingWizardProps {
  universe: 'role' | 'dsa' | 'cs'
  onComplete: (preferences: any) => void
  onBack: () => void
}

export default function OnboardingWizard({ universe, onComplete, onBack }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  const [preferences, setPreferences] = useState({
    universe: universe,
    startDate: new Date().toISOString().split('T')[0],
    dailyHours: 2,
    language: 'Java',
    learningStyle: 'mixed',
    goal: 'Placement',
    // Role-specific
    role: 'Software Engineer',
    company: '',
    duration: '3 Months',
    experience: 'beginner',
    // DSA-specific
    dsaDifficulty: 'beginner',
    dsaTarget: 'Placements',
    // CS-specific
    csSubjects: [] as string[],
  })

  // Auto-save effect
  useEffect(() => {
    if (currentStep > 0) {
      fetch('/api/roadmap/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      }).catch(console.error)
    }
  }, [currentStep, preferences])

  const nextStep = () => {
    setDirection(1)
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setDirection(-1)
    setCurrentStep((prev) => prev - 1)
  }

  const updatePreference = (key: keyof typeof preferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const toggleCsSubject = (subject: string) => {
    setPreferences((prev) => {
      const exists = prev.csSubjects.includes(subject)
      if (exists) {
        return { ...prev, csSubjects: prev.csSubjects.filter((s) => s !== subject) }
      } else {
        return { ...prev, csSubjects: [...prev.csSubjects, subject] }
      }
    })
  }

  // Define steps
  const sharedSteps = [
    { id: 'welcome' },
    { id: 'startDate' },
    { id: 'dailyHours' },
    { id: 'language' },
    { id: 'learningStyle' },
    { id: 'goal' }
  ]

  let specificSteps: any[] = []
  if (universe === 'role') {
    specificSteps = [{ id: 'role' }, { id: 'company' }, { id: 'duration' }, { id: 'experience' }]
  } else if (universe === 'dsa') {
    specificSteps = [{ id: 'dsaDifficulty' }, { id: 'dsaTarget' }, { id: 'duration' }]
  } else if (universe === 'cs') {
    specificSteps = [{ id: 'csSubjects' }, { id: 'duration' }]
  }

  const allSteps = [...sharedSteps, ...specificSteps, { id: 'summary' }]
  const totalSteps = allSteps.length - 1 // Exclude welcome step from progress

  const currentStepData = allSteps[currentStep]
  const isLastStep = currentStep === allSteps.length - 1

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  }

  const NavigationButtons = ({ disableNext = false, onNextClick = nextStep, nextLabel = 'Continue' }) => (
    <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/5">
      <button
        onClick={prevStep}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-medium border border-white/10"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <button
        onClick={onNextClick}
        disabled={disableNext}
        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
          disableNext 
            ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' 
            : 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(138,92,255,0.3)] hover:shadow-[0_0_30px_rgba(138,92,255,0.5)] hover:scale-105'
        }`}
      >
        {nextLabel} {nextLabel !== 'Generate Roadmap 🚀' && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  )

  const SelectionGrid = ({ 
    options, 
    value, 
    onChange, 
    columns = 3,
    renderOption = (opt: any) => opt.label || opt
  }: any) => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
      {options.map((opt: any, idx: number) => {
        const optValue = typeof opt === 'string' ? opt : opt.value
        const isSelected = Array.isArray(value) ? value.includes(optValue) : value === optValue
        
        return (
          <button
            key={idx}
            onClick={() => onChange(optValue)}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
              isSelected
                ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50 shadow-[0_0_15px_rgba(138,92,255,0.2)]'
                : 'border-white/10 bg-[#1a1f2e] hover:bg-white/5 hover:border-white/20 text-gray-300'
            }`}
          >
            {renderOption(opt, isSelected)}
          </button>
        )
      })}
    </div>
  )

  const renderStep = () => {
    switch (currentStepData.id) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 blur-3xl opacity-20 rounded-full"
              />
              <div className="w-24 h-24 bg-[#1a1f2e] border border-white/10 rounded-3xl flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(138,92,255,0.2)]">
                <Sparkles className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-cyan-400">
              Welcome to EchoRoadmap
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-12">
              Let's personalize your learning journey. Answer a few questions and we'll build your own AI roadmap.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="px-8 py-4 rounded-2xl bg-white/5 text-white hover:bg-white/10 transition-all font-medium border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(138,92,255,0.4)] hover:shadow-[0_0_50px_rgba(138,92,255,0.6)] hover:scale-105 transition-all"
              >
                Start Setup <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )

      case 'startDate':
        {
          const todayObj = new Date()
          todayObj.setHours(0, 0, 0, 0)
          const selParts = (preferences.startDate || '').split('-')
          let selDateObj = todayObj
          if (selParts.length === 3) {
            selDateObj = new Date(parseInt(selParts[0], 10), parseInt(selParts[1], 10) - 1, parseInt(selParts[2], 10))
            selDateObj.setHours(0, 0, 0, 0)
          }
          const isDateInvalid = isNaN(selDateObj.getTime()) || selDateObj < todayObj

          const formatIsoDate = (d: Date) => {
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            return `${y}-${m}-${day}`
          }

          const todayIso = formatIsoDate(todayObj)
          const tomorrowObj = new Date(todayObj)
          tomorrowObj.setDate(tomorrowObj.getDate() + 1)
          const tomorrowIso = formatIsoDate(tomorrowObj)

          return (
            <div className="py-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Calendar className="text-purple-400" />
                When are you planning to start learning?
              </h2>
              <p className="text-gray-400 mb-6">Your roadmap schedule will begin from this date.</p>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => updatePreference('startDate', todayIso)}
                  className={`px-6 py-3.5 rounded-xl border font-semibold transition-all flex items-center gap-2 ${
                    preferences.startDate === todayIso
                      ? 'border-purple-500 bg-purple-500/10 text-white ring-2 ring-purple-500/50 shadow-[0_0_15px_rgba(138,92,255,0.3)]'
                      : 'border-white/10 bg-[#1a1f2e] text-gray-300 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  ✅ Start Today
                </button>
                <button
                  type="button"
                  onClick={() => updatePreference('startDate', tomorrowIso)}
                  className={`px-6 py-3.5 rounded-xl border font-semibold transition-all flex items-center gap-2 ${
                    preferences.startDate === tomorrowIso
                      ? 'border-purple-500 bg-purple-500/10 text-white ring-2 ring-purple-500/50 shadow-[0_0_15px_rgba(138,92,255,0.3)]'
                      : 'border-white/10 bg-[#1a1f2e] text-gray-300 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  🚀 Start Tomorrow
                </button>
              </div>

              {/* Custom Date Picker Component */}
              <CustomDatePicker
                selectedDate={preferences.startDate}
                onChange={(newDate) => {
                  updatePreference('startDate', newDate)
                }}
              />
              
              <NavigationButtons disableNext={isDateInvalid} />
            </div>
          )
        }

      case 'dailyHours':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Clock className="text-purple-400" />
              How many hours can you learn daily?
            </h2>
            <p className="text-gray-400 mb-8">We'll adjust your daily tasks based on this commitment.</p>
            
            <SelectionGrid
              options={[
                { value: 0.5, label: '30 min' },
                { value: 1, label: '1 hr' },
                { value: 2, label: '2 hr' },
                { value: 3, label: '3 hr' },
                { value: 4, label: '4 hr' },
                { value: 6, label: '6 hr' },
              ]}
              value={preferences.dailyHours}
              onChange={(val: number) => updatePreference('dailyHours', val)}
              renderOption={(opt: any, isSelected: boolean) => (
                <div className="text-center py-2">
                  <div className={`text-2xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {opt.value}
                  </div>
                  <div className={`text-sm ${isSelected ? 'text-purple-300' : 'text-gray-400'}`}>
                    {opt.label}/day
                  </div>
                </div>
              )}
            />
            <NavigationButtons />
          </div>
        )

      case 'language':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Code2 className="text-purple-400" />
              Preferred Programming Language
            </h2>
            <p className="text-gray-400 mb-8">All resources will be in your chosen language.</p>
            
            <SelectionGrid
              columns={4}
              options={['Java', 'Python', 'C++', 'JavaScript', 'Go', 'C#', 'Rust', 'Other']}
              value={preferences.language}
              onChange={(val: string) => updatePreference('language', val)}
              renderOption={(opt: string, isSelected: boolean) => (
                <div className={`font-semibold text-center ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {opt}
                </div>
              )}
            />
            <NavigationButtons />
          </div>
        )

      case 'learningStyle':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <BookOpen className="text-purple-400" />
              How do you prefer learning?
            </h2>
            <p className="text-gray-400 mb-8">We'll tailor resource recommendations to your style.</p>
            
            <SelectionGrid
              columns={2}
              options={[
                { value: 'videos', label: 'Videos', icon: '📹' },
                { value: 'reading', label: 'Reading', icon: '📖' },
                { value: 'interactive', label: 'Interactive', icon: '🧪' },
                { value: 'mixed', label: 'Mixed', icon: '🎯' },
              ]}
              value={preferences.learningStyle}
              onChange={(val: string) => updatePreference('learningStyle', val)}
              renderOption={(opt: any, isSelected: boolean) => (
                <div className="flex flex-col items-center justify-center py-4 gap-3">
                  <span className="text-4xl">{opt.icon}</span>
                  <span className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {opt.label}
                  </span>
                </div>
              )}
            />
            <NavigationButtons />
          </div>
        )

      case 'goal':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Target className="text-purple-400" />
              What's your primary goal?
            </h2>
            <p className="text-gray-400 mb-8">This helps us focus your roadmap properly.</p>
            
            <SelectionGrid
              columns={3}
              options={[
                'Placement', 'Internship', 'Switch Company', 
                'Interview Preparation', 'Skill Development', 'College', 'Hackathons'
              ]}
              value={preferences.goal}
              onChange={(val: string) => updatePreference('goal', val)}
              renderOption={(opt: string, isSelected: boolean) => (
                <div className={`font-semibold flex items-center justify-center text-center h-full min-h-[3rem] ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {opt}
                </div>
              )}
            />
            <NavigationButtons />
          </div>
        )

      // --- ROLE UNIVERSE SPECIFIC STEPS ---
      case 'role':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Briefcase className="text-purple-400" />
              Which role are you targeting?
            </h2>
            <p className="text-gray-400 mb-8">Select the career path you want to follow.</p>
            
            <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              <SelectionGrid
                columns={3}
                options={[
                  'Software Engineer', 'Backend', 'Frontend', 'Full Stack', 
                  'AI Engineer', 'ML Engineer', 'Data Scientist', 'Android', 
                  'DevOps', 'Cloud', 'Cyber Security', 'QA', 'Blockchain'
                ]}
                value={preferences.role}
                onChange={(val: string) => updatePreference('role', val)}
              />
            </div>
            <NavigationButtons />
          </div>
        )

      case 'company':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Building className="text-purple-400" />
              Any specific target companies? (Optional)
            </h2>
            <p className="text-gray-400 mb-8">We'll include company-specific patterns in your roadmap.</p>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search company..."
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
            
            <div className="max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar mb-4">
              <SelectionGrid
                columns={3}
                options={[
                  'Google', 'Amazon', 'Microsoft', 'Adobe', 'Atlassian', 'Meta', 
                  'Netflix', 'Uber', 'Flipkart', 'Zoho', 'Freshworks', 'TCS', 
                  'Infosys', 'Accenture', 'Cognizant', 'Capgemini', 'HCL', 'Wipro', 'Other'
                ]}
                value={preferences.company}
                onChange={(val: string) => updatePreference('company', val === preferences.company ? '' : val)}
              />
            </div>
            
            <NavigationButtons nextLabel={preferences.company ? 'Continue' : 'Skip'} />
          </div>
        )

      case 'experience':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Star className="text-purple-400" />
              What's your current experience level?
            </h2>
            <p className="text-gray-400 mb-8">We'll adjust the starting difficulty accordingly.</p>
            
            <SelectionGrid
              columns={3}
              options={[
                { value: 'beginner', label: 'Beginner', desc: 'Just starting out' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Know the basics well' },
                { value: 'advanced', label: 'Advanced', desc: 'Looking for mastery' }
              ]}
              value={preferences.experience}
              onChange={(val: string) => updatePreference('experience', val)}
              renderOption={(opt: any, isSelected: boolean) => (
                <div className="text-center py-2">
                  <div className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {opt.label}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-purple-200' : 'text-gray-500'}`}>
                    {opt.desc}
                  </div>
                </div>
              )}
            />
            <NavigationButtons />
          </div>
        )

      // --- DSA UNIVERSE SPECIFIC STEPS ---
      case 'dsaDifficulty':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Layers className="text-purple-400" />
              Select Target Difficulty
            </h2>
            <p className="text-gray-400 mb-8">This determines the volume and depth of problems.</p>
            
            <SelectionGrid
              columns={1}
              options={[
                { value: 'beginner', label: 'Beginner (Core 75)', desc: 'Essential patterns, equivalent to NeetCode 75' },
                { value: 'intermediate', label: 'Intermediate (Core 150)', desc: 'Comprehensive prep, equivalent to NeetCode 150' },
                { value: 'pro', label: 'Pro (Advanced 250)', desc: 'Exhaustive coverage for top-tier companies' }
              ]}
              value={preferences.dsaDifficulty}
              onChange={(val: string) => updatePreference('dsaDifficulty', val)}
              renderOption={(opt: any, isSelected: boolean) => (
                <div className="py-2 px-2 flex justify-between items-center">
                  <div>
                    <div className={`text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                      {opt.label}
                    </div>
                    <div className={`text-sm ${isSelected ? 'text-purple-200' : 'text-gray-400'}`}>
                      {opt.desc}
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="text-purple-400 w-6 h-6" />}
                </div>
              )}
            />
            <NavigationButtons />
          </div>
        )

      case 'dsaTarget':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Target className="text-purple-400" />
              What are you targeting?
            </h2>
            <p className="text-gray-400 mb-8">Helps us prioritize specific problem sets.</p>
            
            <SelectionGrid
              columns={2}
              options={['Placements', 'Competitive Programming', 'Interviews', 'General Learning']}
              value={preferences.dsaTarget}
              onChange={(val: string) => updatePreference('dsaTarget', val)}
            />
            <NavigationButtons />
          </div>
        )

      // --- CS UNIVERSE SPECIFIC STEPS ---
      case 'csSubjects':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <BookOpen className="text-purple-400" />
              Select Subjects to Learn
            </h2>
            <p className="text-gray-400 mb-8">Choose one or more subjects for your roadmap.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['OS', 'CN', 'DBMS', 'OOP', 'System Design', 'Compiler Design', 'Linux', 'Git', 'REST APIs'].map((subject) => {
                const isSelected = preferences.csSubjects.includes(subject)
                return (
                  <button
                    key={subject}
                    onClick={() => toggleCsSubject(subject)}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 flex justify-between items-center ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10 ring-1 ring-purple-500/50'
                        : 'border-white/10 bg-[#1a1f2e] hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <span className={`font-semibold ${isSelected ? 'text-white' : ''}`}>{subject}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                  </button>
                )
              })}
            </div>
            <NavigationButtons disableNext={preferences.csSubjects.length === 0} />
          </div>
        )

      // --- SHARED SPECIFIC STEPS ---
      case 'duration':
        return (
          <div className="py-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Calendar className="text-purple-400" />
              Target Duration
            </h2>
            <p className="text-gray-400 mb-8">How long do you want this roadmap to be?</p>
            
            <SelectionGrid
              columns={3}
              options={['1 Month', '2 Months', '3 Months', '4 Months', '6 Months']}
              value={preferences.duration}
              onChange={(val: string) => updatePreference('duration', val)}
              renderOption={(opt: string, isSelected: boolean) => (
                <div className={`font-semibold text-center py-2 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {opt}
                </div>
              )}
            />
            <NavigationButtons />
          </div>
        )

      // --- FINAL STEP ---
      case 'summary':
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4 ring-2 ring-purple-500/30">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Here's your personalized learning plan</h2>
              <p className="text-gray-400">Review your preferences before we generate the roadmap.</p>
            </div>
            
            <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-6 mb-8 shadow-inner max-h-[40vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {/* Always visible */}
                <SummaryItem label="Universe" value={preferences.universe.toUpperCase()} />
                <SummaryItem label="Start Date" value={preferences.startDate} />
                <SummaryItem label="Daily Commitment" value={`${preferences.dailyHours} hours/day`} />
                <SummaryItem label="Language" value={preferences.language} />
                <SummaryItem label="Learning Style" value={preferences.learningStyle} className="capitalize" />
                <SummaryItem label="Goal" value={preferences.goal} />
                
                {/* Role specific */}
                {universe === 'role' && (
                  <>
                    <SummaryItem label="Role" value={preferences.role} />
                    {preferences.company && <SummaryItem label="Target Company" value={preferences.company} />}
                    <SummaryItem label="Experience" value={preferences.experience} className="capitalize" />
                    <SummaryItem label="Duration" value={preferences.duration} />
                  </>
                )}
                
                {/* DSA specific */}
                {universe === 'dsa' && (
                  <>
                    <SummaryItem label="Difficulty" value={preferences.dsaDifficulty} className="capitalize" />
                    <SummaryItem label="Target" value={preferences.dsaTarget} />
                    <SummaryItem label="Duration" value={preferences.duration} />
                  </>
                )}
                
                {/* CS specific */}
                {universe === 'cs' && (
                  <>
                    <SummaryItem label="Subjects" value={preferences.csSubjects.join(', ')} />
                    <SummaryItem label="Duration" value={preferences.duration} />
                  </>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-white/5 pt-6">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all font-medium border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => onComplete(preferences)}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold shadow-[0_0_20px_rgba(138,92,255,0.4)] hover:shadow-[0_0_40px_rgba(138,92,255,0.6)] hover:scale-105 transition-all"
              >
                Generate Roadmap 🚀
              </button>
            </div>
          </div>
        )
      
      default:
        return <div>Unknown Step</div>
    }
  }

  const SummaryItem = ({ label, value, className = '' }: { label: string, value: string, className?: string }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</span>
      <span className={`text-white font-medium ${className}`}>{value}</span>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto text-white">
      {currentStep > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Completed
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      <div className="bg-[#111620]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-center">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="relative z-10 w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
