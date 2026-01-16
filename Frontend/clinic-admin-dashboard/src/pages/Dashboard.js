import React, { useState,useEffect } from "react"; // Removed useEffect as it's not directly used here
import {
  FaUserMd,
  FaCalendarCheck,
  FaDollarSign,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/Dashboard.css";
import { useTranslation } from "react-i18next";
// import axios from "axios"; // Removed axios as it's not directly used here
import { getAllCompanies } from "../services/companyService";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Add onMarkAppointmentCompleted to the props
const Dashboard = ({ appointments, totalPatients, patients, onMarkAppointmentCompleted }) => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const todayDate = new Date().toISOString().split("T")[0];

  // Derive today's appointments based on the current `appointments` prop
  const todaysAppointments = appointments.filter(app => app.date === todayDate);
  const pendingAppointments = todaysAppointments.filter(app => !app.success);
  const successfulAppointments = todaysAppointments.filter(app => app.success);

  const pendingExaminations = pendingAppointments.filter(app => app.type === "كشف");
  const pendingConsultations = pendingAppointments.filter(app => app.type === "استشارة");

  const successfulExaminations = successfulAppointments.filter(app => app.type === "كشف");
  const successfulConsultations = successfulAppointments.filter(app => app.type === "استشارة");

  // Calculate total income from successful examinations
  // Ensure 'price' property exists or define a default value
  const totalIncome = appointments
    .filter(app => app.type === "كشف" && app.success)
    .reduce((sum, app) => sum + (app.price || 300), 0); // Assuming 300 if price isn't explicitly set

  const appointmentData = months.map((month, index) => {
    const monthAppointments = appointments.filter(app => {
      const date = new Date(app.date);
      return date.getFullYear() === selectedYear && date.getMonth() === index;
    });

    return {
      day: month,
      appointments: monthAppointments.length,
    };
  });

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  // Modified markAsCompleted to call the prop from App.js
  const markAsCompleted = async (id) => {
    if (onMarkAppointmentCompleted) {
      await onMarkAppointmentCompleted(id);
      // No local state update needed here, as App.js will re-fetch
      // and pass updated appointments back down as props.
    }
  };
  useEffect(() => {

  const token = localStorage.getItem("token");

  if (token) {
    getAllCompanies(token)
      .then(res => {
        console.log("ADMIN Companies Loaded:", res.data);
      })
      .catch(err => {
        console.error("ADMIN Company API Error:", err);
      });
  }

}, []);


  return (
    <div className="dashboard">
      <h1>{t("control_panel")}</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <FaUserMd className="stat-icon" />
          <div>
            <p>{t("total_patients")}</p>
            <h3>{totalPatients}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendarCheck className="stat-icon" />
          <div>
            <p>{t("all_examinations")}</p>
            <h3>{appointments.filter(app => app.type === "كشف").length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendarCheck className="stat-icon" />
          <div>
            <p>{t("all_consultations")}</p>
            <h3>{appointments.filter(app => app.type === "استشارة").length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaDollarSign className="stat-icon" />
          <div>
            <p>{t("total_income")}</p>
            <h3>{totalIncome}</h3> {/* Use the calculated totalIncome */}
          </div>
        </div>
      </div>

      <h1>{t("today_statistics")}</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <FaClock className="stat-icon" />
          <div>
            <p>{t("pending_appointments")}</p>
            <h3>{pendingAppointments.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaClock className="stat-icon" />
          <div>
            <p>{t("pending_examinations")}</p>
            <h3>{pendingExaminations.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaClock className="stat-icon" />
          <div>
            <p>{t("pending_consultations")}</p>
            <h3>{pendingConsultations.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle className="stat-icon" />
          <div>
            <p>{t("successful_appointments")}</p>
            <h3>{successfulAppointments.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle className="stat-icon" />
          <div>
            <p>{t("successful_examinations")}</p>
            <h3>{successfulExaminations.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle className="stat-icon" />
          <div>
            <p>{t("successful_consultations")}</p>
            <h3>{successfulConsultations.length}</h3>
          </div>
        </div>
      </div>

      <h2>{t("todays_pending_appointments")}</h2>
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {pendingAppointments.length > 0 ? (
            pendingAppointments.map((app, index) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={app.id}>
                <div className="carousel-item-content">
                  <p><strong>{app.patientName}</strong></p>
                  <p>{t("turn")}: {app.turn}</p>
                  <button className="complete-btn" onClick={() => markAsCompleted(app.id)}>
                    {t("completed")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="carousel-item active">
              <p>{t("no_pending_appointments")}</p>
            </div>
          )}
        </div>
        {pendingAppointments.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>{t("monthly_trends")}</h3>
          <label>{t("select_year")}:</label>
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;