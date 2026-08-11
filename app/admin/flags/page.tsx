import { db } from '@/lib/db'
import { Flag, CheckCircle, AlertTriangle, MessageSquare, Video } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminFlagsPage() {
  const flags: any[] = []

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Flag className="w-6 h-6 text-red-400" />
          Flagged Sessions
        </h1>
        <p className="text-gray-400 text-sm mt-1">Review sessions flagged for abuse, inappropriate content, or jailbreaks.</p>
      </div>

      <div className="bg-[#111620] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0B0E14] text-gray-400 border-b border-gray-800 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Session ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {flags.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 flex-col items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-500/50 mx-auto mb-3" />
                    All clear! No flagged sessions currently require moderation.
                  </td>
                </tr>
              ) : flags.map(flag => {
                return (
                  <tr key={flag.id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 capitalize">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {flag.reason.replace('_', ' ')}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <p className="text-gray-300 max-w-xs truncate" title={flag.details || ''}>
                        {flag.details || 'No additional details provided.'}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500 font-mono bg-gray-800/50 px-2 py-1 rounded w-max border border-gray-700">
                        {flag.interviewId.slice(-8)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {flag.resolved ? (
                        <span className="text-emerald-400 text-xs font-semibold">Resolved</span>
                      ) : (
                        <span className="text-yellow-400 text-xs font-semibold animate-pulse">Needs Review</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(flag.createdAt).toLocaleDateString()}
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors" title="View Transcript">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors" title="View Session Details">
                          <Video className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
