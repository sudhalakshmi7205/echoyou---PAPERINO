export const RAG_CONFIG = {
  EMBEDDING_MODEL: 'all-MiniLM-L6-v2',
  EMBEDDING_DIMENSION: 384,
  DEFAULT_TOP_K: 3, // Configurable 3-5
  SIMILARITY_THRESHOLD: 0.35, // Configurable Cosine Similarity threshold (0.0 to 1.0)
  CHUNK_SIZE: 400,
  CHUNK_OVERLAP: 50,
}
