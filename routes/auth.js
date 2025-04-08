



// // import express from "express"
// // import bcrypt from "bcryptjs"
// // import jwt from "jsonwebtoken"
// // import User from "../models/User.js"

// // const router = express.Router()

// // router.post("/register", async (req, res) => {
// //   try {
// //     const { username, password } = req.body
// //     const user = new User({ username, password })
// //     await user.save()
// //     res.status(201).json({ message: "Usuario creado exitosamente" })
// //   } catch (error) {
// //     res.status(500).json({ error: "Error al crear usuario" })
// //   }
// // })

// // // router.post("/login", async (req, res) => {
// // //   try {
// // //     const { username, password } = req.body
// // //     const user = await User.findOne({ username })
// // //     if (!user) {
// // //       return res.status(400).json({ error: "Credenciales inválidas" })
// // //     }
// // //     const isMatch = await bcrypt.compare(password, user.password)
// // //     if (!isMatch) {
// // //       return res.status(400).json({ error: "Credenciales inválidas" })
// // //     }
// // //     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
// // //     res.json({ token })
// // //   } catch (error) {
// // //     res.status(500).json({ error: "Error al iniciar sesión" })
// // //   }
// // // })
// // router.post("/login", async (req, res) => {
// //   try {
// //     const { username, password } = req.body;
    
// //     // Verificar si el usuario existe
// //     const user = await User.findOne({ username });
// //     if (!user) {
// //       console.log("Usuario no encontrado:", username); // Verifica si el usuario existe
// //       return res.status(400).json({ error: "Credenciales inválidas" });
// //     }
    
// //     // Verificar la contraseña
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       console.log("Contraseña incorrecta"); // Asegúrate de que la contraseña esté bien
// //       return res.status(400).json({ error: "Credenciales inválidas" });
// //     }
    
// //     // Crear y devolver el token JWT
// //     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
// //     res.json({ token });
// //   } catch (error) {
// //     console.error("Error en el inicio de sesión:", error);
// //     res.status(500).json({ error: "Error al iniciar sesión" });
// //   }
// // });

// // export default router

// import express from "express"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
// import User from "../models/User.js"

// const router = express.Router()

// router.post("/register", async (req, res) => {
//   try {
//     const { username, password, role } = req.body
//     const user = new User({ username, password, role })
//     await user.save()
//     res.status(201).json({ message: "Usuario creado exitosamente" })
//   } catch (error) {
//     res.status(500).json({ error: "Error al crear usuario" })
//   }
// })

// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body

//     // Verificar si el usuario existe
//     const user = await User.findOne({ username })
//     if (!user) {
//       console.log("Usuario no encontrado:", username)
//       return res.status(400).json({ error: "Credenciales inválidas" })
//     }

//     // Verificar la contraseña
//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       console.log("Contraseña incorrecta")
//       return res.status(400).json({ error: "Credenciales inválidas" })
//     }

//     // Crear y devolver el token JWT incluyendo el rol del usuario
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" },
//     )

//     res.json({
//       token,
//       user: {
//         username: user.username,
//         role: user.role,
//       },
//     })
//   } catch (error) {
//     console.error("Error en el inicio de sesión:", error)
//     res.status(500).json({ error: "Error al iniciar sesión" })
//   }
// })

// export default router

import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: "El nombre de usuario ya está en uso" })
    }

    // Crear el nuevo usuario con el rol especificado
    const user = new User({
      username,
      password,
      role: role || "vendedor", // Si no se proporciona un rol, por defecto es 'vendedor'
    })
    console.log("Body recibido:", req.body);

    await user.save()

    console.log(`Usuario ${username} creado con rol: ${user.role}`)

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: {
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    res.status(500).json({ error: "Error al crear usuario" })
  }
  console.log("Body recibido:", req.body);

})

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Verificar si el usuario existe
    const user = await User.findOne({ username })
    if (!user) {
      console.log("Usuario no encontrado:", username)
      return res.status(400).json({ error: "Credenciales inválidas" })
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log("Contraseña incorrecta")
      return res.status(400).json({ error: "Credenciales inválidas" })
    }

    console.log(`Usuario ${username} autenticado con rol: ${user.role}`)

    // Crear y devolver el token JWT incluyendo el rol del usuario
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    )

    res.json({
      token,
      user: {
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error en el inicio de sesión:", error)
    res.status(500).json({ error: "Error al iniciar sesión" })
  }
})

// Ruta para obtener información del usuario actual
router.get("/me", async (req, res) => {
  try {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No autorizado" })
    }

    const token = authHeader.split(" ")[1]

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    // Devolver información del usuario
    res.json({
      username: user.username,
      role: user.role,
    })
  } catch (error) {
    console.error("Error al obtener información del usuario:", error)
    res.status(401).json({ error: "Token inválido o expirado" })
  }
})

// Ruta para actualizar el rol de un usuario (solo para administradores)
router.put("/role/:username", async (req, res) => {
  try {
    const { role } = req.body
    const { username } = req.params

    // Verificar que el rol sea válido
    if (!["admin", "vendedor"].includes(role)) {
      return res.status(400).json({ error: "Rol inválido" })
    }

    // Actualizar el rol del usuario
    const user = await User.findOneAndUpdate({ username }, { role }, { new: true })

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    res.json({
      message: "Rol actualizado correctamente",
      user: {
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error al actualizar el rol:", error)
    res.status(500).json({ error: "Error al actualizar el rol" })
  }
})

export default router

