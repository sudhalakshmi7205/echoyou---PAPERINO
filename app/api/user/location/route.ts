import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { geocodeIP } from '@/lib/geo/geocode'

export async function POST(req: Request) {
  try {
    const { clerkId, ip } = await req.json()
    if (!clerkId || !ip) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const existing = await db.user.findUnique({
      where: { clerkId },
      select: { ipAddress: true }
    })

    // Only re-geocode if IP changed
    if (existing?.ipAddress === ip) {
      return NextResponse.json({ success: true, updated: false })
    }

    const location = await geocodeIP(ip)
    if (!location) {
      return NextResponse.json({ success: false, reason: 'Geocode failed' })
    }

    await db.user.update({
      where: { clerkId },
      data: {
        ipAddress:   ip,
        city:        location.city,
        region:      location.region,
        country:     location.country,
        countryCode: location.countryCode,
        latitude:    location.latitude,
        longitude:   location.longitude,
      }
    })

    return NextResponse.json({ success: true, updated: true })
  } catch (error) {
    console.error("Location update failed:", error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}
