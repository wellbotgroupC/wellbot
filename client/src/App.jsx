import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import "./styles/global.css";
import "./styles/chat.css";

const App = () => {
    const { t, i18n } = useTranslation();

    // Set default language on first load
    useEffect(() => {
        const savedLang = localStorage.getItem("wellbot_lang");
        if (savedLang) {
            i18n.changeLanguage(savedLang);
        }
    }, [i18n]);

    return (
        <div className="app-root">

            {/* TOP NAVBAR */}
            <Navbar />

            {/* MAIN CONTENT */}
            <main className="app-main">

                <Routes>

                    {/* Default route */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* USER ROUTES */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/chat"
                        element={
                            <ProtectedRoute>
                                <ChatPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* ADMIN ROUTES */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminDashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 FALLBACK */}
                    <Route path="*" element={<Navigate to="/login" replace />} />

                </Routes>

            </main>

            {/* FOOTER */}
            <footer className="app-footer">
                <p>{t("footer.disclaimer")}</p>
            </footer>

        </div>
    );
};

export default App;
