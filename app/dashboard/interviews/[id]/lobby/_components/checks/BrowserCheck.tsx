'use client'
import CheckRow from '../CheckRow'
import { CheckResult } from '../LobbyShell'
import { Globe } from 'lucide-react'

export default function BrowserCheck({ result }: { result: CheckResult }) {
  return (
    <CheckRow result={result} icon={Globe} name="Browser Compatibility" />
  )
}
