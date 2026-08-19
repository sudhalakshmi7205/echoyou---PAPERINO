import 'dotenv/config'
import { db } from '../lib/db'

async function check() {
  try {
    const res: any = await db.$queryRaw`SELECT count(*) FROM "ResumeChunk"`
    console.log('EXISTING_RESUME_CHUNK_COUNT:', res[0]?.count?.toString())
  } catch (err: any) {
    console.log('TABLE_DOES_NOT_EXIST_OR_EMPTY:', err.message)
  }
}

check()
