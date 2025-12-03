import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../services/api.js";

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const loginAgain = () => navigate("/login");
    const goChat = () => navigate("/chat");

    const deleteAndLogout = async () => {
        if (!window.confirm(t("profile.confirmDelete"))) return;
        try {
            await api.delete("/auth/delete");
        } catch (err) {
            console.error(err);
        } finally {
            logout();
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <h1>{t("profile.title")}</h1>
                <div className="profile-details">
                    <p>
                        <strong>{t("profile.name")}:</strong> {user.name}
                    </p>
                    <p>
                        <strong>{t("profile.email")}:</strong> {user.email}
                    </p>
                    <p>
                        <strong>{t("profile.ageGroup")}:</strong> {user.ageGroup}
                    </p>
                    <p>
                        <strong>{t("profile.language")}:</strong>{" "}
                        {user.language === "te" ? "తెలుగు" : "English"}
                    </p>
                </div>
                <div className="profile-actions">
                    <button className="btn-secondary" onClick={loginAgain}>
                        {t("profile.loginAgain")}
                    </button>
                    <button className="btn-danger" onClick={deleteAndLogout}>
                        {t("profile.logoutDelete")}
                    </button>
                </div>
                <div className="profile-actions">
                    <button className="btn-primary" onClick={goChat}>
                        {t("profile.chatButton")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
