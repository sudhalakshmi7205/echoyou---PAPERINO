import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const pdf = require('pdf-parse/lib/pdf-parse.js')
    return NextResponse.json({ type: typeof pdf })
  } catch (error: any) {
    return NextResponse.json({ error: error.message })
  }
}
