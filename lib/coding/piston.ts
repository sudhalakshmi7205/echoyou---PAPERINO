const PISTON_URL = 'https://emkc.org/api/v2/piston'

export interface ExecuteRequest {
  language: string
  version: string
  code: string
  stdin?: string
}

export interface ExecuteResult {
  stdout: string
  stderr: string
  exitCode: number
  executionMs: number
}

// Language → Piston runtime mapping
export const LANGUAGE_RUNTIMES: Record<string, { language: string; version: string }> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3'  },
  python:     { language: 'python',     version: '3.10.0' },
  go:         { language: 'go',         version: '1.16.2' },
  java:       { language: 'java',       version: '15.0.2' },
  cpp:        { language: 'c++',        version: '10.2.0' },
  rust:       { language: 'rust',       version: '1.50.0' },
  ruby:       { language: 'ruby',       version: '3.0.1'  },
}

export async function executeCode(req: ExecuteRequest): Promise<ExecuteResult> {
  const runtime = LANGUAGE_RUNTIMES[req.language]
  if (!runtime) throw new Error(`Unsupported language: ${req.language}`)

  const res = await fetch(`${PISTON_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: runtime.language,
      version: runtime.version,
      files: [{ content: req.code }],
      stdin: req.stdin ?? '',
      run_timeout: 5000,   // 5 second hard limit
      compile_timeout: 10000,
    }),
  })

  if (!res.ok) throw new Error(`Piston error: ${res.status}`)

  const data = await res.json()
  return {
    stdout: data.run?.stdout ?? '',
    stderr: data.run?.stderr ?? data.compile?.stderr ?? '',
    exitCode: data.run?.code ?? 1,
    executionMs: data.run?.cpu_time ?? 0,
  }
}
