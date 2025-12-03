import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const RegisterPage = () => {
    const { t, i18n } = useTranslation();
    const { login } = useAuth();

    const [form, setForm] = useState({
        name: "",
        ageGroup: "18 - 30",
        language: i18n.language === "te" ? "te" : "en",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/auth/register", form);
            login(res.data.user, res.data.token);

            // Switch UI language after registration
            if (form.language) {
                i18n.changeLanguage(form.language);
                localStorage.setItem("wellbot_lang", form.language);
            }

        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <h1>{t("register.title")}</h1>
                <form onSubmit={handleSubmit} className="form">

                    <label>
                        {t("register.name")}
                        <input
                            type="text"
                            value={form.name}
                            onChange={handleChange("name")}
                            required
                        />
                    </label>

                    <label>
                        {t("register.ageGroup")}
                        <select
                            value={form.ageGroup}
                            onChange={handleChange("ageGroup")}
                            required
                        >
                            <option value="< 18">&lt; 18</option>
                            <option value="18 - 30">18 - 30</option>
                            <option value="30 - 40">30 - 40</option>
                            <option value="40 - 50">40 - 50</option>
                            <option value="> 50">&gt; 50</option>
                        </select>
                    </label>

                    <label>
                        {t("register.language")}
                        <select
                            value={form.language}
                            onChange={handleChange("language")}
                        >
                            <option value="en">English</option>
                            <option value="te">తెలుగు</option>
                        </select>
                    </label>

                    <label>
                        {t("register.email")}
                        <input
                            type="email"
                            value={form.email}
                            onChange={handleChange("email")}
                            required
                        />
                    </label>

                    <label>
                        {t("register.password")}
                        <input
                            type="password"
                            value={form.password}
                            onChange={handleChange("password")}
                            required
                        />
                    </label>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="btn-primary">
                        {t("register.button")}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
