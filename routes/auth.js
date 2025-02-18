



import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body
    const user = new User({ username, password })
    await user.save()
    res.status(201).json({ message: "Usuario creado exitosamente" })
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" })
  }
})

// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body
//     const user = await User.findOne({ username })
//     if (!user) {
//       return res.status(400).json({ error: "Credenciales inválidas" })
//     }
//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.status(400).json({ error: "Credenciales inválidas" })
//     }
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
//     res.json({ token })
//   } catch (error) {
//     res.status(500).json({ error: "Error al iniciar sesión" })
//   }
// })
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Verificar si el usuario existe
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Usuario no encontrado:", username); // Verifica si el usuario existe
      return res.status(400).json({ error: "Credenciales inválidas" });
    }
    
    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Contraseña incorrecta"); // Asegúrate de que la contraseña esté bien
      return res.status(400).json({ error: "Credenciales inválidas" });
    }
    
    // Crear y devolver el token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

export default router

