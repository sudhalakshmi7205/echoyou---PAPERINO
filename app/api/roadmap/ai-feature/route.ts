import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import Groq from 'groq-sdk'

function getGroq() { return new Groq({ apiKey: process.env.GROQ_API_KEY || '' }) }

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { type, topic, role } = await req.json()
    if (!type || !topic) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    let prompt = ''
    if (type === 'explain') {
      prompt = `Explain the topic "${topic}" in the context of a ${role || 'software developer'}. 
      Explain it simply, as if to a beginner, but include 1 or 2 practical code or real-world examples.
      Keep it under 300 words. Format as clean Markdown.`
    } else if (type === 'quiz') {
      prompt = `Generate a mini multiple-choice quiz about "${topic}" for a ${role || 'learner'}. 
      Include exactly 3 questions. 
      For each question, provide 4 options (A, B, C, D) and specify the correct answer along with a 1-sentence explanation.
      Format it clearly in Markdown.`
    } else {
      return NextResponse.json({ error: 'Invalid feature type' }, { status: 400 })
    }

    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
    })

    const result = completion.choices[0]?.message?.content || 'No response generated.'

    return NextResponse.json({ result })
  } catch (error) {
    console.error('AI Feature error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
