import axios from "axios";

const ADMIN_BASE = "http://localhost:8080/admin/api/companies";
const PUBLIC_BASE = "http://localhost:8080/api";

// ---------- ADMIN ----------

// Get all companies
export const getAllCompanies = (token) => {
  return axios.get(ADMIN_BASE+"/", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Get active companies
export const getActiveCompanies = () => {
  return axios.get(`${ADMIN_BASE}/active`);
};

// Get company by ID
export const getCompanyById = (id, token) => {
  return axios.get(`${ADMIN_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Create or Update company
export const saveCompany = (company, token) => {
  return axios.post(ADMIN_BASE+"/", company, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Delete company
export const deleteCompany = (id, token) => {
  return axios.delete(`${ADMIN_BASE}${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Statistics
export const getCompanyStatistics = (id, from, to, token) => {
  return axios.get(
    `${ADMIN_BASE}/${id}/statistics?from=${from}&to=${to}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

// ---------- PUBLIC ----------

// Patients needing papers
export const getPendingPapers = (companyId, token) => {
  return axios.get(
    `${PUBLIC_BASE}/reservations/company/${companyId}/needing-papers`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};
