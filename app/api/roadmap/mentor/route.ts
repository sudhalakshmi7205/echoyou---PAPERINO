import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import Groq from 'groq-sdk'

function getGroq() { return new Groq({ apiKey: process.env.GROQ_API_KEY || '' }) }

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { topic, question, language, role } = await req.json()

    const prompt = `You are a senior engineering architect and AI tutor.
The student is studying the topic "${topic || 'General Programming'}" in ${language || 'Java'} for a ${role || 'Software Engineer'} role.

User Question/Doubt:
"${question}"

Provide a clear, concise, 2-3 paragraph technical explanation with code examples if relevant. Be direct, encouraging, and clear.`

    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant'
    })

    const reply = completion.choices[0]?.message?.content || 'Focus on memory layout, analyze time complexity, and implement edge cases.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error in AI Mentor route:', error)
    return NextResponse.json({ reply: 'Here is a quick breakdown: Make sure to review basic syntax, write modular code, and test edge cases.' })
  }
}
