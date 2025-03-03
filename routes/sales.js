

// import express from "express"
// import Sale from "../models/Sale.js"
// import Product from "../models/Product.js"
// import { authenticateToken } from "../middleware/auth.js"
// import { printReceipt } from "../services/printer.js"
// import moment from "moment-timezone"


// const router = express.Router()

// // router.use(authenticateToken)
// router.get("/test-fecha", async (req, res) => {
//   try {
//     const ventas = await Sale.find();
//     const ventasConFechaLocal = ventas.map(v => ({
//       ...v.toObject(),
//       dateBogota: moment(v.date).tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss"),
//     }));
    
//     res.json(ventasConFechaLocal);
//   } catch (error) {
//     console.error("Error al obtener ventas:", error);
//     res.status(500).json({ error: "Error al obtener ventas", details: error.message });
//   }
// });



// router.post("/", async (req, res) => {
//   try {
//     const { products } = req.body;

//     const saleProducts = await Promise.all(
//       products.map(async (item) => {
//         const product = await Product.findOne({ customId: item.customId });
//         if (!product) {
//           throw new Error(`Producto con customId ${item.customId} no encontrado`);
//         }
//         return {
//           product: product._id,
//           customId: product.customId,
//           name: product.name,
//           price: product.price,
//           quantity: item.quantity,
//         };
//       })
//     );

//     const total = saleProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

//     // 🔥 Se agrega la fecha con la zona horaria correcta
//     const sale = new Sale({
//       products: saleProducts,
//       total,
//       date: moment().tz("America/Bogota").toDate(), // Ajusta a la hora local de Colombia
//     });

//     await sale.save();

//     res.status(201).json(sale);
//   } catch (error) {
//     console.error("Error al crear la venta:", error);
//     res.status(500).json({ error: "Error al crear la venta", details: error.message });
//   }
// });


// router.post("/print", async (req, res) => {
//   try {
//     const saleData = req.body
//     const printResult = await printReceipt(saleData)
//     if (printResult.success) {
//       res.json({ message: "Recibo impreso correctamente" })
//     } else {
//       res.status(500).json({ error: "Error al imprimir el recibo", details: printResult.message })
//     }
//   } catch (error) {
//     console.error("Error al imprimir el recibo:", error)
//     res.status(500).json({ error: "Error al imprimir el recibo", details: error.message })
//   }
// })

// export default router

import express from "express";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import { authenticateToken } from "../middleware/auth.js";
import { printReceipt } from "../services/printer.js";
import moment from "moment-timezone";

const router = express.Router();

// router.use(authenticateToken)

router.get("/test-fecha", async (req, res) => {
  try {
    const ventas = await Sale.find();
    const ventasConFechaLocal = ventas.map(v => ({
      ...v.toObject(),
      dateBogota: moment(v.date).tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(ventasConFechaLocal);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({ error: "Error al obtener ventas", details: error.message });
  }
});

// Ruta para crear una venta
router.post("/", async (req, res) => {
  try {
    const { products, paymentMethod } = req.body;  // Recibimos el método de pago

    // Validamos si el paymentMethod está presente
    if (!paymentMethod) {
      return res.status(400).json({ error: "El método de pago es requerido" });
    }

    // Procesamos los productos de la venta
    const saleProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findOne({ customId: item.customId });
        if (!product) {
          throw new Error(`Producto con customId ${item.customId} no encontrado`);
        }
        return {
          product: product._id,
          customId: product.customId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    // Calculamos el total de la venta
    const total = saleProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Creamos la venta incluyendo el paymentMethod
    const sale = new Sale({
      products: saleProducts,
      total,
      paymentMethod,  // Incluimos el método de pago
      date: moment().tz("America/Bogota").toDate(),  // Usamos la hora de Bogotá
    });

    // Guardamos la venta
    await sale.save();

    // Respondemos con la venta recién creada
    res.status(201).json(sale);
  } catch (error) {
    console.error("Error al crear la venta:", error);
    res.status(500).json({ error: "Error al crear la venta", details: error.message });
  }
});

// Ruta para imprimir el recibo
router.post("/print", async (req, res) => {
  try {
    const saleData = req.body;
    const printResult = await printReceipt(saleData);
    if (printResult.success) {
      res.json({ message: "Recibo impreso correctamente" });
    } else {
      res.status(500).json({ error: "Error al imprimir el recibo", details: printResult.message });
    }
  } catch (error) {
    console.error("Error al imprimir el recibo:", error);
    res.status(500).json({ error: "Error al imprimir el recibo", details: error.message });
  }
});

export default router;
