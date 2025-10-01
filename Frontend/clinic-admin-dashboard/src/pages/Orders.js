import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Table from "../components/Table";
import Popup from "../components/Popup";
import Pagination from "../components/Pagination";
import axios from "axios";

const Orders = ({ onDeleteOrder, onActivateOrder }) => {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ⬅️ تاريخ الفلترة
  const [selectedDate, setSelectedDate] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage - 1, // backend 0-based
        size: 10,
      };

      if (selectedDate) {
        params.date = selectedDate;
      }

      const response = await axios.get("http://localhost:8080/api/public/orders/", { params });
      const data = response.data;

      setOrders(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, selectedDate]);

  const handleActivateClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsPopupVisible(true);
  };

  const confirmActivate = () => {
    if (selectedOrderId) {
      onActivateOrder(selectedOrderId);
    }
    setIsPopupVisible(false);
    setSelectedOrderId(null);
  };

  const ordersColumns = [
    { key: "id", header: t("id") },
    { key: "name", header: t("name") },
    { key: "mobile", header: t("mobile") },
    { key: "email", header: t("email") },
    { key: "date", header: t("date") },
    {
      key: "actions",
      header: t("actions"),
      render: (order) => (
        <>
          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => handleActivateClick(order.id)}
          >
            {t("activate")}
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDeleteOrder(order.id)}
          >
            {t("delete")}
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="orders-container">
      <h2>{t("orders")}</h2>

      {/* ⬅️ Date Filter */}
      <div className="filter-container">
        <label>{t("filter_by_date")}: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setCurrentPage(1); // reset to first page when filter changes
          }}
        />
        {selectedDate && (
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setSelectedDate("")}
          >
            {t("clear")}
          </button>
        )}
      </div>

      {loading && <div>{t("loading")}</div>}
      {error && <div className="error-message">{t("error")}: {error}</div>}

      {!loading && !error && (
        <>
          <Table data={orders} columns={ordersColumns} />
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </>
      )}

      {/* Confirmation Popup */}
      <Popup isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)}>
        <h3>{t("confirmActivateMessage", "هل أنت متأكد أنك تريد تفعيل هذا الطلب؟")}</h3>
        <div className="popup-actions">
          <button className="btn btn-success me-2" onClick={confirmActivate}>
            {t("confirmActivate", "نعم، فعل")}
          </button>
          <button className="btn btn-secondary" onClick={() => setIsPopupVisible(false)}>
            {t("cancel", "إلغاء")}
          </button>
        </div>
      </Popup>
    </div>
  );
};

export default Orders;
