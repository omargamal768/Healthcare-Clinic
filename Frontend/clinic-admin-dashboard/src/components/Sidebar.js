import React from "react";
import { Link } from "react-router-dom";
import { useRole } from "../App";
import "./Sidebar.css";
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { role } = useRole();
  const { t } = useTranslation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
      {role === "admin" && <Link to="/">{t("dashboard")}</Link>}
      <Link to="/patients">{t("patients")}</Link>
      {role === "admin" && <Link to="/appointments">{t("appointments")}</Link>}
      {role === "receptionist" && <Link to="/appointments">{t("appointments")}</Link>}
      {role === "admin" && <Link to="/payments">{t("payments")}</Link>}
      {role === "receptionist" && <Link to="/payments">{t("payments")}</Link>}
      {role === "admin" && <Link to="/settings">{t("settings")}</Link>}
    </div>
</div>

  );
};

export default Sidebar;