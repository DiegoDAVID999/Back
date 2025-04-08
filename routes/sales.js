
// export default router;
import express from "express"
import Sale from "../models/Sale.js"
import Product from "../models/Product.js"
import { authenticateToken } from "../middleware/auth.js"
import { printReceipt } from "../services/printer.js"
import moment from "moment-timezone"

const router = express.Router()

// router.use(authenticateToken)

router.post("/", async (req, res) => {
  try {
    const { products, paymentMethod } = req.body

    const saleProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findOne({ customId: item.customId })
        if (!product) {
          throw new Error(`Producto con customId ${item.customId} no encontrado`)
        }
        return {
          product: product._id,
          customId: product.customId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        }
      }),
    )

    const total = saleProducts.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Usar la zona horaria de Bogotá para la fecha de la venta
    const saleDate = moment().tz("America/Bogota").toDate()
    console.log(`Creando venta con fecha: ${saleDate.toISOString()}`)

    const sale = new Sale({
      products: saleProducts,
      total,
      paymentMethod,
      date: saleDate,
    })

    await sale.save()

    try {
      await printReceipt(sale)
    } catch (printError) {
      console.error("Error al imprimir el recibo:", printError)
    }

    res.status(201).json(sale)
  } catch (error) {
    console.error("Error al crear la venta:", error)
    res.status(500).json({ error: "Error al crear la venta", details: error.message })
  }
})

router.post("/print/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
    if (!sale) {
      return res.status(404).json({ error: "Venta no encontrada" })
    }

    const printResult = await printReceipt(sale)
    if (printResult.success) {
      res.json({ message: "Recibo impreso correctamente" })
    } else {
      res.status(500).json({ error: "Error al imprimir el recibo", details: printResult.message })
    }
  } catch (error) {
    console.error("Error al imprimir el recibo:", error)
    res.status(500).json({ error: "Error al imprimir el recibo", details: error.message })
  }
})

// Ruta para depuración de fechas
router.get("/test-dates", async (req, res) => {
  try {
    const now = moment().tz("America/Bogota")
    const startOfToday = now.clone().startOf("day").toDate()
    const endOfToday = now.clone().endOf("day").toDate()

    const sales = await Sale.find({
      date: { $gte: startOfToday, $lt: endOfToday },
    })

    const result = {
      currentTime: now.format("YYYY-MM-DD HH:mm:ss"),
      startOfToday: startOfToday.toISOString(),
      endOfToday: endOfToday.toISOString(),
      salesCount: sales.length,
      sales: sales.map((sale) => ({
        id: sale._id,
        date: sale.date.toISOString(),
        localDate: moment(sale.date).tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss"),
        total: sale.total,
        paymentMethod: sale.paymentMethod,
      })),
    }

    res.json(result)
  } catch (error) {
    console.error("Error en test-dates:", error)
    res.status(500).json({ error: "Error en test-dates", details: error.message })
  }
})

export default router

