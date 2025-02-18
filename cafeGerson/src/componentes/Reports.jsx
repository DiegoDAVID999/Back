

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Swal from "sweetalert2"

function Reports() {
  const [dailyReport, setDailyReport] = useState(null)
  const [weeklyReport, setWeeklyReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dailyRes, weeklyRes] = await Promise.all([
        axios.get("/api/reports/daily"),
        axios.get("/api/reports/weekly"),
      ])
      setDailyReport(dailyRes.data)
      setWeeklyReport(weeklyRes.data)
    } catch (error) {
      console.error("Error fetching reports:", error)
      setError("Error al cargar los reportes. Por favor, intente de nuevo más tarde.")
      Swal.fire("Error", "No se pudieron cargar los reportes", "error")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
      amount,
    )
  }

  const deleteReport = async (type) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el reporte seleccionado de la base de datos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/reports/${type}`)
          if (type === "daily") setDailyReport(null)
          if (type === "weekly") setWeeklyReport(null)
          Swal.fire("Eliminado", "El reporte ha sido eliminado de la base de datos.", "success")
        } catch (error) {
          console.error("Error deleting report:", error)
          Swal.fire("Error", "No se pudo eliminar el reporte. Por favor, intente de nuevo.", "error")
        }
      }
    })
  }

  const DailyReportTable = ({ title, report, onDelete }) => {
    if (!report) return null

    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="fw-bold">{title}</h3>
          <button className="btn btn-danger btn-sm" onClick={onDelete}>
            Eliminar
          </button>
        </div>
        <h4 className="text-white mb-3">Fecha: {report.date}</h4>
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-secondary text-dark">
              <tr>
                <th className="text-nowrap">Custom ID</th>
                <th className="text-nowrap">Producto</th>
                <th className="text-nowrap text-end">Cantidad</th>
                <th className="text-nowrap text-end">Precio Unitario</th>
                <th className="text-nowrap text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {report.productsSold.map((product) => (
                <tr key={product.customId}>
                  <td className="text-nowrap">{product.customId}</td>
                  <td className="text-nowrap text-start">{product.name}</td>
                  <td className="text-nowrap text-end">{product.quantity}</td>
                  <td className="text-nowrap text-end">{formatCurrency(product.price)}</td>
                  <td className="text-nowrap text-end">{formatCurrency(product.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-secondary fw-bold">
                <td colSpan="4" className="text-end">
                  Total
                </td>
                <td className="text-end">{formatCurrency(report.totalRevenue)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    )
  }

  const WeeklyReportTable = ({ title, report, onDelete }) => {
    if (!report) return null

    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="fw-bold">{title}</h3>
          <button className="btn btn-danger btn-sm" onClick={onDelete}>
            Eliminar
          </button>
        </div>
        <h4 className="text-white mb-3">
          Semana: {report.startDate} - {report.endDate}
        </h4>
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-secondary text-dark">
              <tr>
                <th className="text-nowrap">Día de la Semana</th>
                <th className="text-nowrap text-end">Total Ventas</th>
              </tr>
            </thead>
            <tbody>
              {report.dailyTotals.map((day) => (
                <tr key={day.dayOfWeek}>
                  <td className="text-nowrap text-start">{daysOfWeek[day.dayOfWeek]}</td>
                  <td className="text-nowrap text-end">{formatCurrency(day.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-secondary fw-bold">
                <td className="text-end">Total Semanal</td>
                <td className="text-end">{formatCurrency(report.totalRevenue)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center">Cargando reportes...</div>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="container">
      <h2 className="mb-4">Reportes de Ventas</h2>
      <DailyReportTable title="Reporte Diario" report={dailyReport} onDelete={() => deleteReport("daily")} />
      <WeeklyReportTable title="Reporte Semanal" report={weeklyReport} onDelete={() => deleteReport("weekly")} />
    </div>
  )
}

export default Reports

