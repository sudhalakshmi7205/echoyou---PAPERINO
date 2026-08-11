import { CheckResult } from './LobbyShell'
import { Loader2, CheckCircle2, XCircle, AlertCircle, RotateCw } from 'lucide-react'
import { ReactNode } from 'react'

export default function CheckRow({
  result,
  icon: Icon,
  name,
  onRetry,
  children
}: {
  result: CheckResult
  icon: any
  name: string
  onRetry?: () => void
  children?: ReactNode
}) {
  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
      result.status === 'pass' ? 'border-green-500/30 bg-green-500/5' :
      result.status === 'fail' ? 'border-red-500/30 bg-red-500/5' :
      result.status === 'checking' ? 'border-purple-500/50 bg-purple-500/10' :
      'border-gray-800 bg-[#2A2A2A]'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
          result.status === 'pass' ? 'bg-green-500/20 text-green-400' :
          result.status === 'fail' ? 'bg-red-500/20 text-red-400' :
          result.status === 'checking' ? 'bg-purple-500/20 text-purple-400' :
          'bg-gray-800 text-gray-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div>
          <h3 className="font-medium text-gray-200">{name}</h3>
          <p className="text-sm text-gray-500">{result.detail}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {children}

        <div className="w-8 flex justify-end">
          {result.status === 'idle' && <AlertCircle className="w-5 h-5 text-gray-600" />}
          {result.status === 'checking' && <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />}
          {result.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          {result.status === 'fail' && (
            <div className="flex items-center gap-2">
              {onRetry && (
                <button onClick={onRetry} className="p-1 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white" title="Retry">
                  <RotateCw className="w-4 h-4" />
                </button>
              )}
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
