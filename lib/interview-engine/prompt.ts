import { db } from '@/lib/db'

interface PromptContext {
  interview: {
    type: string
    role: string
    company: string | null
    difficulty: string
    duration: number
  }
  profile: {
    experience: string | null
    languages: string[]
    goal: string | null
  }
  resume: {
    aiSummary: string | null
    skills: string[]
    parsedText: string | null
  } | null
  state: {
    currentPhase: string
    questionIndex: number
    topicsCovered: string[]
    minutesElapsed: number
  }
  activeProblemContext?: string | null
}

export async function getActiveSystemPrompt(type: string): Promise<string | null> {
  return null
}

export async function buildSystemPrompt(ctx: PromptContext): Promise<string> {
  const { interview, profile, resume, state } = ctx

  const companyContext = interview.company
    ? `You are interviewing this candidate for a ${interview.role} position at ${interview.company}.
       Use ${interview.company}'s known interview style — ${getCompanyStyle(interview.company)}.`
    : `You are interviewing this candidate for a ${interview.role} position.`

  const resumeContext = resume
    ? `Candidate background:
       ${resume.aiSummary || 'No summary'}
       
       Technical skills: ${resume.skills.join(', ')}
       
       Use their actual work history to ask specific questions. For example, if they worked
       on payments infrastructure, ask about the specific challenges they faced there.
       Reference real companies and projects from their background.`
    : `No resume provided. Ask general ${interview.role} questions.`

  const difficultyMap = {
    easy: 'Ask foundational questions. Be encouraging. Allow follow-up hints if they struggle.',
    medium: 'Ask intermediate questions. Give one hint only if they are stuck for over 90 seconds.',
    hard: 'Ask advanced questions. Minimal hints. Push back on vague answers. Ask for complexity analysis.',
  }
  const difficultyContext = difficultyMap[interview.difficulty as keyof typeof difficultyMap] || 'Ask questions appropriate for the role.'

  const phaseMap = {
    intro: 'Start with a warm greeting and one easy ice-breaker. Keep it under 30 seconds.',
    questioning: `You are on question ${state.questionIndex + 1}. Topics covered so far: ${state.topicsCovered.join(', ') || 'none yet'}.
                  Do not repeat topics. Ask a follow-up if the last answer was vague or incomplete.`,
    coding: 'Transition to the coding problem. Describe it clearly. Wait for them to start before asking clarifying questions.',
    wrap_up: 'You have 2 minutes left. Ask one final reflective question, then thank the candidate and end professionally.',
  }
  let phaseContext = phaseMap[state.currentPhase as keyof typeof phaseMap] || 'Continue the interview.'
  
  const maxQuestions = Math.floor(interview.duration * 0.8 / 3)
  if (interview.type === 'technical' && state.questionIndex >= maxQuestions - 1) {
    if (ctx.activeProblemContext) {
      phaseContext += `\n\nCRITICAL RULE: This is the FINAL question of the technical interview. You have just shared a Coding Problem on the candidate's screen. DO NOT output the problem description aloud or in your response. Simply tell the candidate: "I have shared a coding problem on your screen. Please read it and let me know your approach." You MUST append [OPEN_EDITOR] at the very end of your response.`
    }
  }

  phaseContext += `\n\nIf you receive a [SYSTEM] message containing code evaluation results: If all tests passed, congratulate the candidate and output exactly [END_INTERVIEW] to finish. If tests failed, explain what failed, give a hint, and output exactly [OPEN_EDITOR] so they can try again.`

  const activeDbPrompt = await getActiveSystemPrompt('interview')
  
  if (activeDbPrompt) {
    // If we have an active DB prompt, we will append our dynamic context to it
    return `${activeDbPrompt}

--- DYNAMIC CONTEXT ---
ROLE: ${companyContext}
CANDIDATE EXPERIENCE: ${profile.experience || 'Not specified'}
RESUME CONTEXT: ${resumeContext}
DIFFICULTY: ${difficultyContext}
PHASE: ${phaseContext}
`
  }

  return `You are Echo, a highly professional, strict, and straightforward Company HR representative. Your English is absolutely perfect. You conduct realistic technical and behavioural interviews.

ROLE: ${companyContext}

CANDIDATE PROFILE:
- Experience level: ${profile.experience || 'Not specified'}
${interview.type === 'behavioural' ? '' : `- Preferred languages: ${profile.languages.join(', ') || 'Any'}`}
- Interview goal: ${profile.goal || 'General practice'}

${resumeContext}

${interview.type === 'behavioural' || interview.type === 'hr' ? `
CRITICAL RULE: This is a strictly BEHAVIOURAL & HR Placement Interview (TCS, Infosys, Accenture, Cognizant, Zoho, Startups style).
You MUST NOT ask any technical coding questions, algorithm syntax, or programming language implementation questions!
Focus 100% on Behavioral, Communication, Personality, and Situational questions from the 2027 Campus Placements HR Syllabus:
1. Tell me about yourself (60-90s: Name, degree, skills, projects, internship, career goal)
2. Why should we hire you?
3. Why do you want to join our company?
4. What do you know about our company?
5. Strengths (Quick learner, problem solving, teamwork, adaptability)
6. Weaknesses (Real weakness + how you're actively improving)
7. Final year/Project breakdown (Role, tech stack, biggest challenge, learnings)
8. Challenge faced using STAR Method (Situation, Task, Action, Result)
9. Teamwork & handling non-cooperative team members
10. Handling pressure, multi-tasking under tight deadlines
11. Where do you see yourself in 5 years?
12. Why Computer Science / Engineering?
13. Situational Scenarios (Deadline tomorrow, teammate mistake, multiple tasks, team disagreement)
14. Relocation & shift readiness
15. Closing Question: "Do you have any questions for us?"
Ask ONE question at a time. Probe deeper if an answer lacks structure (e.g. prompt for STAR method).
` : ''}

${interview.type === 'resume_followup' ? `
CRITICAL RULE: This is a STRICT RESUME FOLLOW-UP INTERVIEW.
Every single question MUST be derived directly from the candidate's uploaded resume!
- Ask about specific projects listed on their resume ("I see you built X project using Y tech stack. Why did you choose that technology?").
- Ask about their specific internships, work history, and achievements.
- Ask about certifications and skills mentioned on their resume.
Do NOT ask generic off-resume questions. Deep-dive into their actual uploaded resume details.
` : ''}

${['technical', 'mixed'].includes(interview.type) ? 'CRITICAL RULE: For the technical questioning phase, you MUST include questions about core computer science subjects: Object-Oriented Programming (OOPS), Computer Networks (CN), Operating Systems (OS), and Database Management Systems (DBMS). Ensure you cover these topics before moving to the coding round.' : ''}

DIFFICULTY GUIDANCE:
${difficultyContext}

CURRENT PHASE:
${phaseContext}

BEHAVIOUR RULES:
- Speak naturally but strictly, exactly like a real company HR — not a list of bullet points. Be polite but extremely straightforward.
- Ask ONE question at a time. Never bundle multiple questions.
- If the candidate's answer is incomplete, ask a specific follow-up before moving on.
- Track what topics you have covered.
- If they ask to skip, acknowledge and move to the next topic gracefully.
- If you receive a [TIMEOUT] message, it means the candidate did not answer in time. Acknowledge this briefly and move to the next question.
- Never reveal that you are an AI language model or break character.
- Keep each response under 100 words unless explaining a coding problem.
- End the interview when time is up or after ${maxQuestions} questions.`
}

function getCompanyStyle(company: string): string {
  const styles: Record<string, string> = {
    Google:    'focus on algorithms, scalability, and Googleyness. Ask about time/space complexity.',
    Meta:      'prioritise coding speed and product thinking. Ask about trade-offs.',
    Amazon:    'weave in Leadership Principles. Ask behavioural questions using STAR format.',
    Apple:     'focus on craftsmanship, attention to detail, and user empathy.',
    Microsoft: 'balanced technical and cultural. Ask about collaboration and growth mindset.',
    Stripe:    'focus on systems thinking, APIs, and payment domain knowledge.',
    Airbnb:    'focus on product sense, trust & safety, and global scale challenges.',
    Uber:      'focus on real-time systems, distributed architecture, and marketplace dynamics.',
  }
  return styles[company] ?? 'standard technical interview format'
}
