import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ResumeBuilderClient from './_components/ResumeBuilderClient'

export const dynamic = 'force-dynamic'

export default async function MyResumePage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    include: { profile: true }
  })

  if (!dbUser || !dbUser.profile) {
    redirect('/onboarding')
  }

  // Pass necessary initial data to the client component
  const initialData = {
    firstName: dbUser.firstName || '',
    lastName: dbUser.lastName || '',
    email: dbUser.email || '',
    role: dbUser.profile.role || '',
    aiBio: dbUser.profile.aiBio || '',
    languages: dbUser.profile.languages || [],
    companies: dbUser.profile.companies || [],
    githubUrl: dbUser.profile.githubUrl || '',
    linkedinUrl: dbUser.profile.linkedinUrl || '',
    portfolioUrl: dbUser.profile.portfolioUrl || '',
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0E14] relative">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
      <ResumeBuilderClient initialData={initialData} />
    </div>
  )
}
