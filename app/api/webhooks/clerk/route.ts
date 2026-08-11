import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  if (evt.type === 'user.created') {
    let ip = null
    try {
      const { clerkClient } = await import('@clerk/nextjs/server')
      const client = await clerkClient()
      const sessions = await client.sessions.getSessionList({ userId: evt.data.id })
      if (sessions.data && sessions.data.length > 0) {
        ip = sessions.data[0].latestActivity?.ipAddress || null
      }
    } catch (err) {
      console.error("Failed to fetch IP from clerk:", err)
    }

    const { geocodeIP } = await import('@/lib/geo/geocode')
    const location = ip ? await geocodeIP(ip) : null

    await db.user.create({
      data: {
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        imageUrl: evt.data.image_url,
        
        // Location fields
        ipAddress: ip,
        city: location?.city ?? null,
        region: location?.region ?? null,
        country: location?.country ?? null,
        countryCode: location?.countryCode ?? null,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,

        // create a profile automatically with onboardingCompleted: false
        profile: {
          create: {
            onboardingCompleted: false
          }
        }
      }
    })
  }

  if (evt.type === 'user.deleted') {
    await db.user.delete({ where: { clerkId: evt.data.id } })
  }

  return new Response('OK', { status: 200 })
}
