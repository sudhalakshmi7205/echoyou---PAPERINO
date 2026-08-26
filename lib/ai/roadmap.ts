'use server'

import { Groq } from 'groq-sdk'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

function getGroq() { return new Groq({ apiKey: process.env.GROQ_API_KEY || '' }) }

export async function generateRoadmap(currentRole: string, desiredRole: string, skills: string[]) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  const prompt = `You are an elite career coach and tech lead. 
The user is currently a "${currentRole}" and wants to become a "${desiredRole}". 
Their current skills are: ${skills.join(', ')}.

Generate a detailed, step-by-step career and technical roadmap for them.
Return ONLY a valid JSON object with the following structure:
{
  "steps": [
    {
      "title": "Short title of the step",
      "description": "Detailed explanation of what to learn or do",
      "duration": "e.g., 2 weeks, 1 month",
      "resources": ["Specific book/course name", "Specific tool/website"]
    }
  ]
}
Make the roadmap realistic, actionable, and specific to their gap in skills. Provide 4 to 6 steps.`

  try {
    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      response_format: { type: 'json_object' }
    })

    const rawResponse = completion.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(rawResponse)

    // Save to database
    const roadmap = await db.roadmap.create({
      data: {
        clerkId: user.id,
        currentRole,
        desiredRole,
        skills,
        timeline: parsed.steps || []
      }
    })

    return roadmap
  } catch (error) {
    console.error("Roadmap generation failed", error)
    throw new Error("Failed to generate roadmap")
  }
}

export async function getUserRoadmaps() {
  const user = await currentUser()
  if (!user) return []

  return await db.roadmap.findMany({
    where: { clerkId: user.id },
    orderBy: { createdAt: 'desc' }
  })
}
