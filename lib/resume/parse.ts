export async function extractTextFromPDF(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const _require = eval('require')
  
  // Force reload from disk to get the newly installed v1.1.1
  try {
    const resolvedPath = _require.resolve('pdf-parse')
    delete _require.cache[resolvedPath]
  } catch(e) {}
  
  const pdf = _require('pdf-parse')
  const data = await pdf(buffer)
  return data.text
}
