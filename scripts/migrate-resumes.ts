import 'dotenv/config'
import { db } from '../lib/db'
import { uploadPrivateResume } from '../lib/storage/supabase'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

async function runMigration() {
  console.log('🔄 STARTING HISTORICAL RESUME FILE MIGRATION TO PRIVATE SUPABASE BUCKET...\n')

  const resumesWithoutStorageKey = await db.resume.findMany({
    where: { storageKey: null }
  })

  console.log(`Found ${resumesWithoutStorageKey.length} resume record(s) needing storage key migration.`)

  let migratedCount = 0
  let skippedCount = 0

  for (const resume of resumesWithoutStorageKey) {
    if (!resume.fileUrl || !resume.fileUrl.startsWith('/uploads/')) {
      skippedCount++
      continue
    }

    const localPath = join(process.cwd(), 'public', resume.fileUrl)
    if (existsSync(localPath)) {
      try {
        const fileBuffer = readFileSync(localPath)
        const storageKey = await uploadPrivateResume(resume.clerkId, resume.fileName, fileBuffer)

        await db.resume.update({
          where: { id: resume.id },
          data: {
            storageKey,
            fileUrl: `/api/resume/file?id=${resume.id}`
          }
        })
        migratedCount++
        console.log(`  - Migrated resume ID "${resume.id}" -> StorageKey: "${storageKey}"`)
      } catch (err: any) {
        console.error(`  - Failed to migrate resume ID "${resume.id}":`, err.message)
      }
    } else {
      skippedCount++
      console.log(`  - Local physical file missing for resume ID "${resume.id}" (${resume.fileUrl}). Preserving record safely.`)
    }
  }

  console.log(`\n✅ MIGRATION COMPLETE: ${migratedCount} migrated, ${skippedCount} preserved/skipped.`)
}

runMigration().catch(console.error)
