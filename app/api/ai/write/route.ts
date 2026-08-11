import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json()
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })

    let systemPrompt = `You are an expert resume writer and ATS optimization specialist with experience preparing resumes for top technology companies.
Your goal is to create recruiter-ready, ATS-friendly resume content that is concise, professional, achievement-oriented, and tailored for technical roles.

Guidelines:
- Write in a formal and professional tone.
- Focus on measurable achievements rather than responsibilities.
- Use strong action verbs.
- Include relevant technical skills and technologies naturally.
- Avoid buzzwords, clichés, and unnecessary adjectives.
- Never fabricate experience, skills, metrics, or accomplishments.
- Preserve the user's original meaning while improving clarity and impact.
- Return only the requested content without explanations, headings, quotes, or markdown.`
    
    if (type === 'summary') {
      systemPrompt += `\n\nWrite a compelling professional summary suitable for a modern ATS-friendly resume.

Requirements:
- Write 3-4 concise sentences.
- Highlight the candidate's experience level, strongest technical skills, key projects or achievements, and career objective.
- Tailor the summary to the target role if provided.
- Keep the tone confident and professional.
- Do not repeat information already obvious from other resume sections.
- Do not use first-person pronouns (I, My, Me).
- Do not include quotes, headings, or markdown.`
    } else if (type === 'bullets') {
      systemPrompt += `\n\nRewrite the provided experience or project into strong ATS-friendly resume bullet points.

Requirements:
- Generate 3-5 concise bullet points.
- Begin every bullet with a strong action verb.
- Focus on achievements, impact, and technical contributions.
- Mention technologies, frameworks, tools, or methodologies where relevant.
- Include measurable results only if explicitly provided by the user.
- Never invent metrics or accomplishments.
- Keep each bullet under two lines.
- Return plain text separated by new lines only.
- Do not include bullet symbols, numbering, markdown, or explanations.`
    } else if (type === 'extract-skills') {
      systemPrompt = `You are an ATS optimization specialist. Extract all key technical skills, tools, frameworks, programming languages, and databases mentioned in the provided Job Description.
Return ONLY a valid JSON object in this exact schema:
{
  "languages": ["lang1", "lang2"],
  "frameworks": ["fw1", "fw2"],
  "databases": ["db1", "db2"],
  "tools": ["tool1", "tool2"],
  "softSkills": ["skill1", "skill2"]
}
Do not return any explanations, markdown, or other text.`
    } else {
      systemPrompt += "\n\nWrite professional resume content."
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    })

    const result = completion.choices[0]?.message?.content?.trim()
    
    return NextResponse.json({ result })
  } catch (error: any) {
    console.error("AI write error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
