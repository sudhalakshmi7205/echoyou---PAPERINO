export async function generateInterviewQuestions(config: {
  type: string;
  role: string;
  company?: string | null;
  difficulty: string;
  duration: number;
  language: string;
  resumeText?: string;
}) {
  const { type, role, company, difficulty, duration, language, resumeText } = config;

  // Approximate number of questions based on duration
  let numQuestions = 3;
  if (duration >= 30) numQuestions = 5;
  if (duration >= 45) numQuestions = 7;
  if (duration >= 60) numQuestions = 10;

  // Use user-defined number of questions override if present (for technical/coding)
  if ((config as any).numQuestions) {
    numQuestions = (config as any).numQuestions;
  }

  // Construct Type-Specific Instructions
  let typeSpecificPrompt = '';
  
  if (type === 'technical') {
    typeSpecificPrompt = `
- Focus on CS fundamentals and live coding.
- Programming Language: ${(config as any).programmingLanguage || 'Any language preferred by candidate'}.
- Experience level: ${(config as any).experienceLevel || 'Mid-Level'}.
- Focus Areas: ${((config as any).focusAreas || ['Algorithms', 'Systems design']).join(', ')}.
- Include Live Coding Scenario? ${(config as any).includeLiveCoding ? 'Yes (Include mock code challenges in question details)' : 'No'}.
- Role specifics: Ask deep language-specific, database, or algorithmic questions relevant to ${role}.
`;
  } else if (type === 'hr') {
    typeSpecificPrompt = `
- HR Evaluation focusing on communication, culture fit, and soft skills.
- Style: ${(config as any).interviewStyle || 'Formal HR'}.
- Focus Topics: ${((config as any).focusTopics || ['Introduction', 'Teamwork']).join(', ')}.
- Evaluates career goals, salary expectations, leadership, and adaptability.
`;
  } else if (type === 'behavioural') {
    typeSpecificPrompt = `
- Behavioural round evaluating candidate competencies using the STAR method.
- STAR Method Mode: ${(config as any).starMethodMode ? 'Strict evaluation (Situation, Task, Action, Result)' : 'General'}.
- Competencies: ${((config as any).competencies || ['Communication', 'Leadership']).join(', ')}.
`;
  } else if (type === 'system_design') {
    typeSpecificPrompt = `
- System Architecture design evaluation.
- Scale: ${(config as any).systemScale || 'Large Scale'}.
- Topics: ${((config as any).topics || ['Microservices', 'Databases']).join(', ')}.
- Whiteboard Mode: ${(config as any).whiteboardMode ? 'Active sketching validation' : 'Verbal architectural discussion'}.
`;
  } else if (type === 'resume_followup') {
    typeSpecificPrompt = `
- Interview directly based on candidate resume.
- Focus Areas: ${((config as any).areasToFocus || ['Projects', 'Skills']).join(', ')}.
- Project Deep-Dive: ${(config as any).askProjectDeepDive ? 'Probe specific technical architecture of projects listed' : 'General check'}.
`;
  }

  let prompt = `You are an expert AI interviewer${company ? ` at ${company}` : ''}. 
Generate ${numQuestions} interview questions for a ${role} position.
The interview type is '${type}'.
The difficulty level is '${difficulty}'.
The interview will be conducted in ${language}.

${typeSpecificPrompt}

${type === 'resume_followup' && resumeText ? `CRITICAL RULE: This is a "Resume Follow-up" interview. The user has provided their resume below. You MUST base ALL of your questions on the specific projects, skills, past experiences, and bullet points mentioned in this resume. Ask them to explain their projects in depth, justify their tech stack choices, or clarify any gaps.

--- USER RESUME TEXT ---
${resumeText}
------------------------` : ''}

Return a JSON object with a single field "questions" which is an array of objects.
Each question object should have:
1. "question": The question text.
2. "rationale": Why this question is being asked and what the interviewer should look for.
3. "type": The type of question (e.g. "behavioral", "technical", "coding", "system_design", "resume_followup").

Return ONLY valid JSON.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [{
        role: 'system',
        content: 'You are an expert HR and technical interviewer. Always output valid JSON.'
      }, {
        role: 'user',
        content: prompt
      }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Groq API Error:', errText);
    throw new Error(`Failed to generate interview questions: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(text);
    return parsed.questions || [];
  } catch (error) {
    console.error('Failed to parse JSON from Groq:', text);
    throw new Error('Failed to parse interview questions');
  }
}
