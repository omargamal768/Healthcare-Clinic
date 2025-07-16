// Profile.js
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/Profile.css";
import { useTranslation } from "react-i18next"; // Assuming this is setup

const Profile = ({ patients, appointments, setAppointments }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const patientId = Number(id);

  const patient = patients.find((p) => p.id === patientId);
  if (!patient) {
    return (
      <div className="profile-container">
        <h2>{t("patients")} {t("not_found") || "Not Found"}</h2>
        <button className="back-button" onClick={() => navigate("/patients")}>
          {t("backToPatients") || "Back to Patients"}
        </button>
      </div>
    );
  }

  const patientAppointments = appointments.filter(
    (appointment) => appointment.patientId === patientId
  );

  const markAsCompleted = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === id ? { ...appt, success: true, cancelled: false } : appt
      )
    );
  };

  const cancelAppointment = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === id ? { ...appt, cancelled: true, success: false } : appt
      )
    );
  };

 

  const whatsappMessage = encodeURIComponent(`Hello ${patient.name}, welcome to our clinic!`);
  const whatsappUrl = `https://web.whatsapp.com/send?phone=${patient.mobile.replace(/[^0-9]/g, "")}&text=${whatsappMessage}`;

  return (
    <div className="profile-container">
      <h2 className="profile-title">{t("profile")}</h2>

      <h3>{t("personal_information") || "Personal Information"}</h3>
      <table className="personal-info-table">
        <tbody>
          <tr>
            <th>{t("name")}</th>
            <td>{patient.name}</td>
          </tr>
          <tr>
            <th>{t("mobile")}</th>
            <td>
              {patient.mobile}{" "}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-icon">
                <FaWhatsapp />
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>{t("appointments")}</h3>
      {patientAppointments.length > 0 ? (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>{t("turn")}</th>
              <th>{t("date") || "Date"}</th>
              <th>{t("clinic") || "Clinic"}</th>
              <th>{t("type") || "Type"}</th>
              <th>{t("day") || "Day"}</th>
              <th>{t("status") || "Status"}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {patientAppointments.map((appointment) => {
              let status = t("pending_appointments");
              if (appointment.cancelled) {
                status = t("cancelled") || "Cancelled";
              } else if (appointment.success) {
                status = t("completed");
              }

              return (
                <tr key={appointment.id}>
                  <td>{appointment.turn}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.clinicName}</td>
                  <td>{appointment.type}</td>
                  <td>{appointment.dayOfWeek}</td>
                  <td className={`status-${status.toLowerCase()}`}>{status}</td>
                  <td>
                    {!appointment.cancelled && !appointment.success && (
                      <>
                        <button className="complete-btn" onClick={() => markAsCompleted(appointment.id)}>
                          {t("completed")}
                        </button>
                        <button className="cancel-btn" onClick={() => cancelAppointment(appointment.id)}>
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
        <p>{t("noAppointments") || "No appointments found for this patient."}</p>
      )}


      <Link to={`/add-appointment/${patient.id}`}>
        <button className="add-btn">{t("addNewAppointment") || "Add New Appointment"}</button>
      </Link>

      <button className="back-button" onClick={() => navigate("/patients")}>
        {t("backToPatients") || "Back to Patients"}
      </button>
    </div>
  );
};

export default Profile;
