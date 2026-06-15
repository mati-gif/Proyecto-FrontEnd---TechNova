import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../Context/AuthContext/authContext";

const isTokenValid = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

const Protected = ({ allowedRoles }) => {

    //sacamos el token del contexto
    const { token } = useContext(AuthContext)

    // 1. Si no hay token en el contexto o venció, afuera.
    if (!token || !isTokenValid(token)) {
        return <Navigate to="/login" replace /> //replace : evita que el usuario no pueda volver atras usando las flechas del navegador
        //Si no estás logueado o el token venció, te expulsa automáticamente al /login
    }

    // 2. Extraemos el rol
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRole = payload.role;

    // 3. Verificamos si el rol está permitido
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    // 4. Todo ok, renderiza el componente
    return <Outlet />;//Si la validación fue exitosa, renderizá acá adentro cualquier componente hijo que esté envuelto Outlet
}

export default Protected