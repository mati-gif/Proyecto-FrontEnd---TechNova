import React, { useState, useEffect } from "react";
import { favoritesContext } from "./favoritesContext.js";
import { successToast, errorToast } from "../../shared/toast/toast";

export function FavoritesContextProvider({ children }) {
  // Cargamos los favoritos que ya estaban guardados, o empezamos con una lista vacía []
  const [favorites, setFavorites] = useState(() => {
    const localData = localStorage.getItem("favoritos");
    return localData ? JSON.parse(localData) : [];
  });

  // Cada vez que la lista cambia, la guardamos automáticamente en la compu
  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favorites));
  }, [favorites]);

  // Función para agregar o sacar un producto de favoritos
  const handleToggleFavorite = (product) => {
    const exists = favorites.some((fav) => fav.id === product.id);
    if (exists) {
      // Si ya existe, lo sacamos de la lista
      setFavorites(favorites.filter((fav) => fav.id !== product.id));
      errorToast(`${product.name} eliminado de favoritos`);
    } else {
      // Si no existe, lo sumamos
      setFavorites([...favorites, product]);
      successToast(`${product.name} agregado a favoritos`);
    }
  };

  // Función exclusiva para el tachito de basura de la página de favoritos
  const handleDeleteFavorite = (id) => {
    const product = favorites.find((fav) => fav.id === id);
    setFavorites(favorites.filter((fav) => fav.id !== id));
    if (product) errorToast(`${product.name} eliminado de favoritos`);
  };

  return (
    <favoritesContext.Provider
      value={{ favorites, handleToggleFavorite, handleDeleteFavorite }}
    >
      {children}
    </favoritesContext.Provider>
  );
}

export default FavoritesContextProvider;
