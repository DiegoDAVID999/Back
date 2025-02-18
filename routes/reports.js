

import express from "express"
import Sale from "../models/Sale.js"
import { authenticateToken } from "../middleware/auth.js"
import { deleteReport } from "../services/reportControllers.js"
import { generatePDF } from "../services/pdfGenerator.js"
import fs from "fs"
import path from "path"

const router = express.Router()

// router.use(authenticateToken)

const generateDailyReport = async (startDate, endDate) => {
  try {
    console.log(`Generando reporte desde ${startDate} hasta ${endDate}`)
    const sales = await Sale.find({
      date: { $gte: startDate, $lt: endDate },
    }).populate("products.product")

    console.log(`Se encontraron ${sales.length} ventas`)

    const totalSales = sales.length
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)

    const productsSold = sales.reduce((acc, sale) => {
      sale.products.forEach((item) => {
        if (acc[item.customId]) {
          acc[item.customId].quantity += item.quantity
          acc[item.customId].total += item.price * item.quantity
        } else {
          acc[item.customId] = {
            name: item.name,
            customId: item.customId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          }
        }
      })
      return acc
    }, {})

    return {
      date: startDate.toISOString().split("T")[0],
      totalSales,
      totalRevenue,
      productsSold: Object.values(productsSold),
    }
  } catch (error) {
    console.error("Error en generateDailyReport:", error)
    throw error
  }
}

const generateWeeklyReport = async (startDate, endDate) => {
  try {
    console.log(`Generando reporte semanal desde ${startDate} hasta ${endDate}`)
    const sales = await Sale.find({
      date: { $gte: startDate, $lt: endDate },
    })

    const dailyTotals = Array(7)
      .fill(0)
      .map((_, index) => ({
        dayOfWeek: (index + 1) % 7, // Ahora 0 es lunes, 1 es martes, ..., 6 es domingo
        total: 0,
      }))

    let totalRevenue = 0

    sales.forEach((sale) => {
      const dayOfWeek = (sale.date.getDay() + 6) % 7 // Convertir 0 (domingo) a 6, 1 (lunes) a 0, etc.
      dailyTotals[dayOfWeek].total += sale.total
      totalRevenue += sale.total
    })

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      dailyTotals,
      totalRevenue,
    }
  } catch (error) {
    console.error("Error en generateWeeklyReport:", error)
    throw error
  }
}

const generateMonthlyReport = async (startDate, endDate) => {
  try {
    console.log(`Generando reporte mensual desde ${startDate} hasta ${endDate}`)
    const sales = await Sale.find({
      date: { $gte: startDate, $lt: endDate },
    })

    const weeklyTotals = []
    let currentWeekStart = new Date(startDate)
    let currentWeekEnd = new Date(currentWeekStart)
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 7)

    while (currentWeekStart < endDate) {
      const weekSales = sales.filter(
        (sale) => sale.date >= currentWeekStart && sale.date < new Date(Math.min(currentWeekEnd, endDate)),
      )

      weeklyTotals.push({
        startDate: currentWeekStart.toISOString().split("T")[0],
        endDate: new Date(Math.min(currentWeekEnd, endDate)).toISOString().split("T")[0],
        total: weekSales.reduce((sum, sale) => sum + sale.total, 0),
        salesCount: weekSales.length,
      })

      currentWeekStart = new Date(currentWeekEnd)
      currentWeekEnd = new Date(currentWeekStart)
      currentWeekEnd.setDate(currentWeekEnd.getDate() + 7)
    }

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalSales = sales.length

    const lastWeekEnd = new Date(weeklyTotals[weeklyTotals.length - 1].endDate)
    const remainingDays = {
      startDate: lastWeekEnd.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      total: sales
        .filter((sale) => sale.date >= lastWeekEnd && sale.date < endDate)
        .reduce((sum, sale) => sum + sale.total, 0),
      salesCount: sales.filter((sale) => sale.date >= lastWeekEnd && sale.date < endDate).length,
    }

    const report = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      weeklyTotals,
      remainingDays,
      totalRevenue,
      totalSales,
    }

    // Guardar el reporte en un archivo
    const reportFileName = `monthly_report_${report.startDate}_${report.endDate}.json`
    const reportPath = path.join(__dirname, "..", "reports", reportFileName)
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    return report
  } catch (error) {
    console.error("Error en generateMonthlyReport:", error)
    throw error
  }
}

router.get("/daily", async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const report = await generateDailyReport(today, tomorrow)
    res.json(report)
  } catch (error) {
    console.error("Error al obtener el reporte diario:", error)
    res.status(500).json({ error: "Error al obtener el reporte diario", details: error.message })
  }
})

router.get("/weekly", async (req, res) => {
  try {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7)) // Ajustar para que la semana comience el lunes
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 7)

    const report = await generateWeeklyReport(startOfWeek, endOfWeek)
    res.json(report)
  } catch (error) {
    console.error("Error al obtener el reporte semanal:", error)
    res.status(500).json({ error: "Error al obtener el reporte semanal", details: error.message })
  }
})

router.get("/monthly", async (req, res) => {
  try {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const report = await generateMonthlyReport(startOfMonth, endOfMonth)
    res.json(report)
  } catch (error) {
    console.error("Error al obtener el reporte mensual:", error)
    res.status(500).json({ error: "Error al obtener el reporte mensual", details: error.message })
  }
})

router.get("/monthly/download", async (req, res) => {
  try {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const reportFileName = `monthly_report_${startOfMonth.toISOString().split("T")[0]}_${endOfMonth.toISOString().split("T")[0]}.json`
    const reportPath = path.join(__dirname, "..", "reports", reportFileName)

    if (fs.existsSync(reportPath)) {
      res.download(reportPath)
    } else {
      res.status(404).json({ error: "Reporte no encontrado" })
    }
  } catch (error) {
    console.error("Error al descargar el reporte mensual:", error)
    res.status(500).json({ error: "Error al descargar el reporte mensual", details: error.message })
  }
})

router.get("/monthly/print", async (req, res) => {
  try {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const report = await generateMonthlyReport(startOfMonth, endOfMonth)
    const pdfBuffer = await generatePDF(report)

    res.contentType("application/pdf")
    res.send(pdfBuffer)
  } catch (error) {
    console.error("Error al imprimir el reporte mensual:", error)
    res.status(500).json({ error: "Error al imprimir el reporte mensual", details: error.message })
  }
})

router.delete("/:type", authenticateToken, async (req, res) => {
  try {
    const { type } = req.params
    const result = await deleteReport(type)
    res.status(200).json({ message: `Reporte ${type} eliminado correctamente`, deletedCount: result.deletedCount })
  } catch (error) {
    console.error(`Error al eliminar el reporte ${req.params.type}:`, error)
    res.status(500).json({ error: `Error al eliminar el reporte ${req.params.type}`, message: error.message })
  }
})

export default router

