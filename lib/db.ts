import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined
}

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL

function createPrismaClient() {
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = createPrismaClient()
  }
  prisma = global.cachedPrisma
}

export const db = prisma
