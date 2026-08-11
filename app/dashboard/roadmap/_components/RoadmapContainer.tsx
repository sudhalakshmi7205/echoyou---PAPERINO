'use client'

import React, { useState } from 'react'
import RoadmapLandingPage from './RoadmapLandingPage'
import PreferenceIntakeForm, { UserPreferences } from './PreferenceIntakeForm'
import RoleBasedRoadmapView from './RoleBasedRoadmapView'
import DsaOverviewScreen from './DsaOverviewScreen'
import DsaPreferenceSetup, { DsaPreferences } from './DsaPreferenceSetup'
import DsaPatternRoadmapView from './DsaPatternRoadmapView'
import CoreCsUniverseView from './CoreCsUniverseView'
import CoreCsRoadmapView from './CoreCsRoadmapView'

interface RoadmapContainerProps {
  studentName: string
  initialPreferences?: UserPreferences | null
}

type ViewState = 
  | 'landing' 
  | 'role_intake' 
  | 'role_roadmap' 
  | 'dsa_overview' 
  | 'dsa_setup' 
  | 'dsa_roadmap'
  | 'cs_universe'
  | 'cs_roadmap'

export default function RoadmapContainer({ studentName, initialPreferences }: RoadmapContainerProps) {
  const [viewState, setViewState] = useState<ViewState>('landing')
  const [selectedUniverse, setSelectedUniverse] = useState<'role' | 'dsa' | 'cs'>('role')
  
  // Role Preferences
  const [rolePreferences, setRolePreferences] = useState<UserPreferences | null>(initialPreferences || null)

  // DSA Preferences
  const [dsaPreferences, setDsaPreferences] = useState<DsaPreferences>({
    level: 'Beginner',
    language: 'Java'
  })

  // Selected Core CS Topic
  const [selectedCsTopic, setSelectedCsTopic] = useState<string>('oops')

  const handleSelectUniverse = (universe: 'role' | 'dsa' | 'cs') => {
    setSelectedUniverse(universe)
    if (universe === 'role') {
      setViewState('role_intake')
    } else if (universe === 'dsa') {
      setViewState('dsa_overview')
    } else {
      setViewState('cs_universe')
    }
  }

  const handleRolePreferencesSubmit = (newPrefs: UserPreferences) => {
    setRolePreferences(newPrefs)
    setViewState('role_roadmap')

    fetch('/api/roadmap/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newPrefs, universe: 'role' })
    }).catch(console.error)
  }

  const handleDsaPreferencesSubmit = (newPrefs: DsaPreferences) => {
    setDsaPreferences(newPrefs)
    setViewState('dsa_roadmap')

    fetch('/api/roadmap/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dsaLevel: newPrefs.level, language: newPrefs.language, universe: 'dsa' })
    }).catch(console.error)
  }

  const handleSelectCsTopic = (topicId: string) => {
    setSelectedCsTopic(topicId)
    setViewState('cs_roadmap')
  }

  const handleBackToLanding = () => {
    setViewState('landing')
  }

  return (
    <div className="w-full h-full min-h-[calc(100vh-64px)] bg-[#06080D] text-white">
      {/* 1. Solar System 3D Landing Page */}
      {viewState === 'landing' && (
        <RoadmapLandingPage onSelectUniverse={handleSelectUniverse} />
      )}

      {/* 2. Role-Based Flow */}
      {viewState === 'role_intake' && (
        <PreferenceIntakeForm
          initialPreferences={rolePreferences || undefined}
          onSubmit={handleRolePreferencesSubmit}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {viewState === 'role_roadmap' && rolePreferences && (
        <RoleBasedRoadmapView
          preferences={rolePreferences}
          studentName={studentName}
          onEditPreferences={handleBackToLanding}
        />
      )}

      {/* 3. DSA Prep Flow */}
      {viewState === 'dsa_overview' && (
        <DsaOverviewScreen
          onContinue={() => setViewState('dsa_setup')}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {viewState === 'dsa_setup' && (
        <DsaPreferenceSetup
          initialPreferences={dsaPreferences}
          onSubmit={handleDsaPreferencesSubmit}
          onBack={() => setViewState('dsa_overview')}
        />
      )}

      {viewState === 'dsa_roadmap' && (
        <DsaPatternRoadmapView
          preferences={dsaPreferences}
          studentName={studentName}
          onEditPreferences={handleBackToLanding}
        />
      )}

      {/* 4. Core CS Fundamentals Flow */}
      {viewState === 'cs_universe' && (
        <CoreCsUniverseView
          onSelectTopic={handleSelectCsTopic}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {viewState === 'cs_roadmap' && (
        <CoreCsRoadmapView
          topicId={selectedCsTopic}
          studentName={studentName}
          onBackToUniverse={() => setViewState('cs_universe')}
        />
      )}
    </div>
  )
}
