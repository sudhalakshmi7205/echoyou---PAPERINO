import Groq from 'groq-sdk'
import { getFeatureModel } from '../aiModelConfig'

function getGroq() { return new Groq({ apiKey: process.env.GROQ_API_KEY || '' }) }

export interface ATSCategoryScores {
  hardSkillsScore: number // 40% weight
  jobTitleScore: number // 20% weight
  softSkillsScore: number // 15% weight
  experienceScore: number // 15% weight
  formatScore: number // 10% weight

  // Legacy fallbacks
  keywordScore?: number
  skillsScore?: number
  educationScore?: number
  relevanceScore?: number
}

export interface ATSKeywordCategorization {
  matchedKeywords: string[]
  criticalMissing: string[] // Critical missing keywords (core requirements)
  niceToHaveMissing: string[] // Secondary / nice-to-have missing keywords
  partialKeywords: { keyword: string; matchedAs: string; note: string }[]
  lowPriorityKeywords: string[]
  missingKeywords: string[] // Legacy flat list fallback
}

export interface ATSSkillsGap {
  hardSkillsMissing: string[]
  softSkillsMissing: string[]
  hardSkillsMatched: string[]
  softSkillsMatched: string[]

  // Legacy fallbacks
  criticalMissing?: string[]
  recommendedMissing?: string[]
  strongMatches?: string[]
}

export interface ATSComparisonRow {
  requirement: string
  resumeEvidence: string
  matchStatus: 'exact' | 'partial' | 'missing'
}

export interface ATSFormattingDiagnostic {
  checkName: string
  passed: boolean
  explanation: string
  issue?: string
  severity?: 'high' | 'medium' | 'low'
  recommendation?: string
}

export interface ATSBulletAnalysis {
  originalBullet: string
  issue: string
  suggestedImprovement: string
}

export interface ATSLocationAwareSuggestion {
  keyword: string
  targetSection: string
  actionableGuidance: string
}

export interface ATSParsedJD {
  jobTitle: string
  company?: string
  requiredSkills: string[]
  preferredSkills: string[]
  softSkills: string[]
  educationRequirements: string[]
  experienceRequirements: string[]
  responsibilities: string[]
  tools: string[]
  technologies: string[]
  keywords: string[]
}

export interface FullATSAnalysisResult {
  overallScore: number // 0-100 calculated from exact 40/20/15/15/10 weighted formula
  matchBand: 'Excellent Match' | 'Good Match' | 'Needs Improvement' | 'Poor Match'
  statusLevel: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor'
  scoreExplanation: string
  isGeneralMode: boolean
  disclaimer: string

  categories: ATSCategoryScores
  keywords: ATSKeywordCategorization
  skillsGap: ATSSkillsGap
  locationSuggestions: ATSLocationAwareSuggestion[]
  parsedJD?: ATSParsedJD
  comparisonTable: ATSComparisonRow[]
  formatIssues: ATSFormattingDiagnostic[]
  contentIssues: string[]
  bulletAnalysis: ATSBulletAnalysis[]
  recommendations: { title: string; detail: string; category: string }[]
  strengths: string[]
  weaknesses: string[]

  // Fallbacks for backward compatibility
  matchScore: number
  formatScore: number
  keywordScore: number
  missingKeywords: string[]
  feedback: any
}

// Normalized technology dictionary
export const SYNONYM_DICTIONARY: Record<string, string[]> = {
  'react': ['react.js', 'reactjs', 'react'],
  'javascript': ['js', 'javascript', 'ecmascript'],
  'typescript': ['ts', 'typescript'],
  'node': ['node.js', 'nodejs', 'node'],
  'postgres': ['postgresql', 'postgres'],
  'mongo': ['mongodb', 'mongo'],
  'rest api': ['restful apis', 'rest api', 'restful api', 'rest'],
  'machine learning': ['ml', 'machine learning'],
  'artificial intelligence': ['ai', 'artificial intelligence'],
  'aws': ['amazon web services', 'aws'],
  'k8s': ['kubernetes', 'k8s'],
  'docker': ['docker', 'containerization'],
  'spring boot': ['spring boot', 'spring'],
  'python': ['python', 'py'],
  'golang': ['go', 'golang']
}

export async function analyzeResumeATS(
  parsedText: string,
  targetRole?: string | null,
  jobDescription?: string | null
): Promise<FullATSAnalysisResult | null> {
  if (!parsedText) return null

  const isGeneralMode = !jobDescription || !jobDescription.trim()

  const systemPrompt = `
You are an elite Applicant Tracking System (ATS) Engine & Technical HR Director modeled after Jobscan.
Analyze candidate resume text against an optional Job Description (JD) using a strict weighted 5-category scoring algorithm:

JOBSCAN WEIGHTED SCORING FORMULA (Must equal overallScore 0-100):
- Hard skills match (40% weight) -> 0-100
- Job title/role match (20% weight) -> 0-100
- Soft skills match (15% weight) -> 0-100
- Experience level match (15% weight) -> 0-100
- Formatting/ATS-readiness (10% weight) -> 0-100

Formula: overallScore = Math.round(hardSkillsScore*0.40 + jobTitleScore*0.20 + softSkillsScore*0.15 + experienceScore*0.15 + formatScore*0.10)

MATCH BANDS:
- 85-100 -> "Excellent Match"
- 70-84 -> "Good Match"
- 50-69 -> "Needs Improvement"
- Below 50 -> "Poor Match"

SYNONYMS & VARIATION DICTIONARY TO APPLY:
- React.js <-> React <-> ReactJS
- JavaScript <-> JS
- TypeScript <-> TS
- Node.js <-> Node
- PostgreSQL <-> Postgres
- MongoDB <-> Mongo
- REST API <-> RESTful APIs
- Machine Learning <-> ML
- Artificial Intelligence <-> AI
- AWS <-> Amazon Web Services
- Kubernetes <-> K8s

MISSING KEYWORD CATEGORIZATION:
- criticalMissing: Core requirements appearing multiple times or in target job title.
- niceToHaveMissing: Secondary skills mentioned once or as optional preferred criteria.

LOCATION-AWARE RECOMMENDATIONS:
- Never tell user to "add keywords anywhere" (avoids keyword stuffing).
- Suggestions MUST state exactly WHERE and HOW to add terms (e.g. "Add 'Agile' near your project management bullet in Experience #2").

FORMATTING CHECKS (Must return checkName, passed: boolean, explanation for each):
1. File Type & Text Parseability
2. Contact Info Detected (email, phone, LinkedIn)
3. Standard Section Headers Detected (Experience, Education, Skills, Summary)
4. Layout Check (no complex tables/graphics breaking parsers)
5. Date Formatting Consistency
6. Bullet Point Usage & Action Verbs

Return ONLY valid JSON matching this exact schema:
{
  "isGeneralMode": ${isGeneralMode},
  "parsedJD": {
    "jobTitle": "Extracted or inferred target job title",
    "company": "Company name if present in JD or null",
    "requiredSkills": ["skill1", "skill2"],
    "preferredSkills": ["skill3"],
    "softSkills": ["Communication", "Leadership"],
    "educationRequirements": ["B.Tech CS"],
    "experienceRequirements": ["3+ years"],
    "responsibilities": ["Build REST APIs"],
    "tools": ["Git", "Docker"],
    "technologies": ["Java", "Spring Boot"],
    "keywords": ["Java", "Spring", "AWS"]
  },
  "categories": {
    "hardSkillsScore": 85,
    "jobTitleScore": 80,
    "softSkillsScore": 75,
    "experienceScore": 85,
    "formatScore": 90
  },
  "overallScore": 83,
  "matchBand": "Good Match",
  "statusLevel": "Good",
  "scoreExplanation": "Your resume achieved an 83% — Good Match. Strong alignment on core Java & Spring Boot backend development, but missing secondary containerization tools (AWS, Kubernetes) required by the target role.",
  "disclaimer": "This is a guidance estimate — actual ATS behavior varies by company.",
  "keywords": {
    "matchedKeywords": ["Java", "Spring Boot", "SQL", "REST API"],
    "criticalMissing": ["AWS", "Kubernetes"],
    "niceToHaveMissing": ["GraphQL", "Kafka"],
    "partialKeywords": [
      { "keyword": "React.js", "matchedAs": "React", "note": "Demonstrates React experience, consider using exact term 'React.js'" }
    ],
    "lowPriorityKeywords": ["Agile", "Jira"],
    "missingKeywords": ["AWS", "Kubernetes", "GraphQL", "Kafka"]
  },
  "skillsGap": {
    "hardSkillsMissing": ["AWS", "Kubernetes"],
    "softSkillsMissing": ["Cross-functional Leadership"],
    "hardSkillsMatched": ["Java", "Spring Boot", "SQL", "REST API"],
    "softSkillsMatched": ["Problem Solving", "Team Collaboration"]
  },
  "locationSuggestions": [
    {
      "keyword": "AWS",
      "targetSection": "Experience #1 (Backend Engineer bullet)",
      "actionableGuidance": "Incorporate 'AWS' into your second bullet point under your Backend Engineer role where you describe cloud microservices deployment."
    }
  ],
  "comparisonTable": [
    { "requirement": "Java & Spring Boot", "resumeEvidence": "Built backend microservices in Java & Spring Boot", "matchStatus": "exact" },
    { "requirement": "REST APIs", "resumeEvidence": "Designed RESTful endpoints for user authentication", "matchStatus": "exact" },
    { "requirement": "Cloud Infrastructure (AWS)", "resumeEvidence": "Not explicitly mentioned in resume text", "matchStatus": "missing" }
  ],
  "formatIssues": [
    { "checkName": "Contact Info Detected", "passed": true, "explanation": "Email and phone number detected in resume header." },
    { "checkName": "Standard Headings", "passed": true, "explanation": "Standard Experience, Education, and Skills headers found." },
    { "checkName": "Layout & Parseability", "passed": true, "explanation": "Clean text layout parsed without complex table blockage." }
  ],
  "contentIssues": [
    "Weak bullet point descriptions lacking quantifiable metrics (percentages, speed improvements)"
  ],
  "bulletAnalysis": [
    {
      "originalBullet": "Worked on web application using Java.",
      "issue": "Lacks specific action verb, technologies used, and quantifiable impact metric.",
      "suggestedImprovement": "Engineered a Java & Spring Boot REST API service that reduced backend response latency by 35%."
    }
  ],
  "recommendations": [
    {
      "title": "Add AWS Cloud Experience to Experience #1",
      "detail": "The target JD highlights AWS as a key requirement. Add 'AWS' near your microservices bullet in Experience #1 if accurate.",
      "category": "Hard Skills"
    }
  ],
  "strengths": [
    "Strong technical skills alignment with primary stack requirements",
    "Clean standard ATS section headers (Experience, Projects, Education, Skills)"
  ],
  "weaknesses": [
    "Missing secondary cloud deployment & containerization keywords",
    "Bullet points lack quantifiable business metrics"
  ]
}
`

  const safeResumeText = parsedText.slice(0, 8000)
  const safeJDText = (jobDescription || '').slice(0, 4000)

  const userContent = `
Target Role: ${targetRole || 'Target Job Position'}
Job Description:
${safeJDText || 'None provided. Perform General ATS Resume Assessment.'}

Resume Text:
${safeResumeText}
`

  try {
    const selectedModel = getFeatureModel('ats_resume') || 'llama-3.3-70b-versatile'
    let rawContent: string | null = null

    try {
      const completion = await getGroq().chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        model: selectedModel,
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
      rawContent = completion.choices[0]?.message?.content || null
    } catch (modelErr) {
      console.warn(`Primary model ${selectedModel} failed, trying fallback llama-3.3-70b-versatile:`, modelErr)
      const fallbackCompletion = await getGroq().chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
      rawContent = fallbackCompletion.choices[0]?.message?.content || null
    }

    if (!rawContent) return null

    const cleanJson = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleanJson)

    // Calculate final weighted score based on 40/20/15/15/10 formula
    const cats = parsed.categories || {}
    const hardScore = Number(cats.hardSkillsScore) || 75
    const titleScore = Number(cats.jobTitleScore) || 75
    const softScore = Number(cats.softSkillsScore) || 80
    const expScore = Number(cats.experienceScore) || 75
    const fmtScore = Number(cats.formatScore) || 85

    const computedOverall = Math.min(100, Math.max(0, Math.round(
      hardScore * 0.40 +
      titleScore * 0.20 +
      softScore * 0.15 +
      expScore * 0.15 +
      fmtScore * 0.10
    )))

    let matchBand: 'Excellent Match' | 'Good Match' | 'Needs Improvement' | 'Poor Match' = 'Good Match'
    let statusLevel: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor' = 'Good'

    if (computedOverall >= 85) {
      matchBand = 'Excellent Match'
      statusLevel = 'Excellent'
    } else if (computedOverall >= 70) {
      matchBand = 'Good Match'
      statusLevel = 'Good'
    } else if (computedOverall >= 50) {
      matchBand = 'Needs Improvement'
      statusLevel = 'Needs Improvement'
    } else {
      matchBand = 'Poor Match'
      statusLevel = 'Poor'
    }

    const criticalMissing = parsed.keywords?.criticalMissing || parsed.missingKeywords || []
    const niceToHaveMissing = parsed.keywords?.niceToHaveMissing || []

    const result: FullATSAnalysisResult = {
      overallScore: computedOverall,
      matchBand,
      statusLevel,
      scoreExplanation: parsed.scoreExplanation || `Your resume achieved a ${computedOverall}% — ${matchBand}. Based on Jobscan-style multi-factor analysis.`,
      isGeneralMode,
      disclaimer: "This is a guidance estimate — actual ATS behavior varies by company.",
      categories: {
        hardSkillsScore: hardScore,
        jobTitleScore: titleScore,
        softSkillsScore: softScore,
        experienceScore: expScore,
        formatScore: fmtScore,
        // Legacy fallbacks
        keywordScore: hardScore,
        skillsScore: hardScore,
        educationScore: expScore,
        relevanceScore: titleScore
      },
      keywords: {
        matchedKeywords: parsed.keywords?.matchedKeywords || [],
        criticalMissing,
        niceToHaveMissing,
        partialKeywords: parsed.keywords?.partialKeywords || [],
        lowPriorityKeywords: parsed.keywords?.lowPriorityKeywords || [],
        missingKeywords: [...criticalMissing, ...niceToHaveMissing]
      },
      skillsGap: {
        hardSkillsMissing: parsed.skillsGap?.hardSkillsMissing || criticalMissing,
        softSkillsMissing: parsed.skillsGap?.softSkillsMissing || [],
        hardSkillsMatched: parsed.skillsGap?.hardSkillsMatched || parsed.keywords?.matchedKeywords || [],
        softSkillsMatched: parsed.skillsGap?.softSkillsMatched || [],
        // Legacy fallbacks
        criticalMissing,
        recommendedMissing: niceToHaveMissing,
        strongMatches: parsed.keywords?.matchedKeywords || []
      },
      locationSuggestions: parsed.locationSuggestions || [],
      parsedJD: parsed.parsedJD || undefined,
      comparisonTable: parsed.comparisonTable || [],
      formatIssues: parsed.formatIssues || [],
      contentIssues: parsed.contentIssues || [],
      bulletAnalysis: parsed.bulletAnalysis || [],
      recommendations: parsed.recommendations || [],
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],

      // Fallbacks
      matchScore: computedOverall,
      formatScore: fmtScore,
      keywordScore: hardScore,
      missingKeywords: [...criticalMissing, ...niceToHaveMissing],
      feedback: parsed
    }

    return result
  } catch (error) {
    console.error("ATS Analysis failed:", error)
    return null
  }
}
