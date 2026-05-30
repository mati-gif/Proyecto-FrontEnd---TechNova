import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";

const tokenValue = localStorage.getItem("techNovaToken")


function AuthContextProvider({ children }) {

    const [token, setToken] = useState(tokenValue)

    const [user, setUser] = useState({
        userName: null,
        userEmail: null,
        userRole: null
    })

    console.log(user,"informacion del usuario");
    

    const handleUserLogin = (token) => {
        localStorage.setItem("techNovaToken", token)
        setToken(token)
    }

    const handleUserLogout = () => {
        localStorage.removeItem("techNovaToken")
        setToken(null);
        setUser({
            userName: null,
            userEmail: null,
            userRole: null
        });
    }

    
    useEffect(() => {

        console.log(token);
        
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUser({
                    userRole: payload.role,
                    userEmail: payload.email,
                    userName: payload.name
                });

                console.log("se ejecuto el try del useEffect");
                
                
            } catch (error) {
                console.error("Error al decodificar el token", error);
                handleUserLogout();
            }
        // } else {
        //     // Si el token cambió a null (logout), limpiamos el estado del usuario inmediatamente

        //     console.log("entro por el else");
            
        //     setUser({
        //         userName: null,
        //         userEmail: null,
        //         userRole: null
        //     });
        }
    }, [token])


    return (
        // <AuthContextProvider 
        // >
        //     
        // </AuthContextProvider>
        <AuthContext.Provider
            value={{
                token, handleUserLogin, handleUserLogout, user
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider