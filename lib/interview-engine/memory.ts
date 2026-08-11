import Groq from 'groq-sdk'

export interface ConversationMessage {
  role: 'assistant' | 'user'
  content: string
}

const MAX_TOKENS_BUDGET = 6000   // leave room for system prompt + response
const WORDS_PER_TOKEN = 0.75     // rough estimate

export class ConversationMemory {
  private messages: ConversationMessage[] = []
  private maxWords: number

  constructor(maxTokenBudget = MAX_TOKENS_BUDGET) {
    this.maxWords = Math.floor(maxTokenBudget * WORDS_PER_TOKEN)
  }

  add(message: ConversationMessage) {
    this.messages.push(message)
    this.trim()
  }

  // Returns messages safe to send to Groq
  getContext(): ConversationMessage[] {
    return this.messages
  }

  // Sliding window — drop oldest messages when over budget
  private trim() {
    while (this.wordCount() > this.maxWords && this.messages.length > 4) {
      // Always keep the first 2 messages (intro exchange) for context
      this.messages.splice(2, 1)
    }
  }

  private wordCount(): number {
    return this.messages.reduce((sum, m) => sum + m.content.split(' ').length, 0)
  }

  // Summarise old messages into one compressed context message
  async summarise(oldMessages: ConversationMessage[]): Promise<ConversationMessage> {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const text = oldMessages.map(m => `${m.role}: ${m.content}`).join('\n')
    
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',   // cheap fast model for summarisation
      messages: [{
        role: 'user',
        content: `Summarise this interview conversation in 3 sentences, preserving key topics covered and candidate strengths/weaknesses:\n\n${text}`
      }],
      max_tokens: 150,
    })
    
    return {
      role: 'assistant',
      content: `[Earlier conversation summary: ${response.choices[0].message.content}]`
    }
  }

  reset() { this.messages = [] }
  length() { return this.messages.length }
}
