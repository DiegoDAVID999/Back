
import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import productRoutes from "./routes/products.js"
import saleRoutes from "./routes/sales.js"
import reportRoutes from "./routes/reports.js"
import statisticsRoutes from "./routes/statistics.js"

dotenv.config()

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 5000

    this.middlewares()
    this.routes()
    this.connectDB()
    this.start()
  }

  middlewares() {
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173", // Asegúrese de que esta URL coincida con la de su frontend
        credentials: true,
      }),
    )
    this.app.use(express.json())
  }

  routes() {
    this.app.use("/api/auth", authRoutes)
    this.app.use("/api/products", productRoutes)
    this.app.use("/api/sales", saleRoutes)
    this.app.use("/api/reports", reportRoutes)
    this.app.use("/api/statistics", statisticsRoutes)
  }

  async connectDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      console.log("Conectado a MongoDB Atlas")
    } catch (err) {
      console.error("Error de conexión a MongoDB Atlas:", err)
      if (err.name === "MongoTimeoutError") {
        console.error("Tiempo de espera agotado. Verifica tu conexión a internet y la cadena de conexión.")
      }
      process.exit(1)
    }
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor ejecutándose en el puerto ${this.port}`)
      console.log(`Impresora configurada: ${process.env.PRINTER_TYPE} en ${process.env.PRINTER_INTERFACE}`)
    })
  }
}

export default Server

