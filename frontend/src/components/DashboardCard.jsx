import React from "react";

const DashboardCard = ({ label, value }) => {
  return (
    <div className="dashboard-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
};

export default DashboardCard;
