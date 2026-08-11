import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import ResumeFollowupUploader from './_components/ResumeFollowupUploader'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ResumeFollowupsPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const profile = await db.profile.findUnique({
    where: { clerkId: user.id }
  })

  const activeResume = await db.resume.findFirst({
    where: { clerkId: user.id, isActive: true },
    select: { id: true, fileName: true }
  })

  if (!profile) redirect('/onboarding')

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0E14] relative overflow-hidden flex flex-col items-center justify-center py-12">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-3xl px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Instant Resume Follow-up Interview
          </h1>
          <p className="text-gray-400 text-lg">
            Upload your resume and instantly begin an AI interview tailored directly to your work experience.
          </p>
        </div>

        <div className="bg-[#111620] border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <ResumeFollowupUploader 
            clerkId={user.id} 
            role={profile.role || 'Software Engineer'} 
            activeResume={activeResume}
          />
        </div>
      </div>
    </div>
  )
}
