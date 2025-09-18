import { Children } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? <Navigate to="/" /> : children;
};

export default PublicRoute;