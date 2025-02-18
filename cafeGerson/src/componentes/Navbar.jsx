


import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importa los íconos de Bootstrap

function Navbar({ onLogout }) {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(false);
    onLogout();
  };

  return (
    <nav className="navbar px-3" style={{ backgroundColor: "#000000"
    }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Logo con icono de café */}
        <Link to="/dashboard" className="navbar-brand text-white d-flex align-items-center fw-bold fs-4">
          <i className="bi bi-cup-hot-fill me-2" style={{ fontSize: "1.5rem" }}></i>
          MOCCAP
        </Link>

        <ul className="nav">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link text-white">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link text-white">Productos</Link>
          </li>
          <li className="nav-item">
            <Link to="/sales" className="nav-link text-white">Ventas</Link>
          </li>
          <li className="nav-item">
            <Link to="/reports" className="nav-link text-white">Reportes</Link>
          </li>
          <li className="nav-item">
            <button className="btn btn-warning ms-3 fw-bold" onClick={() => setShowModal(true)}>
              <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>

      {/* Modal de Confirmación de Cierre de Sesión */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirmar Cierre de Sesión</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que quieres cerrar sesión?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
