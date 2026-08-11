import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import InterviewForm from './_components/InterviewForm'
import RecentConfigs from './_components/RecentConfigs'
import TemplateSelector from './_components/TemplateSelector'
import { redirect } from 'next/navigation'

export default async function NewInterviewPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const user = await currentUser()
  if (!user) redirect('/sign-in')
  
  const params = await searchParams
  const type = params.type

  const [profile, recentInterviews, templates] = await Promise.all([
    db.profile.findUnique({ where: { clerkId: user.id } }),
    db.interview.findMany({
      where: { clerkId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id:true, type:true, role:true, company:true, difficulty:true, duration:true }
    }),
    db.interviewTemplate.findMany({
      where: { OR: [{ isPublic: true }, { clerkId: user.id }] },
      take: 6
    })
  ])

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Interview</h1>
        <p className="text-gray-500 text-lg">
          Configure your session — Echo will generate questions tailored to your choices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <InterviewForm clerkId={user.id} defaultRole={profile?.role} defaultType={type} />
        </div>
        <div className="flex flex-col gap-6">
          <TemplateSelector templates={templates} />
          <RecentConfigs interviews={recentInterviews} />
        </div>
      </div>
    </div>
  )
}
