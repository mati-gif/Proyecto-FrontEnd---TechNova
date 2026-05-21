import { useState } from "react";
import { AuthContext } from "./authContext";

const tokenValue = localStorage.getItem("techNovaToken")


function AuthContextProvider({ children }) {

    const [token, setToken] = useState(tokenValue)

    const handleUserLogin = (token) => {
        localStorage.setItem("techNovaToken", token)
        setToken(token)
    }

    const handleUserLogout = () => {
        localStorage.removeItem("techNovaToken")
        setToken(null);
    }


    return (
        // <AuthContextProvider 
        // >
        //     
        // </AuthContextProvider>
        <AuthContext.Provider
            value={{
                token, handleUserLogin, handleUserLogout
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider