import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function reviewCode({
  code,
  language,
  problem,
  testsPassed,
  testsTotal
}: {
  code: string
  language: string
  problem: any
  testsPassed: number
  testsTotal: number
}) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an expert coding interviewer evaluating a candidate's solution.
You must return your response in strictly valid JSON format matching exactly this structure:
{
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "feedback": "2-3 sentence review of approach, correctness, and style",
  "followUpQuestion": "One question the interviewer should ask about this solution"
}
Do not output any markdown or conversational text, only the JSON object.`
      },
      {
        role: 'user',
        content: `Review this coding interview solution.

Problem: ${problem.title}
Language: ${language}
Tests passed: ${testsPassed}/${testsTotal}

Code:
${code}`
      }
    ],
    model: 'llama-3.1-8b-instant',
    response_format: { type: 'json_object' }
  })

  const content = completion.choices[0]?.message?.content || '{}'
  try {
    return JSON.parse(content)
  } catch (e) {
    return {
      timeComplexity: "Unknown",
      spaceComplexity: "Unknown",
      feedback: "Failed to parse AI evaluation.",
      followUpQuestion: "Can you explain your approach to this problem?"
    }
  }
}
