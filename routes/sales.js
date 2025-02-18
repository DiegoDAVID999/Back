

import express from "express"
import Sale from "../models/Sale.js"
import Product from "../models/Product.js"
import { authenticateToken } from "../middleware/auth.js"
import { printReceipt } from "../services/printer.js"

const router = express.Router()

router.use(authenticateToken)

router.post("/", async (req, res) => {
  try {
    const { products } = req.body

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

    const sale = new Sale({ products: saleProducts, total })
    await sale.save()

    res.status(201).json(sale)
  } catch (error) {
    console.error("Error al crear la venta:", error)
    res.status(500).json({ error: "Error al crear la venta", details: error.message })
  }
})

router.post("/print", async (req, res) => {
  try {
    const saleData = req.body
    const printResult = await printReceipt(saleData)
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

export default router

