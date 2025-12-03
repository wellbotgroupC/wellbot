import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const LoginPage = () => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await api.post("/auth/login", { email, password });
            login(res.data.user, res.data.token);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <h1>{t("login.title")}</h1>
                <form className="form" onSubmit={onSubmit}>
                    <label>
                        {t("login.email")}
                        <input
                            type="email"
                            value={email}
                            required
                            placeholder={t("login.emailPlaceholder")}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label>
                        {t("login.password")}
                        <input
                            type="password"
                            value={password}
                            required
                            placeholder={t("login.passwordPlaceholder")}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    {error && <p className="error-text">{error}</p>}
                    <button className="btn-primary" type="submit">
                        {t("login.button")}
                    </button>
                </form>
                <p className="hint-text">
                    {t("login.newUser")}{" "}
                    <Link className="link-inline" to="/register">
                        {t("login.registerLink")}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
