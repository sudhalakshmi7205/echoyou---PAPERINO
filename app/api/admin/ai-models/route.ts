import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { isAdminEmail } from '@/lib/adminAuth'
import { getAllFeatureModels, setFeatureModel, AVAILABLE_AI_MODELS, AI_FEATURE_METADATA, AIFeatureKey } from '@/lib/aiModelConfig'

export async function GET() {
  const user = await currentUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress
  const isAdmin = isAdminEmail(userEmail)

  return NextResponse.json({
    success: true,
    isAdmin,
    availableModels: AVAILABLE_AI_MODELS,
    featureMetadata: AI_FEATURE_METADATA,
    featureModels: getAllFeatureModels()
  })
}

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    const userEmail = user?.emailAddresses?.[0]?.emailAddress

    if (!isAdminEmail(userEmail)) {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 403 })
    }

    const { featureKey, modelId } = await req.json()
    if (!featureKey || !modelId) {
      return NextResponse.json({ error: 'Missing featureKey or modelId' }, { status: 400 })
    }

    const updatedFeatureModels = setFeatureModel(featureKey as AIFeatureKey, modelId)

    return NextResponse.json({
      success: true,
      message: `Model for ${featureKey} updated to ${modelId}`,
      featureModels: updatedFeatureModels
    })

  } catch (error: any) {
    console.error('Error updating AI model config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
