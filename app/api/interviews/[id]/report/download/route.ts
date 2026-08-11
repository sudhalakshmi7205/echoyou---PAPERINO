import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { generateReportPDF } from '@/lib/reports/pdf'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const user = await currentUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const interview = await db.interview.findUnique({
    where: { id: resolvedParams.id, clerkId: user.id }
  })
  
  if (!interview) return new NextResponse('Not found', { status: 404 })

  try {
    const pdfBuffer = await generateReportPDF(interview.id)
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="echo-report-${interview.id}.pdf"`
      }
    })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
