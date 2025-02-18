import PDFDocument from "pdfkit"

export const generatePDF = (report) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const buffers = []

    doc.on("data", buffers.push.bind(buffers))
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers)
      resolve(pdfData)
    })

    // Agregar contenido al PDF
    doc.fontSize(18).text("Reporte Mensual de Ventas", { align: "center" })
    doc.moveDown()
    doc.fontSize(12).text(`Período: ${report.startDate} - ${report.endDate}`)
    doc.moveDown()

    // Tabla de totales semanales
    doc.fontSize(14).text("Totales Semanales")
    doc.moveDown()
    const tableTop = 150
    doc.font("Helvetica-Bold")
    doc.text("Semana", 50, tableTop)
    doc.text("Total Ventas", 200, tableTop)
    doc.text("Cantidad de Ventas", 350, tableTop)
    doc.font("Helvetica")

    let yPosition = tableTop + 20
    report.weeklyTotals.forEach((week, index) => {
      doc.text(`Semana ${index + 1}`, 50, yPosition)
      doc.text(`$${week.total.toFixed(2)}`, 200, yPosition)
      doc.text(week.salesCount.toString(), 350, yPosition)
      yPosition += 20
    })

    // Días restantes
    yPosition += 20
    doc.text("Días Restantes", 50, yPosition)
    doc.text(`$${report.remainingDays.total.toFixed(2)}`, 200, yPosition)
    doc.text(report.remainingDays.salesCount.toString(), 350, yPosition)

    // Total mensual
    yPosition += 40
    doc.font("Helvetica-Bold")
    doc.text("Total Mensual", 50, yPosition)
    doc.text(`$${report.totalRevenue.toFixed(2)}`, 200, yPosition)
    doc.text(report.totalSales.toString(), 350, yPosition)

    doc.end()
  })
}

