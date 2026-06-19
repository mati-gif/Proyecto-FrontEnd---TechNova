import React, { useState, useEffect, useContext } from "react";
import { favoritesContext } from "./favoritesContext.js";
import { successToast, errorToast } from "../../shared/toast/toast";
import { AuthContext } from "../AuthContext/authContext";
import { useNavigate, useLocation } from "react-router-dom";

export function FavoritesContextProvider({ children }) {
  // Cargamos los favoritos que ya estaban guardados o lista vacía
  const [favorites, setFavorites] = useState(() => {
    const localData = localStorage.getItem("favoritos");
    return localData ? JSON.parse(localData) : [];
  });

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Cada vez que la lista cambia, la guardamos
  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favorites));
  }, [favorites]);

  // Agregar o sacar un producto de favoritos
  const handleToggleFavorite = (product) => {
    // Si no está logueado, no permitimos guardar favoritos
    if (!token) {
      errorToast("Debe iniciar sesión para guardar favoritos");
      // Redirigimos a login y guardamos la ruta actual para volver ya logueado
      navigate("/login", { state: { from: location?.pathname || "/" } });
      return;
    }

    // Funcion para botón de favoritos 
    const exists = favorites.some((fav) => fav.id === product.id);
    if (exists) {
      // Si ya existe, lo sacamos de la lista
      setFavorites(favorites.filter((fav) => fav.id !== product.id));
      errorToast(`${product.name} eliminado de favoritos`);
    } else {
      // Si no existe, se agrega
      setFavorites([...favorites, product]);
      successToast(`¡${product.name} agregado a favoritos!`);
    }
  };

  return (
    <favoritesContext.Provider
      value={{ favorites, handleToggleFavorite }}
    >
      {children}
    </favoritesContext.Provider>
  );
}

export default FavoritesContextProvider;
