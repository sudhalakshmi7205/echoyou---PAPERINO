export type AIFeatureKey = 
  | 'mock_interviews'
  | 'interview_feedback'
  | 'ats_resume'
  | 'resume_builder'
  | 'coding_lab'
  | 'roadmap'

export interface ModelOption {
  id: string
  name: string
  provider: 'Groq' | 'Google'
  description: string
}

export const AVAILABLE_AI_MODELS: ModelOption[] = [
  { id: 'llama-3.3-70b-versatile', name: 'Groq Llama 3.3 70B (Versatile)', provider: 'Groq', description: 'High reasoning, conversational dialogue & evaluation.' },
  { id: 'deepseek-r1-distill-llama-70b', name: 'Groq DeepSeek R1 (70B Distill)', provider: 'Groq', description: 'Advanced logic, step-by-step code & system design.' },
  { id: 'mixtral-8x7b-32768', name: 'Groq Mixtral 8x7B (32k Context)', provider: 'Groq', description: 'Large context window for long resumes and documents.' },
  { id: 'llama-3.1-8b-instant', name: 'Groq Llama 3.1 8B (Instant)', provider: 'Groq', description: 'Ultra fast low latency model for instant responses.' },
  { id: 'gemini-1.5-flash', name: 'Google Gemini 1.5 Flash', provider: 'Google', description: 'High speed multimodal Google AI model.' },
  { id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro', provider: 'Google', description: 'Deep reasoning Google AI model.' },
]

export const AI_FEATURE_METADATA: Record<AIFeatureKey, { name: string; category: string; description: string }> = {
  mock_interviews: { name: 'AI Live Mock Interviews', category: 'Interviews Engine', description: 'Voice & text mock interview dialogue generation' },
  interview_feedback: { name: 'Interview Scoring & Feedback', category: 'Interviews Engine', description: 'Post-interview score calculations, strengths & weakness reports' },
  ats_resume: { name: 'ATS Analyzer', category: 'Career Tools', description: 'PDF text parsing, skill extraction & ATS match score' },
  resume_builder: { name: 'Resume Builder', category: 'Career Tools', description: 'AI resume bullet optimization & section generation' },
  coding_lab: { name: 'Coding Lab Inside Interview', category: 'Coding Lab', description: 'Real-time Monaco code editor hints & solution analysis' },
  roadmap: { name: 'EchoRoadmap', category: 'Roadmap Engine', description: 'Personalized role-based, DSA & Core CS milestone generator' },
}

// Global feature model mapping store configured with exact top recommendations
let aiFeatureModelsStore: Record<AIFeatureKey, string> = {
  mock_interviews: 'llama-3.3-70b-versatile',
  interview_feedback: 'deepseek-r1-distill-llama-70b',
  ats_resume: 'llama-3.3-70b-versatile',
  resume_builder: 'llama-3.3-70b-versatile',
  coding_lab: 'deepseek-r1-distill-llama-70b',
  roadmap: 'llama-3.3-70b-versatile',
}

export function getFeatureModel(featureKey: AIFeatureKey): string {
  return aiFeatureModelsStore[featureKey] || 'llama-3.3-70b-versatile'
}

export function getAllFeatureModels(): Record<AIFeatureKey, string> {
  return { ...aiFeatureModelsStore }
}

export function setFeatureModel(featureKey: AIFeatureKey, modelId: string): Record<AIFeatureKey, string> {
  if (featureKey in aiFeatureModelsStore) {
    aiFeatureModelsStore[featureKey] = modelId
  }
  return { ...aiFeatureModelsStore }
}
