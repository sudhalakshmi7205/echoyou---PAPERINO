import { Redis } from '@upstash/redis'
import { ConversationMessage } from './memory'

const getRedisClient = () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

export async function getMemory(interviewId: string): Promise<ConversationMessage[]> {
  const redis = getRedisClient()
  if (!redis) return []
  const raw = await redis.get<ConversationMessage[]>(`memory:${interviewId}`)
  return raw ?? []
}

export async function appendMemory(interviewId: string, message: ConversationMessage) {
  const redis = getRedisClient()
  if (!redis) return
  const existing = await getMemory(interviewId)
  const updated = [...existing, message]

  // Trim to last 30 messages
  const trimmed = updated.slice(-30)

  await redis.set(`memory:${interviewId}`, trimmed, { ex: 60 * 60 * 4 }) // 4hr TTL
}

export async function clearMemory(interviewId: string) {
  const redis = getRedisClient()
  if (!redis) return
  await redis.del(`memory:${interviewId}`)
}
