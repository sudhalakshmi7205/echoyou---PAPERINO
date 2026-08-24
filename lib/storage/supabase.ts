import { createClient } from '@supabase/supabase-js'

const BUCKET_NAME = 'resumes'

// Server-Side Only: Never leak SUPABASE_SERVICE_ROLE_KEY to client/browser
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new Error('[STORAGE_ERROR] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  })
}

/**
 * Uploads a private PDF buffer to the Supabase "resumes" private bucket.
 */
export async function uploadPrivateResume(
  clerkId: string,
  fileName: string,
  buffer: Buffer
): Promise<string> {
  const supabase = getSupabaseAdmin()

  // Ensure bucket exists or handle private storage
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const storageKey = `${clerkId}/${Date.now()}_${sanitizedName}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storageKey, buffer, {
      contentType: 'application/pdf',
      upsert: true
    })

  if (error) {
    console.error('[STORAGE_UPLOAD_ERROR] Failed uploading object to private bucket:', error)
    throw new Error(`Failed to upload resume to private storage: ${error.message}`)
  }

  return storageKey
}

/**
 * Downloads/streams a private resume PDF buffer from Supabase Private Storage.
 */
export async function getPrivateResumeBuffer(storageKey: string): Promise<Buffer | null> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(storageKey)

  if (error || !data) {
    console.error(`[STORAGE_FETCH_ERROR] Key="${storageKey}", Error:`, error)
    return null
  }

  const arrayBuffer = await data.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Deletes a private resume file from Supabase Private Storage.
 */
export async function deletePrivateResume(storageKey: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storageKey])

  if (error) {
    console.error(`[STORAGE_DELETE_ERROR] Key="${storageKey}", Error:`, error)
    return false
  }

  return true
}
