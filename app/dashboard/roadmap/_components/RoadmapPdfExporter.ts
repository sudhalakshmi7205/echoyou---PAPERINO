import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface ExportPdfOptions {
  containerId: string
  studentName?: string
  roadmapTitle: string
  completedCount: number
  totalCount: number
}

export async function exportRoadmapToPdf({
  containerId,
  studentName = 'Student',
  roadmapTitle,
  completedCount,
  totalCount
}: ExportPdfOptions) {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error('Flowchart container element not found for PDF export.')
    return
  }

  try {
    // Render high resolution canvas from element
    const canvas = await html2canvas(container, {
      backgroundColor: '#000000',
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = canvas.width
    const imgHeight = canvas.height

    // Calculate PDF dimensions (A4 portrait or auto height)
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [imgWidth, imgHeight + 120]
    })

    // Header metadata background
    pdf.setFillColor(0, 0, 0)
    pdf.rect(0, 0, imgWidth, imgHeight + 120, 'F')

    // Header Text
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(24)
    pdf.text(`EchoRoadmap — ${roadmapTitle}`, 40, 40)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(14)
    pdf.setTextColor(160, 160, 160)
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    pdf.text(`Student: ${studentName}   |   Date: ${dateStr}   |   Progress: ${completedCount}/${totalCount} completed`, 40, 65)

    // Divider Line
    pdf.setDrawColor(0, 255, 102)
    pdf.setLineWidth(2)
    pdf.line(40, 85, imgWidth - 40, 85)

    // Draw flowchart image below header
    pdf.addImage(imgData, 'PNG', 0, 100, imgWidth, imgHeight)

    // Save PDF
    const filename = `EchoRoadmap_${roadmapTitle.replace(/\s+/g, '_')}_${dateStr.replace(/[\s,]+/g, '_')}.pdf`
    pdf.save(filename)
  } catch (err) {
    console.error('Failed to export PDF:', err)
  }
}
