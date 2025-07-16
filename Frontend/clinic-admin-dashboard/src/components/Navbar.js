import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useNotifications } from "./NotificationContext";
import { useRole } from "../App";
import "./Navbar.css";
import { useTranslation } from "react-i18next";

const Navbar = ({ onLogout }) => {
  const { notifications = [], markAllAsRead = () => {} } = useNotifications() || {};
  const { role } = useRole() || {};
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { t, i18n } = useTranslation();

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const toggleNotificationDropdown = () => {
    if (!isNotifOpen) markAllAsRead();
    setIsNotifOpen(!isNotifOpen);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  useEffect(() => {
    document.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <nav className="navbar">
      <h1 className="logo">{t("clinic_admin")}</h1>

      <div className="language-selector">
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          <option value="en">🇺🇸 English</option>
          <option value="ar">🇪🇬 العربية</option>
        </select>
      </div>

      <div className="navbar-icons">
        {/* 🔔 Notification Bell */}
        <div className="notification-bell" onClick={toggleNotificationDropdown} role="button" aria-label="Toggle Notifications">
          <FaBell className="bell-icon" />
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount}</span>
          )}
          {isNotifOpen && (
            <div className="notifications-dropdown">
              {notifications.length === 0 ? (
                <div className="no-notifications">{t("no_notifications")}</div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.read ? "read" : "unread"}`}
                  >
                    <strong>{notif.title}</strong>
                    <p>{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 👤 Profile Menu */}
        <div className="profile-menu">
          <button className="profile-button" onClick={toggleProfileDropdown}>
            <span>👤 {role}</span> ▼
          </button>
          {showProfileDropdown && (
            <div className="dropdown-menu-show">
              <Link to="/profile">{t("profile")}</Link>
              {role === "admin" && <Link to="/settings">{t("settings")}</Link>}
              <button onClick={onLogout}>{t("logout")}</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
