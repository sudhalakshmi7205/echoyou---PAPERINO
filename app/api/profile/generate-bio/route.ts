import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import Groq from 'groq-sdk'

function getGroq() { return new Groq({ apiKey: process.env.GROQ_API_KEY || '' }) }


export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const profile = await db.profile.findUnique({ where: { clerkId: user.id } })
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const prompt = `
      You are an expert technical recruiter and resume writer. 
      Write a highly professional, 2-to-3 sentence biography for a candidate.
      Do NOT include any greetings, just the biography paragraph itself.

      Here is their data:
      Name: ${user.firstName} ${user.lastName}
      Role: ${profile.role || 'Software Engineer'}
      Experience Level: ${profile.experience || 'Entry level'}
      Key Skills: ${profile.languages.join(', ') || 'Various technologies'}
      Career Goal: ${profile.goal || 'Looking for great opportunities'}

      Make it sound impressive, confident, and tailored to the tech industry.
    `

    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
    })

    const generatedBio = completion.choices[0]?.message?.content?.trim() || ''

    if (generatedBio) {
      await db.profile.update({
        where: { clerkId: user.id },
        data: { aiBio: generatedBio }
      })
    }

    return NextResponse.json({ aiBio: generatedBio })
  } catch (error) {
    console.error('Failed to generate bio:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
