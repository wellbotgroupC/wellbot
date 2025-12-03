import React from "react";

const StatsCard = ({ title, value, children }) => (
    <div className="stat-card">
        <h2>{title}</h2>
        {value !== undefined && <p>{value}</p>}
        {children}
    </div>
);

export default StatsCard;
