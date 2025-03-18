

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


const generateMonthlyReport = async (startDate, endDate) => {
  try {
    console.log(`Generando reporte mensual desde ${startDate} hasta ${endDate}`)
    const sales = await Sale.find({
      date: { $gte: startDate, $lt: endDate },
    }).populate("products.product")

    const dailyReport = sales.reduce((acc, sale) => {
      const saleDate = moment(sale.date).tz("America/Bogota").format("YYYY-MM-DD")
      if (!acc[saleDate]) {
        acc[saleDate] = {
          date: saleDate,
          totalProductsSold: 0,
          totalSales: 0,
          totalRevenue: 0,
        }
      }
      acc[saleDate].totalSales += 1
      acc[saleDate].totalRevenue += sale.total
      sale.products.forEach((item) => {
        acc[saleDate].totalProductsSold += item.quantity
      })
      return acc
    }, {})

    const report = Object.values(dailyReport).sort((a, b) => new Date(a.date) - new Date(b.date))

    return {
      startDate: moment(startDate).tz("America/Bogota").format("YYYY-MM-DD"),
      endDate: moment(endDate).tz("America/Bogota").format("YYYY-MM-DD"),
      report,
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

router.delete("/:type", async (req, res) => {
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
