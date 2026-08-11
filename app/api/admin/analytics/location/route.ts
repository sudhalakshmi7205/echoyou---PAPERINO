import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

export async function GET() {
  const clerkUser = await currentUser()
  if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await db.user.findUnique({ where: { clerkId: clerkUser.id } })
  if (!user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const [byCountry, byCity, byRegion, recent] = await Promise.all([
    // Group by country
    db.user.groupBy({
      by: ['country', 'countryCode'],
      _count: { id: true },
      where: { country: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    }),

    // Group by city
    db.user.groupBy({
      by: ['city', 'country'],
      _count: { id: true },
      where: { city: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 15,
    }),

    // Group by region within country
    db.user.groupBy({
      by: ['region', 'country'],
      _count: { id: true },
      where: { region: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 15,
    }),

    // Recent signups with location
    db.user.findMany({
      where: { country: { not: null } },
      select: {
        id: true, firstName: true, email: true,
        city: true, country: true, countryCode: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const total = await db.user.count()
  const withLocation = await db.user.count({ where: { country: { not: null } } })

  return NextResponse.json({
    total,
    withLocation,
    byCountry: byCountry.map(r => ({
      country:     r.country,
      countryCode: r.countryCode,
      count:       r._count.id,
      pct:         total > 0 ? Math.round((r._count.id / total) * 100) : 0,
    })),
    byCity: byCity.map(r => ({
      city: r.city,
      country: r.country,
      count: r._count.id
    })),
    byRegion: byRegion.map(r => ({
      region: r.region,
      country: r.country,
      count: r._count.id
    })),
    recent,
  })
}
