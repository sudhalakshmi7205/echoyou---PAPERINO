import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import HistoryClient from './_components/HistoryClient'

export default async function InterviewsHistoryPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const interviews = await db.interview.findMany({
    where: { clerkId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
    include: { report: true }
  })

  return <HistoryClient interviews={interviews} />
}
