import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("wellbot_user");
        if (storedUser) setUser(JSON.parse(storedUser));
        const storedAdmin = localStorage.getItem("wellbot_admin");
        if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("wellbot_user", JSON.stringify(userData));
        localStorage.setItem("wellbot_token", token);
        navigate("/profile");
    };

    const loginAdmin = (adminData, token) => {
        setAdmin(adminData);
        localStorage.setItem("wellbot_admin", JSON.stringify(adminData));
        localStorage.setItem("wellbot_token", token);
        navigate("/admin/dashboard");
    };

    const logout = () => {
        setUser(null);
        setAdmin(null);
        localStorage.removeItem("wellbot_user");
        localStorage.removeItem("wellbot_admin");
        localStorage.removeItem("wellbot_token");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, admin, login, loginAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
