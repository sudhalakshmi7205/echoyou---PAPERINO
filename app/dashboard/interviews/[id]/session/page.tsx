import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import SessionShell from './_components/SessionShell'

export default async function SessionPage({
  params
}: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const interview = await db.interview.findUnique({
    where: { id: resolvedParams.id, clerkId: user.id }
  })

  if (!interview) redirect('/dashboard')
  if (interview.status === 'completed') redirect(`/dashboard/interviews/${resolvedParams.id}/report`)

  return <SessionShell interview={interview} />
}
