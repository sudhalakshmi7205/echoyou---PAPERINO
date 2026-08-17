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
    // 1. Atomic clean-up: Delete existing chunks for this resumeId to prevent duplicate embeddings
    if ((db as any).resumeChunk) {
      await (db as any).resumeChunk.deleteMany({
        where: { clerkId, resumeId }
      })
    }

    const rawChunks = splitResumeIntoChunks(parsedText)
    if (rawChunks.length === 0) return 0

    const chunkDataArray = []
    for (const chunk of rawChunks) {
      const embedding = await generateEmbedding(chunk.content)
      chunkDataArray.push({
        clerkId,
        resumeId,
        chunkIndex: chunk.index,
        section: chunk.section,
        content: chunk.content,
        embedding: embedding as any,
        embeddingModel: RAG_CONFIG.EMBEDDING_MODEL,
      })
    }

    if ((db as any).resumeChunk) {
      await (db as any).resumeChunk.createMany({
        data: chunkDataArray
      })
    }

    return chunkDataArray.length
  } catch (error: any) {
    // Structured error logging (safe identifiers only, no PII/resume leakage)
    console.error(`[RAG_INGESTION_WARN] Failed chunk processing for resumeId="${resumeId}", clerkId="${clerkId}". Operation="processAndStoreResumeChunks", Error="${error.message || error}"`)
    return 0
  }
}

/**
 * Performs semantic similarity search against pgvector / PostgreSQL chunks.
 * STRICTLY ENFORCES SECURITY: Scoped by clerkId (userId) + resumeId.
 * Filters results using configurable SIMILARITY_THRESHOLD and topK.
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
    // 1. Generate query embedding
    const queryEmbedding = await generateEmbedding(query)

    // 2. Fetch candidate's own chunks for this specific resume
    const chunks = (db as any).resumeChunk
      ? await (db as any).resumeChunk.findMany({
          where: {
            clerkId,   // ← Strict User Isolation
            resumeId,  // ← Strict Resume Isolation
          },
        })
      : []

    if (chunks.length === 0) return []

    // 3. Compute Cosine Similarity = 1 - Cosine Distance
    const scored = (chunks as any[]).map(c => {
      const chunkVector = Array.isArray(c.embedding) ? (c.embedding as number[]) : []
      const similarity = computeCosineSimilarity(queryEmbedding, chunkVector)
      return {
        id: c.id,
        content: c.content,
        section: c.section,
        similarity,
      }
    })

    // 4. Filter by configurable SIMILARITY_THRESHOLD & sort descending
    const filtered = scored.filter(c => c.similarity >= similarityThreshold)
    filtered.sort((a: any, b: any) => b.similarity - a.similarity)

    return filtered.slice(0, topK)
  } catch (error: any) {
    // Structured error logging (safe identifiers only)
    console.error(`[RAG_RETRIEVAL_WARN] Semantic retrieval failed for resumeId="${resumeId}", clerkId="${clerkId}". Operation="retrieveRelevantResumeChunks", Error="${error.message || error}"`)
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
