

function Receipt({ sale }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(amount)
  }

  if (!sale) return null

  return (
    <div className="receipt-container print-only">
      <h2 className="receipt-title">Café El Aroma</h2>
      <p className="receipt-subtitle">Recibo de Venta</p>
      <div className="receipt-details">
        <p>Fecha: {new Date(sale.date).toLocaleString()}</p>
        <p>Número de venta: {sale._id}</p>
      </div>
      <table className="receipt-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th className="text-right">Precio</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.products.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td className="text-right">{formatCurrency(item.price)}</td>
              <td className="text-right">{formatCurrency(item.quantity * item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="receipt-total">
        <p>Total: {formatCurrency(sale.total)}</p>
      </div>
      <p className="receipt-footer">¡Gracias por su compra!</p>
    </div>
  )
}

export default Receipt
