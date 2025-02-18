


import { ThermalPrinter, PrinterTypes, CharacterSet } from "node-thermal-printer"

export async function printReceipt(saleData) {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: process.env.PRINTER_INTERFACE,
    characterSet: CharacterSet.PC852_LATIN2,
    removeSpecialCharacters: false,
    lineCharacter: "=",
    options: {
      timeout: process.env.PRINTER_TIMEOUT,
    },
  })

  try {
    await printer.isPrinterConnected()

    printer.alignCenter()
    printer.println("Café El Aroma")
    printer.println("Recibo de Venta")
    printer.drawLine()

    printer.alignLeft()
    printer.println(`Fecha: ${new Date(saleData.date).toLocaleString()}`)
    printer.println(`Número de venta: ${saleData._id}`)
    printer.drawLine()

    printer.tableCustom([
      { text: "Producto", width: 0.4 },
      { text: "Cant.", width: 0.2, align: "RIGHT" },
      { text: "Precio", width: 0.2, align: "RIGHT" },
      { text: "Total", width: 0.2, align: "RIGHT" },
    ])

    saleData.products.forEach((item) => {
      printer.tableCustom([
        { text: item.name, width: 0.4 },
        { text: item.quantity.toString(), width: 0.2, align: "RIGHT" },
        { text: item.price.toFixed(2), width: 0.2, align: "RIGHT" },
        { text: (item.quantity * item.price).toFixed(2), width: 0.2, align: "RIGHT" },
      ])
    })

    printer.drawLine()
    printer.alignRight()
    printer.println(`Total: $${saleData.total.toFixed(2)}`)
    printer.cut()

    const result = await printer.execute()
    console.log("Resultado de la impresión:", result)
    return { success: true, message: "Recibo impreso correctamente" }
  } catch (error) {
    console.error("Error al imprimir:", error)
    return { success: false, message: "Error al imprimir el recibo", error: error.message }
  }
}

