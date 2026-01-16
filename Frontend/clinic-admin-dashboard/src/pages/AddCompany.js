import React, { useEffect, useState } from "react";
import { saveCompany, getCompanyById } from "../services/companyService";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";

export default function AddCompany() {

  const navigate = useNavigate();
  const { id } = useParams(); // if exists → EDIT MODE

  const isEditMode = Boolean(id);

  const [company, setCompany] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    contractStartDate: "",
    contractEndDate: "",
    papersDeadline: ""
  });

  const [loading, setLoading] = useState(false);

  // ================= LOAD COMPANY FOR EDIT =================

  useEffect(() => {

    if (isEditMode) {

      const token = localStorage.getItem("token");

      getCompanyById(id, token)
        .then(res => {
          setCompany(res.data);
        })
        .catch(err => {
          console.error("Load company error:", err);
          alert("Failed to load company data");
        });
    }

  }, [id, isEditMode]);

  // ================= INPUT HANDLER =================

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value
    });
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await saveCompany(company, token);

      alert(isEditMode ? "Company updated successfully" : "Company added successfully");

      navigate("/companies");

    } catch (error) {
      console.error("Save company error:", error);
      alert("Failed to save company");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <h2>{isEditMode ? "Edit Insurance Company" : "Add Insurance Company"}</h2>

      <form onSubmit={handleSubmit} className="form">

        <input
          name="name"
          placeholder="Company Name"
          value={company.name}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={company.phone}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={company.email}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Address"
          value={company.address}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={company.description}
          onChange={handleChange}
        />

        <label>Contract Start Date</label>
        <input
          type="date"
          name="contractStartDate"
          value={company.contractStartDate || ""}
          onChange={handleChange}
        />

        <label>Contract End Date</label>
        <input
          type="date"
          name="contractEndDate"
          value={company.contractEndDate || ""}
          onChange={handleChange}
        />

        <label>Papers Deadline Day</label>
        <input
          type="number"
          min="1"
          max="28"
          name="papersDeadline"
          value={company.papersDeadline || ""}
          onChange={handleChange}
        />

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>

          <Button type="submit">
            {loading ? "Saving..." : isEditMode ? "Update Company" : "Save Company"}
          </Button>

          <Button onClick={() => navigate("/companies")}>
            Cancel
          </Button>

        </div>

      </form>

    </div>
  );
}
