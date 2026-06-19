import React, { useContext } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Container, Nav } from "react-bootstrap";
import { LayoutDashboard, Package, Users, ArrowLeft, Mail } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext/authContext";
import UserHeader from "../UsuarioLayout/UserHeader";

// Estilos personalizados
const sidebarStyles = `
  .tn-sidebar-link {
    display: block;
    width: 100%;
    text-align: left;
    padding: .55rem .85rem;
    border-radius: .55rem;
    background: transparent;
    border: none;
    font-size: .9rem;
    color: #5b6478;
    cursor: pointer;
    transition: all .2s;
    text-decoration: none;
  }

  .tn-sidebar-link:hover {
    background: rgba(15, 23, 42, .05) !important;
    color: #0f172a !important;
  }

  .tn-sidebar-link.active {
    background: #2b56f5 !important;
    color: #fff !important;
    font-weight: 600;
  }
`;
function AdminLayout() {
  const { token } = useContext(AuthContext);

  // 2. Extraemos el rol de forma segura
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload.role; // Extrae "admin" o "superadmin"
    } catch (error) {
      console.error("Error decodificando token en AdminLayout", error);
    }
  }
  const isSuperadmin = userRole === "superadmin";

  const linkClass = ({ isActive }) =>
    `tn-sidebar-link ${isActive ? "active" : ""}`;
  return (
    <>
      <style>{sidebarStyles}</style>
      <div className="d-flex flex-column min-vh-100">
        {/* <HeaderAdmin /> */}
        <UserHeader />
        <Container fluid className="py-4">
          <div className="d-flex flex-wrap align-items-baseline gap-3 mb-4 px-2">
            <h1
              className="fw-bold mb-0"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Panel de administración
            </h1>
            <span className="badge bg-warning text-dark text-uppercase">
              {userRole}
            </span>
            <Link
              to="/"
              className="ms-auto small text-decoration-none text-secondary d-inline-flex align-items-center gap-1"
            >
              <ArrowLeft size={14} /> Volver a la tienda
            </Link>
          </div>

          <div className="row g-4">
            <aside className="col-lg-3 col-xl-2">
              <Nav className="flex-column gap-1 sticky-top" style={{ top: 90 }}>
                <NavLink to="/admin/dashboard" className={linkClass}>
                  <LayoutDashboard size={14} className="me-2" /> Inicio
                </NavLink>
                <NavLink to="/admin/products" className={linkClass}>
                  <Package size={14} className="me-2" /> Productos
                </NavLink>
                <NavLink to="/admin/contact-us/all" className={linkClass}>
                  <Mail size={14} className="me-2" /> Consultas
                </NavLink>
                {isSuperadmin && (
                  <NavLink to="/admin/users" className={linkClass}>
                    <Users size={14} className="me-2" /> Usuarios
                  </NavLink>
                )}
              </Nav>
            </aside>

            <main className="col-lg-9 col-xl-10">
              <Outlet />
            </main>
          </div>
        </Container>
      </div>
    </>
  );
}

export default AdminLayout;
