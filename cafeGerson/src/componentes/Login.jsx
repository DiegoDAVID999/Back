

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import moccap from "../assets/images/moccap.jpg"; // Aquí importa la imagen desde tu carpeta local

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", { username, password });
      login(response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire("Error", "Error al iniciar sesión. Por favor, intente de nuevo.", "error");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('https://wallpapers.com/images/featured/cafeteria-02x9a49rdcr5c18i.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card col-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", padding: "20px", borderRadius: "10px" }}>
        <div className="card-body d-flex flex-column justify-content-center align-items-center">
          {/* Logo de la empresa encima del formulario */}
          <img
            src={moccap} // Aquí se usa el logo importado
            alt="Logo Empresa"
            style={{ width: "100px", height: "auto", marginBottom: "20px" }} // Ajusta el tamaño como necesites
          />
          <h3>Iniciar Sesión</h3>
          <form className="col-12" onSubmit={handleSubmit}>
            <div className="col-12">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-primary col-12">
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
