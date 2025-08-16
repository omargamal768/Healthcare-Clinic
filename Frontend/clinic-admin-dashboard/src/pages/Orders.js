import React, { useState, useEffect, useCallback } from "react";
import { FaUser, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRole } from "../App";
import "../styles/Patients.css";
import "../styles/ConfirmationPopup.css";
import axios from "axios";

const Orders = ({ orders, setOrders, currentPage, setCurrentPage, totalPages, fetchOrdersData, handleOrderDelete }) => {
  const { t } = useTranslation();
  const { role } = useRole();
  const navigate = useNavigate();

  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermError, setSearchTermError] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState(null);

  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setSearchTermError("");
    setDeleteError("");
  }, [searchType, searchTerm, orders, currentPage]);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchTerm("");
    setSearchTermError("");
    setSuccessMessage("");
    setShowSuccessPopup(false);
  };

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    if (searchType === "name") {
      if (value.length <= 30) {
        setSearchTerm(value);
        setSearchTermError("");
      }
    } else if (searchType === "mobile") {
      if (/^\d*$/.test(value)) {
        if (value.length <= 11) {
          if (
            value.length >= 3 &&
            value.startsWith("01") &&
            !["0", "1", "2", "5"].includes(value[2])
          ) {
            setSearchTermError(t("mobilePrefixError"));
          } else if (value.length === 11 && !/^(010|011|012|015)\d{8}$/.test(value)) {
            setSearchTermError(t("mobileLengthError"));
          } else {
            setSearchTermError("");
          }
          setSearchTerm(value);
        }
      }
    }
  };

  const fetchOrdersForSearch = useCallback(async () => {
    if (searchTerm.trim() === "") return;

    try {
      let url = "";
      if (searchType === "name") {
        url = `http://localhost:8080/admin/api/orders/name/${searchTerm}`;
      } else if (searchType === "mobile") {
        url = `http://localhost:8080/admin/api/orders/mobile/${searchTerm}`;
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.status === "success") {
        setOrders(
          searchType === "mobile"
            ? response.data.data
              ? [response.data.data]
              : []
            : response.data.data
        );
      } else {
        setOrders([]);
        setSearchTermError(t("noOrdersFound"));
      }
    } catch (error) {
      console.error("Search failed:", error);
      setOrders([]);
      if (error.response && error.response.status === 404) {
        setSearchTermError(t("noOrdersFound"));
      } else {
        setSearchTermError(t("searchError"));
      }
    }
  }, [searchTerm, searchType, setOrders, t]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchOrdersForSearch();
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType, fetchOrdersForSearch]);

  const handleDeleteClick = (id) => {
    setOrderToDeleteId(id);
    setShowConfirmation(true);
    setDeleteError("");
    setSuccessMessage("");
    setShowSuccessPopup(false);
  };

  const confirmDelete = async () => {
    if (orderToDeleteId === null) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8080/admin/api/orders/${orderToDeleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      handleOrderDelete();

      if (response.status === 200 || (response.data && response.data.status === "success")) {
        setShowConfirmation(false);
        handleOrderDelete();
        setSuccessMessage(t("orderDeletedSuccessfully"));
        setShowSuccessPopup(true);
        setOrderToDeleteId(null);
      } else {
        setDeleteError(response.data.message || t("failedToDeleteOrder"));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      if (error.response?.data?.message) {
        setDeleteError(error.response.data.message);
      } else {
        setDeleteError(t("failedToDeleteOrder"));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setOrderToDeleteId(null);
    setShowConfirmation(false);
    setDeleteError("");
    setSuccessMessage("");
    setShowSuccessPopup(false);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    setSuccessMessage("");
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSearchTerm("");
      setSearchTermError("");
      setSuccessMessage("");
      setShowSuccessPopup(false);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage + 1 < 5) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, 5);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 4);
      }
    }

    if (startPage > 1) {
      pages.push(<button key={1} onClick={() => paginate(1)}>1</button>);
      if (startPage > 2) {
        pages.push(<span key="dots-start" className="pagination-dots">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => paginate(i)} className={currentPage === i ? "active" : ""}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-end" className="pagination-dots">...</span>);
      }
      pages.push(<button key={totalPages} onClick={() => paginate(totalPages)}>{totalPages}</button>);
    }
    return pages;
  };

  const displayedOrders = orders;

  return (
    <div className="patients-container">
      <h1>{t("orders")}</h1>

      <div className="filters">
        <select value={searchType} onChange={handleSearchTypeChange}>
          <option value="name">{t("searchByName")}</option>
          <option value="mobile">{t("searchByMobile")}</option>
        </select>
        <div className="search-input">
          <input
            type="text"
            placeholder={t("searchPlaceholder", { type: t(searchType) })}
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          {searchTermError && <p className="error-message">{searchTermError}</p>}
        </div>
      </div>

      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("mobile")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.name}</td>
                  <td>{order.mobile}</td>
                  <td className="actions">
                    <button className="btn profile" onClick={() => navigate(`/orders/${order.id}`)}>
                      {t("details")}
                    </button>
                    {role && (
                      <>
                        <button className="btn edit" onClick={() => navigate(`/add-order/${order.id}`)}>
                          {t("edit")}
                        </button>
                        <button
                          className="btn delete"
                          onClick={() => handleDeleteClick(order.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting && orderToDeleteId === order.id ? t("deleting") + "..." : t("delete")}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">{t("noOrdersFound")}</td>
              </tr>
            )}
          </tbody>
        </table>

        {searchTerm.trim() === "" && (
          <nav className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              {t("previous")}
            </button>
            {renderPageNumbers()}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              {t("next")}
            </button>
          </nav>
        )}

        <div className="filters">
          <button className="btn add" onClick={() => navigate("/add-order")}>
            <FaUser /> {t("addNewOrder")}
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <FaExclamationTriangle className="warning-icon" />
            <p>{t("confirmDeleteMessage")}</p>
            {deleteError && <p className="error-message">{deleteError}</p>}
            <div className="confirmation-buttons">
              <button
                className="btn confirm-button delete-action"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? t("deleting") + "..." : t("confirmDelete")}
              </button>
              <button className="btn cancel-button" onClick={cancelDelete} disabled={isDeleting}>
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <FaCheckCircle className="success-icon" />
            <p>{successMessage}</p>
            <div className="confirmation-buttons">
              <button className="btn confirm-button" onClick={handleSuccessPopupClose}>
                {t("okay")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
