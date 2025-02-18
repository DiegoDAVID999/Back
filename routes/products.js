

import express from "express"
import Product from "../models/Product.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticateToken)

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" })
  }
})

router.get("/:customId", async (req, res) => {
  try {
    const product = await Product.findOne({ customId: req.params.customId })
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { customId, name, price, category } = req.body
    const product = new Product({ customId, name, price, category })
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" })
  }
})

router.put("/:customId", async (req, res) => {
  try {
    const { name, price, category } = req.body
    const product = await Product.findOneAndUpdate(
      { customId: req.params.customId },
      { name, price, category },
      { new: true },
    )
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto" })
  }
})

router.delete("/:customId", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ customId: req.params.customId })
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" })
    }
    res.json({ message: "Producto eliminado exitosamente" })
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" })
  }
})

export default router

