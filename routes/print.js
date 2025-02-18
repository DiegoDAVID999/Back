import express from "express";
import printReceipt from "../services/printer.js"; // Ajusta la ruta según tu estructura
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    await printReceipt(data);
    res.json({ message: "Recibo enviado a la impresora" });
  } catch (error) {
    res.status(500).json({ error: "Error al imprimir el recibo" });
  }
});

export default router;
