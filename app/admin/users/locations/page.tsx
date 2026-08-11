import LocationDashboard from './_components/LocationDashboard'
import { db } from '@/lib/db'

export default async function LocationsPage() {
  const [byCountry, byCity, byRegion, recent] = await Promise.all([
    db.user.groupBy({
      by: ['country', 'countryCode'],
      _count: { id: true },
      where: { country: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    }),
    db.user.groupBy({
      by: ['city', 'country'],
      _count: { id: true },
      where: { city: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 15,
    }),
    db.user.groupBy({
      by: ['region', 'country'],
      _count: { id: true },
      where: { region: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 15,
    }),
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

  const data = {
    total,
    withLocation,
    byCountry: byCountry.map((r: any) => ({
      country:     r.country,
      countryCode: r.countryCode,
      count:       r._count.id,
      pct:         total > 0 ? Math.round((r._count.id / total) * 100) : 0,
    })),
    byCity: byCity.map((r: any) => ({
      city: r.city,
      country: r.country,
      count: r._count.id
    })),
    byRegion: byRegion.map((r: any) => ({
      region: r.region,
      country: r.country,
      count: r._count.id
    })),
    recent: recent.map((r: any) => ({
      ...r,
      createdAt: r.createdAt.toISOString()
    })),
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">User Location Analytics</h1>
          <p className="text-sm text-gray-400 mt-1">Where your users are signing up from</p>
        </div>
        <a 
          href="/api/admin/analytics/location/export" 
          download
          className="px-4 py-2 border border-gray-700 bg-[#111620] hover:bg-gray-800 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </a>
      </div>

      <LocationDashboard data={data} />
    </div>
  )
}
