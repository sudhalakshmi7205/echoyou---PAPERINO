import { RAG_CONFIG } from './config'

/**
 * Generates 384-dimensional dense semantic embeddings using HuggingFace Inference API
 * model: sentence-transformers/all-MiniLM-L6-v2.
 * NO feature-hashing fallback — if embedding generation fails, throws an error so RAG is marked unavailable.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || !text.trim()) {
    throw new Error('[RAG_EMBEDDING_ERROR] Empty text string provided for embedding generation')
  }

  const hfToken = process.env.HUGGINGFACE_API_KEY

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(hfToken ? { Authorization: `Bearer ${hfToken}` } : {}),
        },
        body: JSON.stringify({
          inputs: text.slice(0, 1000), // Max 1000 chars for prompt safety
          options: { wait_for_model: true },
        }),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`[RAG_EMBEDDING_API_FAIL] HTTP ${response.status}: ${errText}`)
    }

    const result = await response.json()
    
    // Result can be [ float[] ] or float[] depending on HF response wrapping
    let embedding: number[] = []
    if (Array.isArray(result) && Array.isArray(result[0])) {
      embedding = result[0]
    } else if (Array.isArray(result)) {
      embedding = result
    }

    if (!embedding || embedding.length !== RAG_CONFIG.EMBEDDING_DIMENSION) {
      throw new Error(`[RAG_EMBEDDING_DIMENSION_MISMATCH] Received vector of dimension ${embedding?.length}, expected ${RAG_CONFIG.EMBEDDING_DIMENSION}`)
    }

    return embedding
  } catch (error: any) {
    // Re-throw so callers can catch, log structured safe identifiers, and gracefully fall back
    throw new Error(`[RAG_EMBEDDING_ERROR] ${error.message || error}`)
  }
}
