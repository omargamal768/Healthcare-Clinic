import React, { useState } from "react";
import "../styles/Appointments.css";
import "../styles/commonTableStyles.css";
import { useTranslation } from "react-i18next";

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

  return (
    <div className="appointments-container">
      <h1>{t("appointments")}</h1>
      <p>{t("manage_appointments_efficiently")}</p>

      {/* Filters */}
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

      {/* Appointments Table */}
      {filteredAppointments.length > 0 ? (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>{t("turn")}</th><th>{t("patient")}</th><th>{t("date")}</th>
              <th>{t("day")}</th><th>{t("clinic")}</th><th>{t("type")}</th>
              <th>{t("appointment_status")}</th>
              <th>{t("payment_status")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => {
              const relatedPayment = payments.find(
                (payment) => payment.appointmentId === appt.id
              );
              const paymentStatus = relatedPayment
                ? t(relatedPayment.status.toLowerCase())
                : t("not_paid");

              return (
                <tr
                  key={appt.id}
                  className={
                    appt.cancelled ? "cancelled" : appt.success ? "success" : ""
                  }
                >
                  <td>{appt.turn}</td>
                  <td>{t(appt.patientName)}</td>
                  <td>{appt.date}</td>
                  <td>{t(appt.dayOfWeek)}</td>
                  <td>{t(appt.clinicName)}</td>
                  <td>{t(appt.type)}</td>
                  <td>
                    {appt.cancelled
                      ? t("cancelled")
                      : appt.success
                      ? t("completed")
                      : t("pending")}
                  </td>
                  <td>{paymentStatus}</td>
                  <td>
                    {!appt.cancelled && !appt.success && (
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
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="no-results">{t("no_appointments_found")}</p>
      )}
    </div>
  );
};

export default Appointments;
