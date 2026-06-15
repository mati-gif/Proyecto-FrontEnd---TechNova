import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";

const tokenValue = localStorage.getItem("techNovaToken")


function AuthContextProvider({ children }) {

    const [token, setToken] = useState(tokenValue)

    const [user, setUser] = useState({
        userId:null,
        userName: null,
        userEmail: null,
        userRole: null
    })
    

    const handleUserLogin = (token) => {
        localStorage.setItem("techNovaToken", token)
        setToken(token)
    }

    const handleUserLogout = () => {
        localStorage.removeItem("techNovaToken")
        setToken(null);
        setUser({
            userId:null,
            userName: null,
            userEmail: null,
            userRole: null
        });
    }

    
    useEffect(() => {

        
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUser({
                    userId:payload.id,
                    userRole: payload.role,
                    userEmail: payload.email,
                    userName: payload.name
                });
                
                
            } catch (error) {
                console.error("Error al decodificar el token", error);
                handleUserLogout();
            }
        } else {
            // Si el token cambió a null (logout), limpiamos el estado del usuario inmediatamente

            console.log("entro por el else");
            
            setUser({
                userId:null,
                userName: null,
                userEmail: null,
                userRole: null
            });
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