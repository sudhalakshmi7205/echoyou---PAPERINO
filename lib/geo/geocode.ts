export interface LocationData {
  city:        string
  region:      string
  country:     string
  countryCode: string
  latitude:    number
  longitude:   number
  isp:         string
  timezone:    string
}

export async function geocodeIP(ip: string): Promise<LocationData | null> {
  // Skip private/local IPs
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return null
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,regionName,country,countryCode,lat,lon,isp,timezone`,
      { next: { revalidate: 0 } }
    )
    const data = await res.json()

    if (data.status !== 'success') return null

    return {
      city:        data.city,
      region:      data.regionName,
      country:     data.country,
      countryCode: data.countryCode,
      latitude:    data.lat,
      longitude:   data.lon,
      isp:         data.isp,
      timezone:    data.timezone,
    }
  } catch {
    return null
  }
}
