import { Resume } from '@prisma/client'
import { Sparkles, Trash2, Download } from 'lucide-react'
import ResumeActions from './ResumeActions'

export default function AISummaryCard({ resume, clerkId }: { resume: Resume, clerkId: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-gray-900">AI Intelligence</h2>
        </div>
        <ResumeActions clerkId={clerkId} fileUrl={resume.fileUrl} fileName={resume.fileName} />
      </div>
      
      <div className="p-5">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Professional Summary
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {resume.aiSummary || 'No summary could be generated.'}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Extracted Skills
          </h3>
          {resume.skills && resume.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No skills detected.</p>
          )}
        </div>
      </div>
    </div>
  )
}
