import express from "express"
import User from "../models/User.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Middleware para verificar si el usuario es administrador
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user && user.role === "admin") {
      next()
    } else {
      res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." })
    }
  } catch (error) {
    res.status(500).json({ error: "Error al verificar permisos de administrador" })
  }
}

// Obtener todos los usuarios (solo admin)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }) // Excluir contraseñas
    res.json(users)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    res.status(500).json({ error: "Error al obtener usuarios" })
  }
})

// Eliminar un usuario (solo admin)
router.delete("/:username", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { username } = req.params

    // No permitir eliminar al propio usuario
    const currentUser = await User.findById(req.user.userId)
    if (currentUser.username === username) {
      return res.status(400).json({ error: "No puedes eliminar tu propia cuenta" })
    }

    const user = await User.findOneAndDelete({ username })
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    res.json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    res.status(500).json({ error: "Error al eliminar usuario" })
  }
})

export default router

