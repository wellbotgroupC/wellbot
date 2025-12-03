import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api.js";

const AdminDashboardPage = () => {
    const { t } = useTranslation();

    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        ageGroup: "",
        language: ""
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [usersRes, logsRes, analyticsRes] = await Promise.all([
                api.get("/admin/users", { params: filters }),
                api.get("/admin/chat-logs"),
                api.get("/admin/analytics")
            ]);
            setUsers(usersRes.data.users || []);
            setLogs(logsRes.data.logs || []);
            setAnalytics(analyticsRes.data);
        } catch (err) {
            console.error("Admin dashboard error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.ageGroup, filters.language]);

    const changeFilter = (field) => (e) =>
        setFilters({ ...filters, [field]: e.target.value });

    const downloadCsv = (path) => {
        window.open(`${api.defaults.baseURL}${path}`, "_blank");
    };

    const formatMs = (ms) => {
        if (!ms) return "0s";
        const s = Math.round(ms / 1000);
        if (s < 60) return `${s}s`;
        const m = Math.round(s / 60);
        return `${m}m`;
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        return d.toLocaleString();
    };

    return (
        <div className="page-container">
            <div className="admin-dashboard">

                {/* HEADER */}
                <div className="admin-header">
                    <div className="admin-header-left">
                        <h1>{t("admin.dashboardTitle")}</h1>
                        <p className="admin-subtitle">
                            Monitor users, wellness chat activity and export reports.
                        </p>
                    </div>
                    <div className="admin-header-actions">
                        <button
                            className="btn-secondary"
                            onClick={() => downloadCsv("/admin/export/users")}
                        >
                            {t("admin.exportUsers")}
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => downloadCsv("/admin/export/chats")}
                        >
                            {t("admin.exportChats")}
                        </button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="admin-kpi-row">
                    <div className="admin-kpi-card">
                        <span className="admin-kpi-label">{t("admin.totalUsers")}</span>
                        <span className="admin-kpi-value">
                            {analytics?.totalUsers ?? 0}
                        </span>
                    </div>

                    <div className="admin-kpi-card">
                        <span className="admin-kpi-label">{t("admin.avgSession")}</span>
                        <span className="admin-kpi-value">
                            {formatMs(analytics?.avgSessionTime)}
                        </span>
                    </div>

                    <div className="admin-kpi-card admin-kpi-list">
                        <span className="admin-kpi-label">{t("admin.topQuestions")}</span>
                        <ul>
                            {(analytics?.topQuestions || []).length === 0 && (
                                <li className="admin-kpi-empty">No data yet</li>
                            )}
                            {(analytics?.topQuestions || []).map((q) => (
                                <li key={q.question}>
                                    {q.question}{" "}
                                    <span className="admin-pill">x {q.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* FILTER BAR */}
                <div className="admin-filter-card">
                    <div className="admin-filter-header">
                        <h2>{t("admin.filters")}</h2>
                        <button className="btn-secondary" onClick={loadData}>
                            {loading ? "Loading..." : t("admin.refresh")}
                        </button>
                    </div>
                    <div className="admin-filter-row">
                        <div className="admin-filter-item">
                            <label>{t("profile.ageGroup")}</label>
                            <select
                                value={filters.ageGroup}
                                onChange={changeFilter("ageGroup")}
                            >
                                <option value="">{t("admin.ageAll")}</option>
                                <option value="< 18">&lt; 18</option>
                                <option value="18 - 30">18 - 30</option>
                                <option value="30 - 40">30 - 40</option>
                                <option value="40 - 50">40 - 50</option>
                                <option value="> 50">&gt; 50</option>
                            </select>
                        </div>

                        <div className="admin-filter-item">
                            <label>{t("profile.language")}</label>
                            <select
                                value={filters.language}
                                onChange={changeFilter("language")}
                            >
                                <option value="">{t("admin.langAll")}</option>
                                <option value="en">English</option>
                                <option value="te">తెలుగు</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="admin-main-grid">

                    {/* USERS TABLE */}
                    <section className="admin-card">
                        <div className="admin-card-header">
                            <h2>{t("admin.usersList")}</h2>
                            <span className="admin-chip">
                                {users.length} {users.length === 1 ? "user" : "users"}
                            </span>
                        </div>
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>{t("profile.name")}</th>
                                        <th>{t("profile.email")}</th>
                                        <th>{t("profile.ageGroup")}</th>
                                        <th>{t("profile.language")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="admin-empty-cell">
                                                No users found for selected filters.
                                            </td>
                                        </tr>
                                    )}
                                    {users.map((u) => (
                                        <tr key={u._id}>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.ageGroup}</td>
                                            <td>{u.language}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* CHAT LOGS */}
                    <section className="admin-card">
                        <div className="admin-card-header">
                            <h2>{t("admin.chatLogs")}</h2>
                            <span className="admin-chip">
                                {logs.length} {logs.length === 1 ? "session" : "sessions"}
                            </span>
                        </div>
                        <div className="admin-log-list">
                            {logs.length === 0 && (
                                <p className="admin-empty-cell">
                                    No chat sessions recorded yet.
                                </p>
                            )}

                            {logs.map((log) => (
                                <div key={log._id} className="admin-log-item">
                                    <div className="admin-log-header">
                                        <span className="admin-log-user">
                                            {log.userId?.email || "Unknown user"}
                                        </span>
                                        <span className="admin-log-duration">
                                            {formatMs(log.totalSessionTime)}
                                        </span>
                                    </div>
                                    <p className="admin-log-time">
                                        {t("admin.session")}{" "}
                                        {formatDateTime(log.sessionStart)} —{" "}
                                        {log.sessionEnd
                                            ? formatDateTime(log.sessionEnd)
                                            : t("admin.inProgress")}
                                    </p>
                                    <ul className="admin-log-messages">
                                        {log.messages.slice(0, 3).map((m, idx) => (
                                            <li key={idx}>
                                                <span className={`admin-role-tag admin-role-${m.role}`}>
                                                    {m.role}
                                                </span>
                                                <span>{m.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {log.messages.length > 3 && (
                                        <p className="admin-more">
                                            {t("admin.moreMessages", {
                                                count: log.messages.length - 3
                                            })}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
