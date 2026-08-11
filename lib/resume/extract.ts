import { db } from '@/lib/db'

export async function generateResumeSummary(resumeText: string, jobDescription?: string | null) {
  const isAtsMode = !!jobDescription
  
  const activePrompt: { content: string } | null = null

  let systemPrompt = isAtsMode
    ? `You are an expert ATS Analyzer. Analyze the resume against the provided Job Description.
Return ONLY valid JSON with this exact structure:
{
  "summary": "2-3 sentence professional summary of candidate",
  "skills": ["skill1", "skill2"],
  "ats": {
    "matchScore": <number 0-100>,
    "formatScore": <number 0-100>,
    "keywordScore": <number 0-100>,
    "missingKeywords": ["kw1", "kw2"],
    "matchingKeywords": ["kw3", "kw4"],
    "missingSkills": ["skill3", "skill4"],
    "matchingSkills": ["skill5", "skill6"],
    "feedback": {
      "strengths": ["s1", "s2"],
      "weaknesses": ["w1", "w2"],
      "actionableSteps": ["step1"]
    }
  }
}`
    : `You are an expert HR assistant. Analyse this resume and return a JSON object with two fields:
1. "summary" — a 2-3 sentence professional summary of the candidate
2. "skills" — an array of technical skills extracted from the resume

Return ONLY valid JSON.`

  if ((activePrompt as any)?.content) {
    systemPrompt = (activePrompt as any).content + (isAtsMode ? "\n\nCRITICAL: Return valid JSON matching the ATS schema." : "\n\nCRITICAL: Return valid JSON matching the summary schema.")
  }

  const userContent = isAtsMode
    ? `Job Description:\n${jobDescription}\n\nResume:\n${resumeText}`
    : `Resume:\n${resumeText}`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ]
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Failed to generate resume summary: ${err}`)
  }

  const data = await response.json()
  const text = data.choices[0].message.content
  const parsed = JSON.parse(text)

  return {
    summary: parsed.summary as string,
    skills: parsed.skills as string[],
    ats: isAtsMode ? parsed.ats : null
  }
}
