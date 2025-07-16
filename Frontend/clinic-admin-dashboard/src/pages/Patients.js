import React, { useState, useEffect, useCallback } from "react";
import { FaUser, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRole } from "../App";
import "../styles/Patients.css";
import "../styles/ConfirmationPopup.css";
import axios from "axios";

const Patients = ({ patients, setPatients, currentPage, setCurrentPage, totalPages,fetchPatientsData,handlePatientDelete}) => {
  const { t } = useTranslation();
  const { role } = useRole();
  const navigate = useNavigate();

  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermError, setSearchTermError] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false); // Controls the "Are you sure?" popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);   // Controls the "Patient deleted successfully" popup
  const [patientToDeleteId, setPatientToDeleteId] = useState(null);

  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Stores the success message

  // Effect to clear all temporary messages and errors when component re-renders
  // due to changes in search, patients list, or pagination.
  useEffect(() => {
    setSearchTermError("");
    setDeleteError("");
    // We intentionally don't clear successMessage or close successPopup here
    // because the user needs to acknowledge the success popup by clicking "Okay".
    // Clearing them here would make the success popup flash and disappear.
  }, [searchType, searchTerm, patients, currentPage]);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchTerm("");
    setSearchTermError("");
    setSuccessMessage(""); // Clear success message on search type change
    setShowSuccessPopup(false); // Close success popup if changing search type
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
          // Allow '0' as first digit, but restrict '00' or '0X' where X is not 1,2,5
          if (value.length === 1 && value !== "0" && value !== "") {
            setSearchTerm(value);
            setSearchTermError("");
            return;
          }
          if (value.length === 2 && value[0] === "0" && value[1] !== "1" && value !== "") {
            setSearchTerm(value);
            setSearchTermError("");
            return;
          }

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

  const fetchPatientsForSearch = useCallback(async () => {
    if (searchTerm.trim() === "") {
      return;
    }

    try {
      let url = "";
      if (searchType === "name") {
        url = `http://localhost:8080/admin/api/patients/name/${searchTerm}`;
      } else if (searchType === "mobile") {
        url = `http://8080/admin/api/patients/mobile/${searchTerm}`;
      }

      const token = localStorage.getItem("token");

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.status === "success") {
        setPatients(searchType === "mobile" ? (response.data.data ? [response.data.data] : []) : response.data.data);
      } else {
        setPatients([]);
        setSearchTermError(t("noPatientsFound"));
      }
    } catch (error) {
      console.error("Search failed:", error);
      setPatients([]);
      if (error.response && error.response.status === 404) {
        setSearchTermError(t("noPatientsFound"));
      } else {
        setSearchTermError(t("searchError"));
      }
    }
  }, [searchTerm, searchType, setPatients, t]);


  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchPatientsForSearch();
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType, fetchPatientsForSearch]);


  const handleDeleteClick = (id) => {
    setPatientToDeleteId(id);
    setShowConfirmation(true); // Open the initial confirmation popup
    setDeleteError("");        // Clear any previous errors for a new delete attempt
    setSuccessMessage("");     // Clear any previous success messages
    setShowSuccessPopup(false); // Ensure success popup is closed when opening confirmation
  };

  const confirmDelete = async () => {
    if (patientToDeleteId === null) return;

    setIsDeleting(true); // Start loading for the delete operation
    setDeleteError("");  // Clear errors for current attempt

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8080/admin/api/patients/${patientToDeleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
         handlePatientDelete()

      if (response.status === 200 || (response.data && response.data.status === "success")) {
        console.log("hi")

        // 1. Close the initial confirmation popup IMMEDIATELY on success
        setShowConfirmation(false);
        //await fetchPatientsData()
       handlePatientDelete()

      

        // 2. Update the patients list immediately in the UI
        //setPatients((prev) => prev.filter((p) => p.id !== patientToDeleteId));

        // 3. Set success message and open the SUCCESS popup
        setSuccessMessage(t("patientDeletedSuccessfully"));
        setShowSuccessPopup(true);

        // 4. Reset patientToDeleteId
        setPatientToDeleteId(null);
      } else {
        // If API responds with an error but not a network error
        setDeleteError(response.data.message || t("failedToDeletePatient"));
        // Keep the confirmation popup open to show the error
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setDeleteError(error.response.data.message);
      } else {
        setDeleteError(t("failedToDeletePatient"));
      }
      // Keep the confirmation popup open to show the error
    } finally {
      setIsDeleting(false); // Stop loading regardless of success or failure
    }
  };

 

const cancelDelete = () => {
    setPatientToDeleteId(null);
    setShowConfirmation(false); // Close the initial confirmation popup
    setDeleteError("");
    setSuccessMessage(""); // Clear messages on cancel
    setShowSuccessPopup(false); // Ensure success popup is closed on cancel
  };

  // Function to handle closing the success popup (when user clicks 'Okay')
  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    setSuccessMessage(""); // Clear the message after closing
  };


  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSearchTerm(""); // Clear search term when paginating
      setSearchTermError("");
      setSuccessMessage(""); // Clear messages on pagination
      setShowSuccessPopup(false); // Ensure success popup is closed on pagination
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

  const displayedPatients = patients;


  return (
    <div className="patients-container">
      <h1>{t("patients")}</h1>

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
            {displayedPatients.length > 0 ? (
              displayedPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.mobile}</td>
                  <td className="actions">
                    <button className="btn profile" onClick={() => navigate(`/patients/${patient.id}`)}>
                      {t("profile")}
                    </button>
                    {role && (
                      <>
                        <button className="btn edit" onClick={() => navigate(`/add-patient/${patient.id}`)}>
                          {t("edit")}
                        </button>
                        <button
                          className="btn delete"
                          onClick={() => handleDeleteClick(patient.id)}
                          disabled={isDeleting} // Disable delete button if a deletion is in progress
                        >
                          {isDeleting && patientToDeleteId === patient.id ? t("deleting") + "..." : t("delete")}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">{t("noPatientsFound")}</td>
              </tr>
            )}
          </tbody>
        </table>

        {searchTerm.trim() === "" && ( // Only show pagination when not searching
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
          <button className="btn add" onClick={() => navigate("/add-patient")}>
            <FaUser /> {t("addNewPatient")}
          </button>
        </div>
      </div>

      {/* 1. Initial Confirmation Popup (Are you sure? - Yes/Cancel) */}
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <FaExclamationTriangle className="warning-icon" />
            <p>{t("confirmDeleteMessage")}</p>
            {deleteError && <p className="error-message">{deleteError}</p>} {/* Display delete error in this popup */}
            <div className="confirmation-buttons">
              <button
                className="btn confirm-button delete-action" // Added delete-action class here
                onClick={confirmDelete}
                disabled={isDeleting} // Disable confirm button during deletion
              >
                {isDeleting ? t("deleting") + "..." : t("confirmDelete")}
              </button>
              <button
                className="btn cancel-button"
                onClick={cancelDelete}
                disabled={isDeleting} // Disable cancel button during deletion
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Success Popup (Patient deleted successfully - Okay) */}
      {showSuccessPopup && (
        <div className="confirmation-overlay"> {/* Re-use overlay styling */}
          <div className="confirmation-popup"> {/* Re-use popup styling */}
            <FaCheckCircle className="success-icon" />
            <p>{successMessage}</p> {/* Display the success message */}
            <div className="confirmation-buttons">
              <button className="btn confirm-button" onClick={handleSuccessPopupClose}>
                {t("okay")} {/* Use a generic 'Okay' translation */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;