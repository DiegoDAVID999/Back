const moment = require("moment-timezone")
const Sale = require("../models/Sale")

/**
 * Genera un reporte mensual completo
 * @param {Date} startDate - Fecha de inicio del mes
 * @param {Date} endDate - Fecha de fin del mes
 * @returns {Object} Reporte mensual completo
 */
async function generateMonthlyReport(startDate, endDate) {
  try {
    console.log(`Generando reporte mensual desde ${startDate.toISOString()} hasta ${endDate.toISOString()}`)

    // Consultar todas las ventas en el rango de fechas
    const sales = await Sale.find({
      date: { $gte: startDate, $lt: endDate },
    })

    console.log(`Se encontraron ${sales.length} ventas para el reporte mensual`)

    // Crear un objeto para almacenar los datos de cada día del mes
    const daysInMonth = moment(endDate).diff(moment(startDate), "days")
    console.log(`Días en el mes: ${daysInMonth}`)

    const dailyData = {}

    // Inicializar todos los días del mes con datos vacíos
    for (let i = 0; i < daysInMonth; i++) {
      const currentDate = moment(startDate).add(i, "days")
      const dateKey = currentDate.format("YYYY-MM-DD")

      dailyData[dateKey] = {
        date: dateKey,
        totalSales: 0,
        totalRevenue: 0,
        totalProductsSold: 0,
        productsSold: {},
        paymentMethods: {
          Efectivo: 0,
          Tarjeta: 0,
          Transferencia: 0,
        },
      }
    }

    // Procesar las ventas y agruparlas por día
    sales.forEach((sale) => {
      // Convertir la fecha de la venta a la zona horaria de Bogotá
      const saleDate = moment(sale.date).tz("America/Bogota").format("YYYY-MM-DD")
      console.log(`Procesando venta del ${saleDate}, ID: ${sale._id}`)

      // Si por alguna razón la fecha no está en nuestro rango, la ignoramos
      if (!dailyData[saleDate]) {
        console.log(`Advertencia: Venta con fecha ${saleDate} fuera del rango esperado`)
        return
      }

      // Incrementar contadores para este día
      dailyData[saleDate].totalSales += 1
      dailyData[saleDate].totalRevenue += sale.total

      // Incrementar el contador del método de pago
      if (sale.paymentMethod) {
        dailyData[saleDate].paymentMethods[sale.paymentMethod] += sale.total
      }

      // Procesar productos vendidos
      sale.products.forEach((item) => {
        dailyData[saleDate].totalProductsSold += item.quantity

        if (dailyData[saleDate].productsSold[item.customId]) {
          dailyData[saleDate].productsSold[item.customId].quantity += item.quantity
          dailyData[saleDate].productsSold[item.customId].total += item.price * item.quantity
        } else {
          dailyData[saleDate].productsSold[item.customId] = {
            name: item.name,
            customId: item.customId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          }
        }
      })
    })

    // Convertir el objeto de días a un array y ordenarlo por fecha
    const report = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date))

    // Calcular totales mensuales
    const monthlyTotals = report.reduce(
      (totals, day) => {
        totals.totalSales += day.totalSales
        totals.totalRevenue += day.totalRevenue
        totals.totalProductsSold += day.totalProductsSold

        // Sumar por método de pago
        totals.paymentMethods.Efectivo += day.paymentMethods.Efectivo
        totals.paymentMethods.Tarjeta += day.paymentMethods.Tarjeta
        totals.paymentMethods.Transferencia += day.paymentMethods.Transferencia

        return totals
      },
      {
        totalSales: 0,
        totalRevenue: 0,
        totalProductsSold: 0,
        paymentMethods: {
          Efectivo: 0,
          Tarjeta: 0,
          Transferencia: 0,
        },
      },
    )

    // Calcular los productos más vendidos del mes
    const allProductsSold = {}
    report.forEach((day) => {
      Object.values(day.productsSold).forEach((product) => {
        if (allProductsSold[product.customId]) {
          allProductsSold[product.customId].quantity += product.quantity
          allProductsSold[product.customId].total += product.total
        } else {
          allProductsSold[product.customId] = { ...product }
        }
      })
    })

    // Convertir a array y ordenar por cantidad
    const topProducts = Object.values(allProductsSold)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10) // Top 10 productos

    console.log(
      `Reporte mensual generado con éxito. Total ventas: ${monthlyTotals.totalSales}, Total ingresos: ${monthlyTotals.totalRevenue}`,
    )

    return {
      startDate: moment(startDate).tz("America/Bogota").format("YYYY-MM-DD"),
      endDate: moment(endDate).subtract(1, "days").tz("America/Bogota").format("YYYY-MM-DD"),
      report,
      monthlyTotals,
      topProducts,
      daysWithSales: report.filter((day) => day.totalSales > 0).length,
    }
  } catch (error) {
    console.error("Error en generateMonthlyReport:", error)
    throw error
  }
}

module.exports = generateMonthlyReport

