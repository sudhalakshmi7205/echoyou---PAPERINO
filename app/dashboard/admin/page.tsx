import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isAdminEmail, ADMIN_EMAIL } from '@/lib/adminAuth'
import AdminDashboardView from './_components/AdminDashboardView'

export default async function AdminPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const userEmail = user.emailAddresses?.[0]?.emailAddress

  // Strict Admin Email Enforcement: Only sudharajsekar2005@gmail.com can access!
  if (!isAdminEmail(userEmail)) {
    redirect('/dashboard')
  }

  return <AdminDashboardView adminEmail={userEmail || ADMIN_EMAIL} />
}
