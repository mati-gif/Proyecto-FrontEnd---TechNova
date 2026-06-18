import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { AuthContext } from "../Context/AuthContext/authContext";
import UserHeader from "./UsuarioLayout/UserHeader";

function MainLayout() {
  const { token } = useContext(AuthContext);

  // Creamos la variable userRole inicialmente vacía
  let userRole = null;

  // Solo intentamos decodificar el token SI existe
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload.role;
    } catch (error) {
      console.error("Error al decodificar el token en MainLayout", error);
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <Header /> */}
      {token ? <UserHeader /> : <Header />}
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
