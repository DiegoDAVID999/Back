

"use client"

import { useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import Receipt from "./Receipt"

function Sales() {
  const [cart, setCart] = useState([])
  const [customId, setCustomId] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [lastSale, setLastSale] = useState(null)

  const addToCart = async () => {
    try {
      const response = await axios.get(`/api/products/${customId}`)
      const product = response.data

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.customId === customId)
        if (existingItem) {
          return prevCart.map((item) =>
            item.customId === customId ? { ...item, quantity: item.quantity + Number(quantity) } : item,
          )
        }
        return [...prevCart, { ...product, quantity: Number(quantity) }]
      })

      setCustomId("")
      setQuantity(1)
      Swal.fire("Éxito", "Producto agregado al carrito", "success")
    } catch (error) {
      console.error("Error al agregar producto:", error)
      Swal.fire("Error", "Producto no encontrado", "error")
    }
  }

  const removeFromCart = (customId) => {
    setCart((prevCart) => prevCart.filter((item) => item.customId !== customId))
    Swal.fire("Éxito", "Producto removido del carrito", "success")
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Swal.fire("Error", "No hay productos en el carrito", "error")
      return
    }

    try {
      const response = await axios.post("/api/sales", { products: cart })
      const newSale = response.data
      setLastSale(newSale)
      setCart([])
      Swal.fire("Éxito", "Venta realizada con éxito", "success")
    } catch (error) {
      console.error("Error al realizar la venta:", error)
      Swal.fire("Error", "Error al realizar la venta", "error")
    }
  }

  const handlePrint = () => {
    if (!lastSale) {
      Swal.fire("Error", "No hay una venta registrada para imprimir", "error")
      return
    }
    window.print()
  }

  const totalVenta = cart.reduce((total, item) => total + item.quantity * item.price, 0)

  return (
    <div className="container mt-4">
      <div className="no-print">
        <h2 className="mb-4">Nueva Venta</h2>
        <div className="input-group mb-3">
          <input
            type="text"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            placeholder="ID del Producto"
            className="form-control"
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            className="form-control"
          />
          <button onClick={addToCart} className="btn btn-primary">
            Agregar
          </button>
        </div>
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.customId}>
                <td>{item.customId}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(item.price)}
</td>

                <td>
  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(item.quantity * item.price)}
</td>

                <td>
                  <button className="btn btn-danger" onClick={() => removeFromCart(item.customId)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h4 className="text-end mt-3">
  Total: {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(totalVenta)}
</h4>

        <button onClick={handleCheckout} className="btn btn-success me-2">
          Realizar Venta
        </button>

        {lastSale && (
          <button onClick={handlePrint} className="btn btn-secondary">
            Imprimir Recibo
          </button>
        )}
      </div>

      {lastSale && (
        <div className="print-only">
          <Receipt sale={lastSale} />
        </div>
      )}
    </div>
  )
}

export default Sales

