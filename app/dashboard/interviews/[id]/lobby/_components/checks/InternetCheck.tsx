'use client'
import CheckRow from '../CheckRow'
import { CheckResult } from '../LobbyShell'
import { Wifi } from 'lucide-react'

export default function InternetCheck({ 
  result, 
  onRetry 
}: { 
  result: CheckResult, 
  onRetry: () => void 
}) {
  return (
    <CheckRow result={result} icon={Wifi} name="Internet Connection" onRetry={onRetry} />
  )
}
