import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

export async function GET() {
  const clerkUser = await currentUser()
  if (!clerkUser) return new Response("Unauthorized", { status: 401 })

  const user = await db.user.findUnique({ where: { clerkId: clerkUser.id } })
  if (!user?.isAdmin) return new Response("Forbidden", { status: 403 })

  const users = await db.user.findMany({
    where: { country: { not: null } },
    select: {
      email: true, firstName: true, lastName: true,
      city: true, region: true, country: true,
      countryCode: true, createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  const headers = ['Email','First name','Last name','City','Region','Country','Country code','Joined']
  const rows = users.map(u => [
    u.email, u.firstName, u.lastName,
    u.city, u.region, u.country,
    u.countryCode,
    new Date(u.createdAt).toLocaleDateString()
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${v ?? ''}"`).join(','))
    .join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="echo-users-by-location.csv"'
    }
  })
}
