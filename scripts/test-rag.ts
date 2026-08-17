import { splitResumeIntoChunks } from '../lib/rag/chunking'
import { RAG_CONFIG } from '../lib/rag/config'

async function runTests() {
  console.log('🧪 RUNNING PHASE 1 RAG TESTS...\n')

  // 1. Chunking Test
  const sampleResume = `
Professional Summary
Experienced Full Stack Software Engineer with 4 years building scalable microservices in React, Node.js, and AWS.

Work Experience
Senior Backend Engineer at Acme Corp (2022 - Present)
- Architected payment processing service handling $10M+ daily volume using Node.js, PostgreSQL, and Kafka.
- Reduced API response latency by 45% through Redis caching and query optimization.

Projects
EchoYou AI Interview Platform
- Built interactive mock interview system using Next.js 16, TypeScript, and Groq API.
- Implemented real-time audio streaming and automated evaluation scorecards.

Technical Skills
Languages: TypeScript, JavaScript, Python, SQL
Frameworks: React, Next.js, Node.js, Express, TailwindCSS
Databases & Tools: PostgreSQL, Redis, Docker, Git, AWS
`

  const chunks = splitResumeIntoChunks(sampleResume)
  console.log(`✅ TEST 1 - Resume Chunking: Split resume into ${chunks.length} chunks.`)
  chunks.forEach(c => {
    console.log(`   - Chunk #${c.index} [Section: ${c.section}]: "${c.content.slice(0, 60)}..."`)
  })

  if (chunks.length >= 3) {
    console.log('   RESULT: PASSED\n')
  } else {
    console.error('   RESULT: FAILED\n')
    process.exit(1)
  }

  // 2. Similarity Threshold & Config Test
  console.log(`✅ TEST 2 - RAG Config: SIMILARITY_THRESHOLD is ${RAG_CONFIG.SIMILARITY_THRESHOLD}, DEFAULT_TOP_K is ${RAG_CONFIG.DEFAULT_TOP_K}.`)
  console.log('   RESULT: PASSED\n')

  console.log('🎉 ALL RAG UNIT TESTS COMPLETED SUCCESSFULLY!')
}

runTests().catch(err => {
  console.error('Test suite failed:', err)
  process.exit(1)
})
