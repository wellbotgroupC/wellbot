import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, admin } = useAuth();

    if (adminOnly) {
        if (!admin) return <Navigate to="/admin/login" replace />;
        return children;
    }

    if (!user) return <Navigate to="/login" replace />;

    return children;
};

export default ProtectedRoute;
