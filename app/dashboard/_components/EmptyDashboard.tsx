import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function EmptyDashboard({ role }: { role?: string | null }) {
  const displayRole = role || 'software engineering'

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-sm mt-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-48 bg-gradient-to-b from-purple-50 to-transparent -z-10 rounded-[100%]" />
      
      <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
        <Sparkles className="w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Ready for your first {displayRole} interview?
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
        Your profile is set up and we're ready to test your skills. Jump into a simulated technical round and get real-time feedback.
      </p>
      
      <Link 
        href="/dashboard/interviews/new"
        className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        Start your first interview <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  )
}
