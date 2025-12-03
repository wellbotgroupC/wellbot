import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext.jsx";

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { user, admin, logout } = useAuth();
    const location = useLocation();

    const onLangChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <header className="app-header">
            <div className="logo">WellBot</div>
            <nav>
                {!isAdminRoute && (
                    <>
                        <Link to="/login">{t("nav.login")}</Link>
                        <Link to="/register">{t("nav.register")}</Link>
                    </>
                )}
                <Link to="/admin/login">{t("nav.admin")}</Link>
            </nav>
            <div className="header-right">
                <select value={i18n.language} onChange={onLangChange}>
                    <option value="en">English</option>
                    <option value="te">తెలుగు</option>
                </select>
                {(user || admin) && (
                    <button className="btn-ghost" onClick={logout}>
                        {t("nav.logout")}
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
