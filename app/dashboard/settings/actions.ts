'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function getWebhook() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  const webhook = await db.webhook.findUnique({
    where: { clerkId: user.id }
  })

  return webhook
}

export async function saveWebhook(url: string, isActive: boolean) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  await db.webhook.upsert({
    where: { clerkId: user.id },
    update: { url, isActive },
    create: { clerkId: user.id, url, isActive }
  })

  revalidatePath('/dashboard/settings')
}

export async function getPreferences() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  let prefs = await db.userPreferences.findUnique({
    where: { clerkId: user.id }
  })

  if (!prefs) {
    prefs = await db.userPreferences.create({
      data: { clerkId: user.id }
    })
  }
  return prefs
}

export async function savePreferences(data: any) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  await db.userPreferences.update({
    where: { clerkId: user.id },
    data
  })

  revalidatePath('/dashboard/settings/preferences')
  revalidatePath('/dashboard/settings/notifications')
}
