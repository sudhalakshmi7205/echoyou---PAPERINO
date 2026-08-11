import Groq from 'groq-sdk'
import { buildSystemPrompt } from './prompt'
import { ConversationMemory } from './memory'
import { getFeatureModel } from '../aiModelConfig'

export interface PipelineInput {
  userMessage: string
  memory: ConversationMemory
  promptContext: any
}

export interface PipelineOutput {
  text: string
  thinkingMs: number
  tokenCount: number
}

export async function runPipeline(input: PipelineInput): Promise<PipelineOutput> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const { userMessage, memory, promptContext } = input

  // 1. Add user turn to memory
  memory.add({ role: 'user', content: userMessage })

  // 2. Build the full message array
  const systemPrompt = await buildSystemPrompt(promptContext)
  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...memory.getContext()
  ]

  // 3. Call Groq
  const selectedModel = getFeatureModel('mock_interviews')
  const start = Date.now()
  const completion = await groq.chat.completions.create({
    model: selectedModel,  // Dynamically configured AI model
    messages,
    max_tokens: 300,       // keep responses concise
    temperature: 0.7,      // some variation but not too random
    stream: false,
  })
  const thinkingMs = Date.now() - start

  // 4. Extract response
  const text = completion.choices[0].message.content ?? ''
  const tokenCount = completion.usage?.total_tokens ?? 0

  // 5. Add AI turn to memory
  memory.add({ role: 'assistant', content: text })

  return { text, thinkingMs, tokenCount }
}

// Streaming version — for real-time word-by-word output
export async function* runPipelineStream(input: PipelineInput) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const { userMessage, memory, promptContext } = input

  memory.add({ role: 'user', content: userMessage })

  const systemPrompt = await buildSystemPrompt(promptContext)
  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...memory.getContext()
  ]

  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    max_tokens: 300,
    temperature: 0.7,
    stream: true,   // ← key difference
  })

  let fullText = ''
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? ''
    fullText += delta
    yield delta   // stream each word chunk to the client
  }

  // Only add to memory once the full response is assembled
  memory.add({ role: 'assistant', content: fullText })
}
