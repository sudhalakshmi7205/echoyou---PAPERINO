'use client'

import React from 'react'
import { Lightbulb, Briefcase, TrendingUp, FileText, Globe, LayoutList, CheckCircle2, AlertTriangle, MapPin } from 'lucide-react'
import type { ATSLocationAwareSuggestion, ATSFormattingDiagnostic } from '@/lib/ai/ats-analyzer'

interface RecruiterTipsProps {
  targetRole: string
  resumeText?: string
  strengths: string[]
  weaknesses: string[]
  locationSuggestions: ATSLocationAwareSuggestion[]
  formatIssues: ATSFormattingDiagnostic[]
}

export default function RecruiterTips({
  targetRole,
  resumeText = '',
  strengths,
  weaknesses,
  locationSuggestions,
  formatIssues
}: RecruiterTipsProps) {
  const textLower = resumeText.toLowerCase()
  
  // Job Title Match
  const jobTitleMatch = targetRole && textLower.includes(targetRole.toLowerCase())
  
  // Measurable Results
  const percentageCount = (textLower.match(/\d+%/g) || []).length
  const numbersCount = (textLower.match(/\b\d+\b/g) || []).length
  const hasMeasurableResults = (percentageCount + numbersCount) >= 3
  
  // Word Count
  const wordCount = resumeText.split(/\s+/).filter(word => word.length > 0).length
  const hasGoodWordCount = wordCount >= 475 && wordCount <= 600

  // Web Presence
  const hasWebPresence = /(github\.com|linkedin\.com|http)/i.test(resumeText)

  // Section Headings
  const hasEducation = textLower.includes('education')
  const hasExperience = textLower.includes('experience')
  const hasSections = hasEducation && hasExperience

  const renderStatusBadge = (isGood: boolean) => (
    isGood ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#2dd4bf]/10 text-[#2dd4bf]">
        <CheckCircle2 className="w-3.5 h-3.5" /> Good
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-500">
        <AlertTriangle className="w-3.5 h-3.5" /> Improve
      </span>
    )
  )

  return (
    <div className="bg-[#0f2b26] border border-[#2dd4bf]/20 rounded-3xl p-6 md:p-8 mt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-[#2dd4bf]/15 rounded-xl">
          <Lightbulb className="w-6 h-6 text-[#2dd4bf]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Recruiter Tips</h2>
          <p className="text-zinc-400 text-sm">Data-driven resume advice based on ATS best practices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title Match */}
        <div className="bg-[#132f2a] border border-[#2dd4bf]/15 rounded-2xl p-5 flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#2dd4bf]" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="font-semibold text-white">Job Title Match</h3>
              {renderStatusBadge(!!jobTitleMatch)}
            </div>
            <p className="text-sm text-zinc-400">
              {jobTitleMatch 
                ? "Your target job title appears in your resume. This helps ATS confirm your relevance."
                : `Add "${targetRole || 'your target role'}" to your summary or objective to improve match rate.`}
            </p>
          </div>
        </div>

        {/* Measurable Results */}
        <div className="bg-[#132f2a] border border-[#2dd4bf]/15 rounded-2xl p-5 flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#2dd4bf]" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="font-semibold text-white">Measurable Results</h3>
              {renderStatusBadge(hasMeasurableResults)}
            </div>
            <p className="text-sm text-zinc-400">
              {hasMeasurableResults
                ? "Great job quantifying your achievements with numbers and metrics."
                : "Try to add more numbers, percentages, or dollar amounts to quantify your impact."}
            </p>
          </div>
        </div>

        {/* Word Count */}
        <div className="bg-[#132f2a] border border-[#2dd4bf]/15 rounded-2xl p-5 flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#2dd4bf]" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="font-semibold text-white">Word Count</h3>
              {renderStatusBadge(hasGoodWordCount)}
            </div>
            <p className="text-sm text-zinc-400">
              {hasGoodWordCount
                ? `Your word count (${wordCount}) is in the optimal range (475-600 words) for a one-page resume.`
                : `Your word count is ${wordCount}. Try to aim for 475-600 words for optimal ATS readability.`}
            </p>
          </div>
        </div>

        {/* Web Presence */}
        <div className="bg-[#132f2a] border border-[#2dd4bf]/15 rounded-2xl p-5 flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#2dd4bf]" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="font-semibold text-white">Web Presence</h3>
              {renderStatusBadge(hasWebPresence)}
            </div>
            <p className="text-sm text-zinc-400">
              {hasWebPresence
                ? "Your resume includes links to your professional web presence."
                : "Add a link to your LinkedIn profile, GitHub, or personal portfolio."}
            </p>
          </div>
        </div>

        {/* Section Headings */}
        <div className="bg-[#132f2a] border border-[#2dd4bf]/15 rounded-2xl p-5 flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center">
              <LayoutList className="w-5 h-5 text-[#2dd4bf]" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="font-semibold text-white">Standard Sections</h3>
              {renderStatusBadge(hasSections)}
            </div>
            <p className="text-sm text-zinc-400">
              {hasSections
                ? "ATS systems can easily find your Experience and Education sections."
                : "Make sure you use standard headings like 'Experience' and 'Education'."}
            </p>
          </div>
        </div>
        
        {/* Location Suggestions (if any) */}
        {locationSuggestions.length > 0 && (
          <div className="bg-[#132f2a] border border-[#2dd4bf]/15 rounded-2xl p-5 flex gap-4 md:col-span-2">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#2dd4bf]" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-semibold text-white">Location Tips</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#2dd4bf]/10 text-[#2dd4bf]">
                  <Lightbulb className="w-3.5 h-3.5" /> Suggestion
                </span>
              </div>
              <ul className="space-y-3 mt-3">
                {locationSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-zinc-400">
                    <strong className="text-white">{suggestion.targetSection}:</strong> {suggestion.actionableGuidance}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
