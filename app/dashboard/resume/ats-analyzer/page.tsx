import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import ATSAnalyzerClient from './_components/ATSAnalyzerClient'

export default async function ATSAnalyzerPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const resume = await db.resume.findFirst({
    where: { clerkId: user.id, isActive: true },
  })

  if (!resume) {
    redirect('/dashboard/resume')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ATS Match Analyzer</h1>
        <p className="text-gray-500 mt-1">
          Paste a Job Description below to see if your current resume (<span className="font-semibold">{resume.fileName}</span>) will pass the automated HR screening.
        </p>
      </div>
      <ATSAnalyzerClient resumeId={resume.id} />
    </div>
  )
}
