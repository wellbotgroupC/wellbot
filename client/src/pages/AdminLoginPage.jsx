import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const AdminLoginPage = () => {
    const { t } = useTranslation();
    const { loginAdmin } = useAuth();

    const [email, setEmail] = useState("admin@wellbot.local");
    const [password, setPassword] = useState("Admin@123");
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/admin/login", { email, password });
            loginAdmin(res.data.admin, res.data.token);
        } catch (err) {
            console.error("Admin login error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Admin login failed");
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <h1>{t("admin.loginTitle") || "Admin Login"}</h1>
                <p className="hint-text" style={{ marginTop: "-0.3rem", marginBottom: "1rem" }}>
                    {t("admin.loginSubtitle") ||
                        "Use the seeded admin credentials to access the WellBot analytics dashboard."}
                </p>

                <form className="form" onSubmit={onSubmit}>
                    <label>
                        {t("login.email")}
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <label>
                        {t("login.password")}
                        <input
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    {error && <p className="error-text">{error}</p>}

                    <button className="btn-primary" type="submit">
                        {t("admin.loginButton") || "Login as Admin"}
                    </button>
                </form>

                <p className="hint-text" style={{ marginTop: "1rem" }}>
                    Default admin: <strong>admin@wellbot.local</strong> /{" "}
                    <strong>Admin@123</strong>
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
