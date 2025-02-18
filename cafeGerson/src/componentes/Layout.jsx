

import Navbar from "./Navbar"
import { useAuth } from "../contexts/AuthContext"

function Layout({ children }) {
  const { logout } = useAuth()

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <Navbar onLogout={logout} />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-secondary shadow mt-4 py-3">
        <div className="container text-center">
          <p className="text-white small mb-0">© 2025 Café Gerson. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

