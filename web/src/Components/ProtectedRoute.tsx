import { Navigate } from "react-router-dom";
import { getActiveUser } from "../Users";
import { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => { 
    const user = getActiveUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
