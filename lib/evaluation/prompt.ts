export interface EvaluationContext {
  interview: {
    type: string
    role: string
    company: string | null
    difficulty: string
    duration: number
  }
  profile: {
    experience: string | null
    role: string | null
    goal: string | null
  }
  resume: {
    aiSummary: string | null
    skills: string[]
  } | null
  messages: {
    role: string
    content: string
    type: string
    questionIndex: number | null
  }[]
  codeSubmission: {
    language: string
    code: string
    testsPassed: number
    testsTotal: number
    problemId: string
  } | null
  activePrompt?: string
}

export function buildEvaluationPrompt(ctx: EvaluationContext): string {
  const { interview, profile, resume, messages, codeSubmission } = ctx

  const qaPairs = extractQAPairs(messages)

  const conversationText = qaPairs.map((pair, i) =>
    `Q${i + 1} [${pair.type}]: ${pair.question}\nA${i + 1}: ${pair.answer}`
  ).join('\n\n')

  const codeSection = codeSubmission ? `
CODING SUBMISSION:
Problem ID: ${codeSubmission.problemId}
Language: ${codeSubmission.language}
Tests passed: ${codeSubmission.testsPassed}/${codeSubmission.testsTotal}

Code:
\`\`\`${codeSubmission.language}
${codeSubmission.code}
\`\`\`
` : 'No coding round in this interview.'

  const resumeSection = resume ? `
CANDIDATE RESUME SUMMARY:
${resume.aiSummary || 'No summary'}
Skills: ${resume.skills.join(', ')}
` : 'No resume provided.'

  if (ctx.activePrompt) {
    return `${ctx.activePrompt}

--- DYNAMIC CONTEXT ---
ROLE: ${interview.role} at ${interview.company ?? 'a top tech company'}
EXPERIENCE: ${profile.experience || 'Not specified'}
GOAL: ${profile.goal || 'General practice'}
DIFFICULTY: ${interview.difficulty}
TYPE: ${interview.type}

${resumeSection}

FULL INTERVIEW TRANSCRIPT:
${conversationText}

${codeSection}
`
  }

  return `You are a strict, senior engineering interviewer evaluating a candidate for a ${interview.role} role at ${interview.company ?? 'a top tech company'}.
Difficulty: ${interview.difficulty}. Type: ${interview.type}.

${resumeSection}

FULL INTERVIEW TRANSCRIPT:
${conversationText}

${codeSection}

EVALUATION INSTRUCTIONS:
Evaluate the candidate across EXACTLY 8 dimensions from 0 to 100.
Do NOT use random scoring. Every score must be based strictly on the transcript evidence.

8 DIMENSIONS & WEIGHTS:
1. technical       (30%): Concept correctness, technical terminology, syntax, OOP, DSA, System Design. (Use semantic similarity, not exact keyword matching).
2. problemSolving  (20%): Step-by-step logic, algorithmic reasoning, edge cases, optimization.
3. communication   (15%): Clarity, sentence structure, fluency, vocabulary.
4. confidence      (10%): Natural delivery, low hesitation, voice stability.
5. behavioural     (10%): STAR format, ownership, teamwork, professionalism.
6. completeness    (5%): Does answer include intro, explanation, example, and conclusion?
7. relevance       (5%): Direct answer to the question vs tangent/off-topic.
8. engagement      (5%): Questions answered vs skipped, response time, continuity.

CRITICAL RULES:
- If transcript has NO user answers or candidate abandoned immediately, set ALL dimension scores to 0 (engagement = 0-5).
- Provide a clear, evidence-based REASON for EVERY dimension explaining WHY the score was awarded.

Return ONLY valid JSON matching this exact schema:

{
  "scores": {
    "technical": 0,
    "problemSolving": 0,
    "communication": 0,
    "confidence": 0,
    "behavioural": 0,
    "completeness": 0,
    "relevance": 0,
    "engagement": 0
  },
  "reasons": {
    "technical": "Reason explaining technical score with transcript evidence...",
    "problemSolving": "Reason for problem solving score...",
    "communication": "Reason for communication score...",
    "confidence": "Reason for confidence score...",
    "behavioural": "Reason for behavioural score...",
    "completeness": "Reason for completeness score...",
    "relevance": "Reason for relevance score...",
    "engagement": "Reason for engagement score..."
  },
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "metrics": {
    "speakingSpeedWPM": 130,
    "wordsSpoken": 240,
    "fillerWordCount": 4,
    "skippedQuestions": 0
  },
  "questionReviews": [
    {
      "questionIndex": 1,
      "question": "Question text",
      "userAnswer": "Candidate answer text",
      "questionScore": 85,
      "technicalScore": 80,
      "confidenceScore": 90,
      "communicationScore": 85,
      "feedback": "Detailed feedback",
      "suggestedAnswer": "High quality model answer"
    }
  ],
  "summary": "Overall evaluation summary"
}`
}

function extractQAPairs(messages: any[]) {
  const pairs = []
  let currentQuestion: any = null

  for (const msg of messages) {
    if (msg.role === 'assistant' && msg.type === 'question') {
      currentQuestion = { question: msg.content, type: msg.type, index: msg.questionIndex }
    } else if (msg.role === 'user' && currentQuestion) {
      pairs.push({ ...currentQuestion, answer: msg.content })
      currentQuestion = null
    }
  }

  return pairs
}
