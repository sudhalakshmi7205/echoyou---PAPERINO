import { RAG_CONFIG } from './config'

export interface ChunkResult {
  content: string
  section: string
  index: number
}

/**
 * Splits raw parsed resume text into section-aware, meaningful chunks.
 * Identifies standard headers (Experience, Projects, Education, Skills, Summary).
 */
export function splitResumeIntoChunks(
  text: string,
  chunkSize = RAG_CONFIG.CHUNK_SIZE,
  overlap = RAG_CONFIG.CHUNK_OVERLAP
): ChunkResult[] {
  if (!text || !text.trim()) return []

  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean)

  const sectionKeywords: Record<string, RegExp> = {
    Experience: /^(work\s+experience|professional\s+experience|employment|experience|history)/i,
    Projects: /^(projects|personal\s+projects|key\s+projects|portfolio)/i,
    Education: /^(education|academic\s+background|academic\s+history|qualifications)/i,
    Skills: /^(technical\s+skills|skills|technologies|competencies|areas\s+of\s+expertise)/i,
    Summary: /^(summary|about\s+me|profile|professional\s+summary|objective)/i,
  }

  const sections: { section: string; lines: string[] }[] = []
  let currentSection = 'General'
  let currentLines: string[] = []

  for (const line of lines) {
    let matchedSection: string | null = null
    for (const [secName, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(line)) {
        matchedSection = secName
        break
      }
    }

    if (matchedSection) {
      if (currentLines.length > 0) {
        sections.push({ section: currentSection, lines: currentLines })
        currentLines = []
      }
      currentSection = matchedSection
    } else {
      currentLines.push(line)
    }
  }

  if (currentLines.length > 0) {
    sections.push({ section: currentSection, lines: currentLines })
  }

  const chunks: ChunkResult[] = []
  let chunkIndex = 0

  for (const sec of sections) {
    const sectionText = sec.lines.join(' ')
    if (sectionText.length <= chunkSize) {
      chunks.push({
        content: sectionText,
        section: sec.section,
        index: chunkIndex++,
      })
    } else {
      let start = 0
      while (start < sectionText.length) {
        const end = Math.min(start + chunkSize, sectionText.length)
        const chunkText = sectionText.slice(start, end).trim()
        if (chunkText.length > 20) {
          chunks.push({
            content: chunkText,
            section: sec.section,
            index: chunkIndex++,
          })
        }
        start += chunkSize - overlap
      }
    }
  }

  return chunks
}
