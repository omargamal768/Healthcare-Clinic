import { useEffect, useState } from "react";
import { getAllCompanies, deleteCompany } from "../../services/companyService";
import { useNavigate } from "react-router-dom";

export default function CompanyList() {

  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    getAllCompanies().then(res => {
      setCompanies(res.data);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this company?")) {
      deleteCompany(id).then(() => loadCompanies());
    }
  };

  return (
    <div className="page">

      <h2>Insurance Companies</h2>

      <button onClick={() => navigate("/companies/add")}>
        Add Company
      </button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Contract End</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {companies.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.contractEndDate}</td>

              <td>
                <button onClick={() => navigate(`/companies/edit/${c.id}`)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(c.id)}>
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
