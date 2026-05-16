import { Navigate, Outlet } from "react-router";

const isTokenValid = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

const Protected = ({
    isSignedIn, redirectPath = '/login' }) => {
    if (!isSignedIn) {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
}

export default Protected