import { db } from '@/lib/db'
import { Video, Clock, CheckCircle, AlertCircle, FileText, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminInterviewsPage() {
  const interviews = await db.interview.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // To map clerkIds to actual users, we can fetch all users
  const users = await db.user.findMany()
  const userMap = new Map(users.map((u: any) => [u.clerkId, u]))

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-cyan-400" />
            Interview Sessions
          </h1>
          <p className="text-gray-400 text-sm mt-1">Monitor all interview activity across the platform.</p>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur group-hover:bg-cyan-500/30 transition-colors" />
          <div className="relative bg-[#111620] border border-gray-700 rounded-lg flex items-center px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search sessions..." 
              className="bg-transparent border-none text-sm text-white focus:outline-none w-48"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#111620] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0B0E14] text-gray-400 border-b border-gray-800 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Role & Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {interviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No interviews found.
                  </td>
                </tr>
              ) : interviews.map((interview: any) => {
                const user = userMap.get(interview.clerkId)
                const isCompleted = interview.status === 'completed'
                const isInProgress = interview.status === 'in_progress'
                
                return (
                  <tr key={interview.id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={(user as any)?.imageUrl || '/placeholder.svg'} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full bg-gray-800"
                        />
                        <div>
                          <div className="font-semibold text-gray-200">
                            {user ? `${(user as any).firstName} ${(user as any).lastName}` : 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {interview.clerkId.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{interview.role}</div>
                      <div className="text-xs text-gray-400 capitalize">{interview.type.replace('_', ' ')} • {interview.difficulty}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : isInProgress ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Clock className="w-3.5 h-3.5 animate-pulse" /> In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                          <AlertCircle className="w-3.5 h-3.5" /> {interview.status}
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {interview.score !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${interview.score >= 80 ? 'bg-emerald-500' : interview.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${interview.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-300">{interview.score}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors" title="View Report">
                        <FileText className="w-4 h-4" />
                      </button>
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
