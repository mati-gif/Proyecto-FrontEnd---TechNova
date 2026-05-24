import React, { useState, useEffect } from 'react'
import { cartContext } from '../CartContext/cartContext'

function CartContextProvider({ children }) {

    const [cart, setCart] = useState(() => {

        const saveCart = localStorage.getItem("carrito")
        if (saveCart) {
            return JSON.parse(saveCart)
        } else {

            return [];
        }
    })

    const handleAddToCart = (product) => {

        const existProduct = cart.some((p) => p.id === product.id)
        if (existProduct) {
            // 2. Si ya existe, mapeamos el carrito y aumentamos la cantidad del que coincide
            const updatedCart = cart.map(item =>
                item.id === product.id
                    ? { ...item, cantidad: (item.cantidad || 1) + 1 }
                    : item
            );
            setCart(updatedCart);
        } else {
            // 3. Si es nuevo, lo agregamos con cantidad 1
            setCart([...cart, { ...product, cantidad: 1 }]);
        }


    }
    // Esta función calcula el total de unidades sumando todas las "cantidad"
    const totalQuantity = cart.reduce((total, item) => {
        return total + (item.cantidad || 1);
    }, 0);

    const handleDecreaseQuantity = (id) => {
        // Buscamos el producto en el carrito
        const product = cart.find(item => item.id === id);

        if (product.cantidad > 1) {
            // Escenario A: Restar 1
            const updatedCart = cart.map(item =>
                item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
            );
            setCart(updatedCart);
        } else {
            // Escenario B: Eliminar del carrito

            const productToRemove = cart.filter((p) => p.id != id)
            setCart(productToRemove)
        }
    };

    const totalPrice = cart.reduce((acc, item) => {
        return acc + (item.price * item.cantidad);
    }, 0);

    const handleDeleteProduct = (id) => {
        // Nos quedamos con todos los productos MENOS el que tiene ese ID
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
    };


    useEffect(() => {

        // Cada vez que 'cart' cambie, se guarda convertido en texto (JSON)
        localStorage.setItem("carrito", JSON.stringify(cart))
    }, [cart]) //-->  Se ejecuta cada vez que el array 'cart' se modifica


    return (

        <cartContext.Provider value={{
            cart, handleAddToCart, totalQuantity, handleDecreaseQuantity, totalPrice, handleDeleteProduct
        }}>
            {children}

        </cartContext.Provider>
        // <></>
    )
}

export default CartContextProvider