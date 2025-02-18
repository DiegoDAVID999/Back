


import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div 
      style={{ 
        backgroundImage: "url('https://wallpapers.com/images/featured/cafeteria-02x9a49rdcr5c18i.jpg')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0
      }}
    >
      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div className="col">
            <Link to="/products" className="card p-4 shadow-sm text-decoration-none">
              <div className="card-body">
                <h5 className="card-title">Gestionar Productos</h5>
                <p className="card-text">Añadir, editar o eliminar productos del inventario.</p>
              </div>
            </Link>
          </div>
          <div className="col">
            <Link to="/sales" className="card p-4 shadow-sm text-decoration-none">
              <div className="card-body">
                <h5 className="card-title">Realizar Venta</h5>
                <p className="card-text">Registrar una nueva venta de productos.</p>
              </div>
            </Link>
          </div>
          <div className="col">
            <Link to="/reports" className="card p-4 shadow-sm text-decoration-none">
              <div className="card-body">
                <h5 className="card-title">Ver Reportes</h5>
                <p className="card-text">Consultar reportes de ventas e ingresos.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
