import express from "express"
import Sale from "../models/Sale.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticateToken)

router.get("/", async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - today.getDay())
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    const [dailySales, weeklySales, monthlySales] = await Promise.all([
      Sale.find({ date: { $gte: today } }),
      Sale.find({ date: { $gte: thisWeekStart } }),
      Sale.find({ date: { $gte: thisMonthStart } }),
    ])

    const topProducts = await Sale.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.customId",
          name: { $first: "$products.name" },
          totalQuantity: { $sum: "$products.quantity" },
          totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ])

    const statistics = {
      dailySales: {
        count: dailySales.length,
        revenue: dailySales.reduce((sum, sale) => sum + sale.total, 0),
      },
      weeklySales: {
        count: weeklySales.length,
        revenue: weeklySales.reduce((sum, sale) => sum + sale.total, 0),
      },
      monthlySales: {
        count: monthlySales.length,
        revenue: monthlySales.reduce((sum, sale) => sum + sale.total, 0),
      },
      topProducts,
    }

    res.json(statistics)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({ error: "Error al obtener estadísticas", details: error.message })
  }
})

export default router

