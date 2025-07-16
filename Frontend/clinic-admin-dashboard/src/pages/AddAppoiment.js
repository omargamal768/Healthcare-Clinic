import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddAppointmentPage.css";
import { Modal, Button } from "react-bootstrap";
import { useNotifications } from "../components/NotificationContext";
import { useTranslation } from "react-i18next";

const AddAppointment = ({ patients, payments, appointments, onAddAppointment, setPayments }) => {
  const { t } = useTranslation();
  const [turn, setTurn] = useState("");
  const [date, setDate] = useState("");
  const [clinicName, setClinicName] = useState("مطرية");
  const [patientId, setPatientId] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cost, setCost] = useState(200); // Default cost for "كشف"
  const [type, setType] = useState("كشف"); // Default type
  const navigate = useNavigate();
  const { id } = useParams();
  const { addNotification } = useNotifications();

  useEffect(() => {
    setPatientId(Number(id));
  }, [id]);

  useEffect(() => {
    // Adjust cost based on selected type
    if (type === "كشف") {
      setCost(200);
    } else if (type === "استشارة") {
      setCost(300);
    }
  }, [type]);

  const normalizeDate = (dateStr) => {
    try {
      return new Date(dateStr).toISOString().split("T")[0];
    } catch {
      return null;
    }
  };

  const isTurnTaken = (date, turn) => {
    const normalized = normalizeDate(date);
    return appointments.some(
      (appointment) =>
        normalizeDate(appointment.date) === normalized &&
        Number(appointment.turn) === Number(turn)
    );
  };

  const hasPatientAppointmentOnDate = (patientId, date) => {
    const normalized = normalizeDate(date);
    return appointments.some(
      (appointment) =>
        appointment.patientId === patientId &&
        normalizeDate(appointment.date) === normalized
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!patientId) {
      setErrorMessage(t("please_select_patient"));
      setShowError(true);
      return;
    }

    if (!date || !turn) {
      setErrorMessage(t("please_select_date_turn"));
      setShowError(true);
      return;
    }

    if (isTurnTaken(date, turn)) {
      setErrorMessage(t("turn_taken", { turn, date }));
      setShowError(true);
      return;
    }

    if (hasPatientAppointmentOnDate(patientId, date)) {
      setErrorMessage(t("patient_has_appointment"));
      setShowError(true);
      return;
    }

    const patientName = patients.find((p) => p.id === patientId)?.name || t("unknown");

    const newAppointment = {
      id: Date.now(), // Generate ID here in the component
      turn,
      date,
      clinicName,
      type,
      patientId,
      patientName,
      dayOfWeek: new Date(date).toLocaleString("en-us", { weekday: "long" }),
      cost, // Ensure the cost is included in the new appointment object
      cancelled: false,
      success: false,
    };

   
    const newPayment = {
      paymentId:  newAppointment.id,
      appointmentId: newAppointment.id,
      cost: newAppointment.cost, // Use the cost from the newly created appointment
      patientId: newAppointment.patientId,
      clinicName: newAppointment.clinicName,
      date: newAppointment.date,
      status: "Pending",
    };

    onAddAppointment(newAppointment); // Use the onAddAppointment prop
    setPayments((prevPayments) => [...prevPayments, newPayment]);

    const notificationHeader = `${patientName} ${t("action")} ${t(type.toLowerCase())} ${t("at")} ${date}`;
    addNotification("notification", notificationHeader);

    navigate("/appointments");
  };

  const patient = patients.find((p) => p.id === patientId);

  return (
    <div className="add-appointment-container">
      <h1>{t("add_new_appointment")}</h1>
      <form onSubmit={handleSubmit} className="add-appointment-form">
        <div className="form-group">
          <label htmlFor="patientName">{t("patient_name")}</label>
          <input
            type="text"
            id="patientName"
            value={patient ? t(patient.name) : t("loading")}
            readOnly
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">{t("date")}</label>
          <input
            type="date"
            id="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="clinic">{t("clinic")}</label>
          <select
            id="clinic"
            className="form-control"
            onChange={(e) => setClinicName(e.target.value)}
            value={clinicName}
            required
          >
            <option value="مطرية">{t("al_matareya")}</option>
            <option value="مصر الجديدة">{t("misr_el_gedida")}</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="type">{t("type")}</label>
          <select
            id="type"
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="كشف">{t("examination")}</option>
            <option value="استشارة">{t("consultation")}</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="turn">{t("turn")}</label>
          <div className="chairs-container">
            {[...Array(30).keys()].map((num) => {
              const chairNumber = num + 1;
              const taken = isTurnTaken(date, chairNumber);

              return (
                <button
                  key={chairNumber}
                  type="button"
                  className={`chair-button ${turn === chairNumber ? "selected" : ""} ${taken ? "taken" : ""}`}
                  onClick={() => {
                    if (!taken) setTurn(chairNumber);
                  }}
                  disabled={taken}
                >
                  {chairNumber}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="cost">{t("appointment_cost")}</label>
          <input
            type="text"
            id="cost"
            className="form-control"
            value={cost}
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {t("add_appointment")}
        </button>
      </form>

      <Modal show={showError} onHide={() => setShowError(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("error")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowError(false)}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAppointment;