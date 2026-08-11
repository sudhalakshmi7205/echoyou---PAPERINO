export type ResumeData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  role: string
  githubUrl: string
  linkedinUrl: string
  portfolioUrl: string
  aiBio: string
  experience: { title: string; company: string; date: string; description: string }[]
  education: { degree: string; school: string; date: string }[]
  projects: { name: string; tech: string; description: string }[]
  certifications: { name: string; issuer: string; date: string }[]
  achievements: string[]
  languages: string[]
  coreSkills: string[]
  frameworks: string[]
  tools: string[]
  languagesKnown: string
}
