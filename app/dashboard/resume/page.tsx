import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import EchoATSClient from './_components/EchoATSClient'

export const dynamic = 'force-dynamic'

export default async function ResumePage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const [resumes, atsHistory, todayScansCount] = await Promise.all([
    db.resume.findMany({
      where: { clerkId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        skills: true,
        aiSummary: true
      }
    }),
    db.resumeATSAnalysis.findMany({
      where: { clerkId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        resumeId: true,
        targetRole: true,
        jobDescription: true,
        matchScore: true,
        formatScore: true,
        keywordScore: true,
        missingKeywords: true,
        feedback: true,
        createdAt: true
      }
    }),
    db.resumeATSAnalysis.count({
      where: {
        clerkId: user.id,
        createdAt: { gte: startOfDay }
      }
    })
  ])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#071a17] relative overflow-hidden">
      {/* Deep Ocean Glowing Waves Background */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#2dd4bf]/12 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#0f766e]/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-500/12 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 py-10 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link href="/dashboard" className="p-2 sm:p-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl text-emerald-400 hover:text-emerald-200 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-white flex flex-wrap items-center gap-2 sm:gap-3 tracking-tight">
              <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-400 shrink-0" />
              <span>EchoATS</span> 
              <span className="text-purple-400 font-mono text-xs sm:text-xl block sm:inline">— Cyber Resume Analyzer</span>
            </h1>
            <p className="text-zinc-400 mt-1 text-[11px] sm:text-xs max-w-2xl leading-relaxed">
              Evaluate general ATS compatibility or match your resume against target Job Descriptions with real-time AI keyword density checks.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <EchoATSClient 
            resumes={resumes} 
            history={atsHistory as any} 
            clerkId={user.id} 
            todayScansCount={todayScansCount}
          />
        </div>
      </div>
    </div>
  )
}
