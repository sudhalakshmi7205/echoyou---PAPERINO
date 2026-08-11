'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RoadmapLandingPage from './RoadmapLandingPage'
import OnboardingWizard from './OnboardingWizard'
import RoadmapGeneratingScreen from './RoadmapGeneratingScreen'
import RoadmapTimeline from './RoadmapTimeline'

interface RoadmapOrchestratorProps {
  initialData?: any
  initialPreferences?: any
}

type ViewState = 'landing' | 'wizard' | 'generating' | 'roadmap'

export default function RoadmapOrchestrator({ initialData, initialPreferences }: RoadmapOrchestratorProps) {
  const [viewState, setViewState] = useState<ViewState>('landing')
  const [selectedUniverse, setSelectedUniverse] = useState<'role' | 'dsa' | 'cs' | null>(null)
  const [preferences, setPreferences] = useState<any>(initialPreferences || null)
  const [roadmapData, setRoadmapData] = useState<any>(initialData || null)

  /* ── On mount: check if user has completed wizard before ── */
  useEffect(() => {
    if (initialPreferences?.wizardCompleted && initialData) {
      setPreferences(initialPreferences)
      setSelectedUniverse(initialPreferences.universe)
      setRoadmapData(initialData)
      setViewState('roadmap')
    } else if (initialPreferences?.wizardCompleted) {
      // Preferences exist but no roadmap data — go to generating
      setPreferences(initialPreferences)
      setSelectedUniverse(initialPreferences.universe)
      setViewState('generating')
    }
  }, [initialPreferences, initialData])

  /* ── Handlers ── */
  const handleSelectUniverse = (universe: 'role' | 'dsa' | 'cs') => {
    setSelectedUniverse(universe)
    setViewState('wizard')
  }

  const handleWizardComplete = async (wizardPreferences: any) => {
    setPreferences(wizardPreferences)
    // Save preferences with wizardCompleted flag
    try {
      await fetch('/api/roadmap/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...wizardPreferences, wizardCompleted: true })
      })
    } catch (err) {
      console.error('Error saving preferences:', err)
    }
    setViewState('generating')
  }

  const handleWizardBack = () => {
    setSelectedUniverse(null)
    setViewState('landing')
  }

  const handleGenerationComplete = (data: any) => {
    setRoadmapData(data)
    setViewState('roadmap')
  }

  const handleChangeUniverse = () => {
    setViewState('landing')
    setSelectedUniverse(null)
  }

  const handleSettingsRegenerate = async (updatedPreferences: any) => {
    setPreferences(updatedPreferences)
    try {
      await fetch('/api/roadmap/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedPreferences, wizardCompleted: true })
      })
    } catch (err) {
      console.error('Error saving updated preferences:', err)
    }
    setViewState('generating')
  }

  return (
    <AnimatePresence mode="wait">
      {viewState === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <RoadmapLandingPage onSelectUniverse={handleSelectUniverse} />
        </motion.div>
      )}

      {viewState === 'wizard' && selectedUniverse && (
        <motion.div
          key="wizard"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4 }}
        >
          <OnboardingWizard
            universe={selectedUniverse}
            onComplete={handleWizardComplete}
            onBack={handleWizardBack}
          />
        </motion.div>
      )}

      {viewState === 'generating' && preferences && (
        <motion.div
          key="generating"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <RoadmapGeneratingScreen
            preferences={preferences}
            onComplete={handleGenerationComplete}
          />
        </motion.div>
      )}

      {viewState === 'roadmap' && (
        <motion.div
          key="roadmap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RoadmapTimeline
            initialData={roadmapData}
            preferences={preferences}
            onChangeUniverse={handleChangeUniverse}
            onSettingsRegenerate={handleSettingsRegenerate}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
