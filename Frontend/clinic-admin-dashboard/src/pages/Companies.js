import React, { useEffect, useState } from "react";
import { getAllCompanies, deleteCompany } from "../services/companyService";
import { useNavigate } from "react-router-dom";

import Table from "../components/Table";
import Popup from "../components/Popup";
import Button from "../components/Button";

export default function Companies() {

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const navigate = useNavigate();

  // ================= LOAD DATA =================

  const loadCompanies = () => {
    const token = localStorage.getItem("token");

    getAllCompanies(token)
      .then(res => {
        setCompanies(res.data);
      })
      .catch(err => {
        console.error("Companies load error:", err);
      });
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // ================= DELETE FLOW =================

  const openDeletePopup = (company) => {
    setSelectedCompany(company);
    setShowDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setSelectedCompany(null);
    setShowDeletePopup(false);
  };

  const confirmDelete = async () => {

    try {
      const token = localStorage.getItem("token");

      await deleteCompany(selectedCompany.id, token);

      closeDeletePopup();
      loadCompanies();

    } catch (error) {
      console.error("Delete company error:", error);
      alert("Failed to delete company");
    }
  };

  // ================= TABLE COLUMNS =================

  const columns = [
    {
      key: "name",
      header: "Company Name"
    },
    {
      key: "phone",
      header: "Phone"
    },
    {
      key: "contractEndDate",
      header: "Contract End"
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px" }}>

          <Button onClick={() => navigate(`/companies/edit/${row.id}`)}>
            Edit
          </Button>

          <Button onClick={() => openDeletePopup(row)}>
            Delete
          </Button>

        </div>
      )
    }
  ];

  return (
    <div className="page-container">

      <h2>Insurance Companies</h2>

      {/* TABLE COMPONENT */}
      <Table
        data={companies}
        columns={columns}
      />

      {/* ADD COMPANY BUTTON */}
      <div style={{ marginTop: "15px", display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => navigate("/companies/add")}>
          + Add Company
        </Button>
      </div>

      {/* DELETE CONFIRMATION POPUP */}
      <Popup
        isVisible={showDeletePopup}
        onClose={closeDeletePopup}
      >

        <h3>Delete Company</h3>

        <p>
          Are you sure you want to delete
          <b> {selectedCompany?.name}</b> ?
        </p>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>

          <Button onClick={confirmDelete}>
            Yes, Delete
          </Button>

          <Button onClick={closeDeletePopup}>
            Cancel
          </Button>

        </div>

      </Popup>

    </div>
  );
}
