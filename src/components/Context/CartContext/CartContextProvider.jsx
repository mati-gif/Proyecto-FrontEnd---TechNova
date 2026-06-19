import React, { useState, useEffect } from "react";
import { cartContext } from "../CartContext/cartContext";
import { successToast, errorToast } from "../../shared/toast/toast";

function CartContextProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saveCart = localStorage.getItem("carrito");
    if (saveCart) {
      return JSON.parse(saveCart);
    } else {
      return [];
    }
  });

  const handleAddToCart = (product) => {
    const productInCart = cart.find((p) => p.id === product.id);

    if (productInCart) {
      // Verificamos stock
      if (productInCart.cantidad >= productInCart.stock) {
        errorToast(`No hay más stock disponible de ${product.name}`);
        return;
      }

      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item,
      );

      setCart(updatedCart);
      successToast(`${product.name} — Se añadió otra unidad al carrito`);
    } else {
      if (product.stock <= 0) {
        errorToast(`${product.name} sin stock disponible`);
        return;
      }

      setCart([...cart, { ...product, cantidad: 1 }]);
      successToast(`${product.name} agregado al carrito`);
    }
  };
  // Esta función calcula el total de unidades sumando todas las "cantidad"
  const totalQuantity = cart.reduce((total, item) => {
    return total + (item.cantidad || 1);
  }, 0);

  const handleDecreaseQuantity = (id) => {
    // Buscamos el producto en el carrito
    const product = cart.find((item) => item.id === id);

    if (product.cantidad > 1) {
      // Escenario A: Restar 1
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item,
      );
      setCart(updatedCart);
      successToast(`${product.name} — Cantidad reducida en el carrito`);
    } else {
      // Escenario B: Eliminar del carrito

      const productToRemove = cart.filter((p) => p.id != id);
      setCart(productToRemove);
      errorToast(`${product.name} eliminado del carrito`);
    }
  };

  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.cantidad;
  }, 0);

  const handleDeleteProduct = (id) => {
    // Nos quedamos con todos los productos MENOS el que tiene ese ID
    const product = cart.find((item) => item.id === id);
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    if (product) errorToast(`${product.name} eliminado del carrito`);
  };

  //  constantes de envío
  const shippingThreshold = 500000; // Monto para envío gratis
  const shippingCost = totalPrice >= shippingThreshold ? 0 : 5000;
  const finalTotal = totalPrice + shippingCost;

  useEffect(() => {
    // Cada vez que 'cart' cambie, se guarda convertido en texto (JSON)
    localStorage.setItem("carrito", JSON.stringify(cart));
  }, [cart]); //-->  Se ejecuta cada vez que el array 'cart' se modifica

  return (
    <cartContext.Provider
      value={{
        cart,
        handleAddToCart,
        totalQuantity,
        handleDecreaseQuantity,
        totalPrice,
        handleDeleteProduct,
        shippingThreshold,
        shippingCost,
        finalTotal,
      }}
    >
      {children}
    </cartContext.Provider>
    // <></>
  );
}

export default CartContextProvider;
