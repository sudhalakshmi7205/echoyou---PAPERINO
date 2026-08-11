import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import LobbyShell from './_components/LobbyShell'

export default async function LobbyPage({
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

  // Mark as ready when user enters lobby
  await db.interview.update({
    where: { id: resolvedParams.id },
    data: { status: 'ready' }
  })

  return <LobbyShell interview={interview} />
}
