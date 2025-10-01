import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "../components/Table"; // ⬅️ Import the reusable Table component
import "../styles/Appointments.css";
// Remove "../styles/commonTableStyles.css" as Table.js handles its own styles

const Appointments = ({ appointments, setAppointments, payments }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [clinicFilter, setClinicFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const markAsCompleted = (id) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, success: true, cancelled: false } : appt
      )
    );
  };

  const cancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, cancelled: true, success: false } : appt
      )
    );
  };

  const filteredAppointments = appointments.filter((appt) =>
    (t(appt.patientName).toLowerCase().includes(search.toLowerCase()) ||
      appt.date.includes(search)) &&
    (clinicFilter === "" || appt.clinicName === clinicFilter) &&
    (typeFilter === "" || appt.type === typeFilter) &&
    (dateFilter === "" || appt.date === dateFilter)
  );

  // 1. Define the columns array for the appointments table
  const appointmentColumns = [
    { key: "turn", header: "turn" },
    { key: "patientName", header: "patient" },
    { key: "date", header: "date" },
    { key: "dayOfWeek", header: "day" },
    { key: "clinicName", header: "clinic" },
    { key: "type", header: "type" },
    {
      key: "appointment_status",
      header: "appointment_status",
      // Use render to handle conditional status text and class
      render: (appt) => (
        <span className={appt.cancelled ? "cancelled" : appt.success ? "success" : ""}>
          {appt.cancelled
            ? t("cancelled")
            : appt.success
            ? t("completed")
            : t("pending")}
        </span>
      ),
    },
    {
      key: "payment_status",
      header: "payment_status",
      // Use render to find and display the correct payment status
      render: (appt) => {
        const relatedPayment = payments.find(
          (payment) => payment.appointmentId === appt.id
        );
        return relatedPayment
          ? t(relatedPayment.status.toLowerCase())
          : t("not_paid");
      },
    },
    {
      key: "actions",
      header: "actions",
      // Use render to conditionally display the action buttons
      render: (appt) => (
        !appt.cancelled && !appt.success && (
          <>
            <button
              className="complete-btn"
              onClick={() => markAsCompleted(appt.id)}
            >
              {t("completed")}
            </button>
            <button
              className="cancel-btn"
              onClick={() => cancelAppointment(appt.id)}
            >
              {t("cancel")}
            </button>
          </>
        )
      ),
    },
  ];

  return (
    <div className="appointments-container">
      <h1>{t("appointments")}</h1>
      <p>{t("manage_appointments_efficiently")}</p>

      {/* Filters (no change here) */}
      <div className="filters">
        <input
          type="text"
          placeholder={t("search_by_name_or_date")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={clinicFilter}
          onChange={(e) => setClinicFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">{t("all_clinics")}</option>
          <option value="المطرية">{t("al_matareya")}</option>
          <option value="مصر الجديدة">{t("misr_el_gedida")}</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">{t("all_types")}</option>
          <option value="كشف">{t("examination")}</option>
          <option value="استشارة">{t("consultation")}</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-filter"
        />
      </div>

      {/* 2. Use the Table component with the filtered data and defined columns */}
      <Table data={filteredAppointments} columns={appointmentColumns} />
    </div>
  );
};

export default Appointments;