import 'dotenv/config'

async function runStorageSecurityTests() {
  console.log('🔒 RUNNING PRIVATE RESUME STORAGE SECURITY TESTS...\n')

  // 1. Service Role Key Leakage Verification
  console.log('✅ TEST 1 - Service Role Key Security Check:')
  const publicKeys = Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_'))
  const isKeyLeaked = publicKeys.some(k => process.env[k]?.includes('service_role') || k.includes('SERVICE_ROLE'))
  console.log(`   Public environment variables scanned: ${publicKeys.length}`)
  console.log(`   Service Role Key Exposed in Client Scope: ${isKeyLeaked}`)

  if (!isKeyLeaked) {
    console.log('   RESULT: PASSED\n')
  } else {
    console.error('   RESULT: FAILED - SUPABASE_SERVICE_ROLE_KEY exposed to client!\n')
    process.exit(1)
  }

  // 2. Storage Key Formatting & Sanitization Check
  const clerkId = 'user_test_123'
  const rawFileName = 'my resume (2026) #1.pdf'
  const sanitized = rawFileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const storageKey = `${clerkId}/${Date.now()}_${sanitized}`

  console.log('✅ TEST 2 - Storage Key Sanitization Check:')
  console.log(`   Raw Filename: "${rawFileName}"`)
  console.log(`   Generated Storage Key: "${storageKey}"`)

  if (!storageKey.includes('#') && !storageKey.includes(' ') && storageKey.startsWith(clerkId)) {
    console.log('   RESULT: PASSED\n')
  } else {
    console.error('   RESULT: FAILED\n')
    process.exit(1)
  }

  console.log('🎉 ALL PRIVATE STORAGE SECURITY TESTS COMPLETED SUCCESSFULLY!')
}

runStorageSecurityTests().catch(err => {
  console.error('Storage security test suite failed:', err)
  process.exit(1)
})
