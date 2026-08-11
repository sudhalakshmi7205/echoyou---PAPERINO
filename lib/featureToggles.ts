export type FeatureKey = 
  | 'mock_interviews'
  | 'ats_resume'
  | 'leaderboard'
  | 'coding_lab'
  | 'onboarding'
  | 'role_roadmap'
  | 'dsa_roadmap'
  | 'cs_roadmap'

export interface FeatureToggleConfig {
  key: FeatureKey
  name: string
  category: string
  description: string
  isEnabled: boolean
}

// Global in-memory feature toggles store
let featureTogglesStore: Record<FeatureKey, boolean> = {
  mock_interviews: true,
  ats_resume: true,
  leaderboard: true,
  coding_lab: true,
  onboarding: true,
  role_roadmap: true,
  dsa_roadmap: true,
  cs_roadmap: true,
}

export function getFeatureToggles(): Record<FeatureKey, boolean> {
  return { ...featureTogglesStore }
}

export function updateFeatureToggle(key: FeatureKey, isEnabled: boolean): Record<FeatureKey, boolean> {
  if (key in featureTogglesStore) {
    featureTogglesStore[key] = isEnabled
  }
  return { ...featureTogglesStore }
}
