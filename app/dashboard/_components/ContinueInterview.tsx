import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'

export default function ContinueInterview({ interview }: { interview: any }) {
  if (!interview || interview.status !== 'in_progress') return null

  return (
    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-800 text-purple-100 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              In Progress
            </span>
            <span className="text-purple-200 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" /> Started {new Date(interview.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">
            {interview.role} Interview {interview.company ? `at ${interview.company}` : ''}
          </h2>
          <p className="text-purple-200">
            You were in the middle of a {interview.type.replace('_', ' ')} round.
          </p>
        </div>

        <Link
          href={`/interview/${interview.id}`}
          className="flex items-center justify-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shrink-0"
        >
          Resume Interview <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
