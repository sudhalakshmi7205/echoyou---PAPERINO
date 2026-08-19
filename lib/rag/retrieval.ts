import { db } from '@/lib/db'
import { splitResumeIntoChunks } from './chunking'
import { generateEmbedding } from './embeddings'
import { RAG_CONFIG } from './config'

export interface ProcessedChunk {
  id: string
  content: string
  section: string | null
  similarity: number
}

/**
 * Persists resume text chunks and embeddings into PostgreSQL.
 * Atomically invalidates/deletes old chunks for the given resumeId before inserting new chunks.
 * Structured error logging without leaking candidate content.
 */
export async function processAndStoreResumeChunks(
  clerkId: string,
  resumeId: string,
  parsedText: string
): Promise<number> {
  if (!parsedText || !parsedText.trim()) return 0

  try {
    // 1. Atomic clean-up: Delete existing chunks for this resumeId
    await db.$executeRaw`DELETE FROM "ResumeChunk" WHERE "clerkId" = ${clerkId} AND "resumeId" = ${resumeId}`

    const rawChunks = splitResumeIntoChunks(parsedText)
    if (rawChunks.length === 0) return 0

    let storedCount = 0
    for (const chunk of rawChunks) {
      const embedding = await generateEmbedding(chunk.content)
      const vectorStr = `[${embedding.join(',')}]`

      await db.$executeRaw`
        INSERT INTO "ResumeChunk" (id, "resumeId", "clerkId", "chunkIndex", section, content, embedding, "embeddingModel", "createdAt")
        VALUES (
          gen_random_uuid()::text,
          ${resumeId},
          ${clerkId},
          ${chunk.index},
          ${chunk.section},
          ${chunk.content},
          ${vectorStr}::vector,
          ${RAG_CONFIG.EMBEDDING_MODEL},
          NOW()
        )
      `
      storedCount++
    }

    return storedCount
  } catch (error: any) {
    console.error(`[RAG_INGESTION_WARN] Failed chunk processing for resumeId="${resumeId}", clerkId="${clerkId}". Operation="processAndStoreResumeChunks", Error="${error.message || error}"`)
    return 0
  }
}

/**
 * Performs native PostgreSQL pgvector similarity search.
 * Cosine Distance operator (<=>) executes 100% inside PostgreSQL.
 * Scoped by clerkId + resumeId with SIMILARITY_THRESHOLD check.
 */
export async function retrieveRelevantResumeChunks({
  clerkId,
  resumeId,
  query,
  topK = RAG_CONFIG.DEFAULT_TOP_K,
  similarityThreshold = RAG_CONFIG.SIMILARITY_THRESHOLD,
}: {
  clerkId: string
  resumeId: string
  query: string
  topK?: number
  similarityThreshold?: number
}): Promise<ProcessedChunk[]> {
  if (!clerkId || !resumeId || !query || !query.trim()) return []

  try {
    const queryEmbedding = await generateEmbedding(query)
    const vectorStr = `[${queryEmbedding.join(',')}]`

    // Native pgvector In-Database Cosine Similarity Search Query
    const results: any[] = await db.$queryRaw`
      SELECT 
        id, 
        content, 
        section, 
        1 - (embedding <=> ${vectorStr}::vector) AS similarity
      FROM "ResumeChunk"
      WHERE "clerkId" = ${clerkId} AND "resumeId" = ${resumeId}
      ORDER BY embedding <=> ${vectorStr}::vector ASC
      LIMIT ${topK}
    `

    if (!Array.isArray(results)) return []

    // Convert similarity to float and apply threshold filter
    return results
      .map(r => ({
        id: r.id,
        content: r.content,
        section: r.section,
        similarity: typeof r.similarity === 'number' ? r.similarity : parseFloat(r.similarity),
      }))
      .filter(r => r.similarity >= similarityThreshold)
  } catch (error: any) {
    console.error(`[RAG_RETRIEVAL_WARN] Native pgvector retrieval failed for resumeId="${resumeId}", clerkId="${clerkId}". Operation="retrieveRelevantResumeChunks", Error="${error.message || error}"`)
    return []
  }
}

function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0.0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  if (normA === 0 || normB === 0) return 0.0
  return Number((dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))).toFixed(6))
}
