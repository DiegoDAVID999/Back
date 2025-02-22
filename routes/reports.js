

import express from "express"
import Sale from "../models/Sale.js"
import { authenticateToken } from "../middleware/auth.js"
import { deleteReport } from '../services/reportControllers.js'
import { generatePDF } from "../services/pdfGenerator.js"
import fs from "fs"
import path from "path"
import moment from "moment-timezone" // 📅 Importamos moment-timezone

const router = express.Router()

// router.use(authenticateToken)

import moment from "moment-timezone"

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

    const salesWithDateBogota = sales.map((sale) => ({
      ...sale.toObject(),
      dateBogota: moment(sale.date)
        .tz("America/Bogota")
        .format("YYYY-MM-DD HH:mm:ss"),
    }))

    return {
      date: moment(startDate).tz("America/Bogota").format("YYYY-MM-DD"), // 📅 Ajustamos a la zona horaria
      totalSales,
      totalRevenue,
      productsSold: Object.values(productsSold),
      sales: salesWithDateBogota, // 📂 Añadimos ventas con fecha ajustada
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
        dayOfWeek: index, // 0 lunes, 1 martes, ..., 6 domingo
        total: 0,
      }))

    let totalRevenue = 0

    sales.forEach((sale) => {
      const dayOfWeek = (sale.date.getDay() + 6) % 7
      dailyTotals[dayOfWeek].total += sale.total
      totalRevenue += sale.total
    })

    return {
      startDate: moment(startDate).tz("America/Bogota").format("YYYY-MM-DD"),
      endDate: moment(endDate).tz("America/Bogota").format("YYYY-MM-DD"),
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
        startDate: moment(currentWeekStart).tz("America/Bogota").format("YYYY-MM-DD"),
        endDate: moment(new Date(Math.min(currentWeekEnd, endDate))).tz("America/Bogota").format("YYYY-MM-DD"),
        total: weekSales.reduce((sum, sale) => sum + sale.total, 0),
        salesCount: weekSales.length,
      })

      currentWeekStart = new Date(currentWeekEnd)
      currentWeekEnd = new Date(currentWeekStart)
      currentWeekEnd.setDate(currentWeekEnd.getDate() + 7)
    }

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalSales = sales.length

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
      startDate: moment(startDate).tz("America/Bogota").format("YYYY-MM-DD"),
      endDate: moment(endDate).tz("America/Bogota").format("YYYY-MM-DD"),
      weeklyTotals,
      totalRevenue,
      totalSales,
      productsSold: Object.values(productsSold),
    }
  } catch (error) {
    console.error("Error en generateMonthlyReport:", error)
    throw error
  }
}

router.get("/daily", async (req, res) => {
  try {
    const today = moment().tz("America/Bogota").startOf("day").toDate() // 📅 Zona horaria correcta
    const tomorrow = moment(today).add(1, "days").toDate()

    const report = await generateDailyReport(today, tomorrow)
    res.json(report)
  } catch (error) {
    console.error("Error al obtener el reporte diario:", error)
    res.status(500).json({ error: "Error al obtener el reporte diario", details: error.message })
  }
})

router.get("/weekly", async (req, res) => {
  try {
    const today = moment().tz("America/Bogota").toDate()
    const startOfWeek = moment(today).tz("America/Bogota").startOf("isoWeek").toDate()
    const endOfWeek = moment(startOfWeek).add(7, "days").toDate()

    const report = await generateWeeklyReport(startOfWeek, endOfWeek)
    res.json(report)
  } catch (error) {
    console.error("Error al obtener el reporte semanal:", error)
    res.status(500).json({ error: "Error al obtener el reporte semanal", details: error.message })
  }
})

router.get("/monthly", async (req, res) => {
  try {
    const today = moment().tz("America/Bogota").toDate()
    const startOfMonth = moment(today).startOf("month").toDate()
    const endOfMonth = moment(today).endOf("month").toDate()

    const report = await generateMonthlyReport(startOfMonth, endOfMonth)
    res.json(report)
  } catch (error) {
    console.error("Error al obtener el reporte mensual:", error)
    res.status(500).json({ error: "Error al obtener el reporte mensual", details: error.message })
  }
})

router.get("/monthly/download", async (req, res) => {
  try {
    const today = moment().tz("America/Bogota")
    const startOfMonth = today.clone().startOf("month").toDate()
    const endOfMonth = today.clone().endOf("month").toDate()

    const reportFileName = `monthly_report_${moment(startOfMonth).format("YYYY-MM-DD")}_${moment(endOfMonth).format("YYYY-MM-DD")}.json`
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
    const today = moment().tz("America/Bogota")
    const startOfMonth = today.clone().startOf("month").toDate()
    const endOfMonth = today.clone().endOf("month").toDate()

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
