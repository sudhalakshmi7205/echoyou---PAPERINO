import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { isAdminEmail } from '@/lib/adminAuth'
import { getFeatureToggles, updateFeatureToggle, FeatureKey } from '@/lib/featureToggles'

export async function GET() {
  try {
    const user = await currentUser()
    const userEmail = user?.emailAddresses?.[0]?.emailAddress
    const isAdmin = isAdminEmail(userEmail)

    return NextResponse.json({
      success: true,
      isAdmin,
      toggles: getFeatureToggles()
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    const userEmail = user?.emailAddresses?.[0]?.emailAddress

    if (!isAdminEmail(userEmail)) {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 403 })
    }

    const { key, isEnabled } = await req.json()
    if (!key || typeof isEnabled !== 'boolean') {
      return NextResponse.json({ error: 'Missing key or isEnabled status' }, { status: 400 })
    }

    const updatedToggles = updateFeatureToggle(key as FeatureKey, isEnabled)

    return NextResponse.json({
      success: true,
      message: `Feature ${key} is now ${isEnabled ? 'ENABLED' : 'DISABLED'}`,
      toggles: updatedToggles
    })

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
