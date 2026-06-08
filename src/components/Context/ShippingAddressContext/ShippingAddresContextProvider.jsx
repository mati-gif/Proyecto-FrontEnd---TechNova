import { useEffect, useState } from "react";
import { ShippingAddressContext } from "./shippingAddressContext"

import React from 'react'

function ShippingAddresContextProvider({ children }) {

    const [shippingAddress, setShippingAddress] = useState(() => {
        const saved = localStorage.getItem("selectedShippingAddress");
        if(saved){
            return JSON.parse(saved)
        }else {
            return null
        }
    });

    const handleSaveShippingAddres = (addres) =>{
        setShippingAddress(addres)
    }
    useEffect(() => {

        // Cada vez que 'shippingAddress' cambie, se guarda convertido en texto (JSON)
        localStorage.setItem("selectedShippingAddress", JSON.stringify(shippingAddress))
    }, [shippingAddress]) //-->  Se ejecuta cada vez que el array 'shippingAddress' se modifica
    return (
        <ShippingAddressContext.Provider
            value={{shippingAddress,handleSaveShippingAddres}}
        >

            {children}

        </ShippingAddressContext.Provider>
    )
}

export default ShippingAddresContextProvider