import React, { useState } from "react";
import "../styles/Payments.css";
import { useTranslation } from "react-i18next";
import { Modal, Button } from "react-bootstrap";
import { PAYMOB_API_KEY, INTEGRATION_ID, IFRAME_ID } from "../config";

const Payments = ({ payments, patients, setPayments }) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleOpenModal = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setShowModal(false);
  };

  const handlePaymentMethod = async (method) => {
    if (!selectedPayment) return;

    if (method === "cash") {
      setPayments((prev) =>
        prev.map((p) =>
          p.paymentId === selectedPayment.paymentId
            ? { ...p, status: "Paid" }
            : p
        )
      );
      handleCloseModal();
    } else if (method === "visa") {
      try {
        const BASE_URL = "https://accept.paymob.com/api";

        // 1. AUTH
        const authResponse = await fetch(`${BASE_URL}/auth/tokens`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
        });
        const { token } = await authResponse.json();

        // 2. ORDER REGISTRATION
        const orderResponse = await fetch(`${BASE_URL}/ecommerce/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth_token: token,
            delivery_needed: false,
            amount_cents: selectedPayment.cost * 100,
            currency: "EGP",
            items: [],
          }),
        });
        const { id: orderId } = await orderResponse.json();

        // 3. PAYMENT KEY
        const paymentKeyResponse = await fetch(`${BASE_URL}/acceptance/payment_keys`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth_token: token,
            amount_cents: selectedPayment.cost * 100,
            expiration: 3600,
            order_id: orderId,
            billing_data: {
              apartment: "NA",
              email: "omar@example.com",
              floor: "NA",
              first_name: "Omar",
              street: "NA",
              building: "NA",
              phone_number: "01000000000",
              shipping_method: "NA",
              postal_code: "NA",
              city: "Cairo",
              country: "EG",
              last_name: "Omar",
              state: "Cairo",
            },
            currency: "EGP",
            integration_id: INTEGRATION_ID,
          }),
        });

        const { token: paymentToken } = await paymentKeyResponse.json();

        // 4. OPEN IFRAME
        window.open(
          `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentToken}`,
          "_blank"
        );

        handleCloseModal();
      } catch (error) {
        console.error("Paymob Payment Error:", error);
        alert(t("visa_payment_error"));
      }
    }
  };

  return (
    <div className="payments-container">
      <h1>{t("dashboard")}</h1>
      <p>{t("welcome_clinic_admin")}</p>

      <table className="payments-table">
        <thead>
          <tr>
            <th>{t("payment_id")}</th>
            <th>{t("patient_name")}</th>
            <th>{t("appointment_id")}</th>
            <th>{t("cost")}</th>
            <th>{t("date")}</th>
            <th>{t("status")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => {
              const patient = patients.find((p) => p.id === payment.patientId);
              const patientName = patient ? patient.name : t("unknown");

              return (
                <tr key={payment.paymentId}>
                  <td>{payment.paymentId}</td>
                  <td>{patientName}</td>
                  <td>{payment.appointmentId}</td>
                  <td>{payment.cost}</td>
                  <td>{payment.date}</td>
                  <td>{t(payment.status.toLowerCase())}</td>
                  <td>
                    {payment.status === "Pending" ? (
                      <button
                        className="btn btn-success"
                        onClick={() => handleOpenModal(payment)}
                      >
                        {t("mark_as_paid")}
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning"
                        onClick={() =>
                          setPayments((prev) =>
                            prev.map((p) =>
                              p.paymentId === payment.paymentId
                                ? { ...p, status: "Pending" }
                                : p
                            )
                          )
                        }
                      >
                        {t("set_to_pending")}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="no-results">
                {t("no_payments_found")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Payment Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("select_payment_method")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("choose_method_to_pay")}</p>
          <div className="d-flex justify-content-around mt-4">
            <Button variant="success" onClick={() => handlePaymentMethod("cash")}>
              💵 {t("pay_cash")}
            </Button>
            <Button variant="primary" onClick={() => handlePaymentMethod("visa")}>
              💳 {t("pay_visa")}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Payments;