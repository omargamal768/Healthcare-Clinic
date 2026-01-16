import { useState } from "react";
import { saveCompany } from "../../services/companyService";
import { useNavigate } from "react-router-dom";

export default function CompanyForm() {

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setCompany({...company, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    saveCompany(company).then(() => {
      navigate("/companies");
    });
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>Add Insurance Company</h2>

      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />

      <label>Contract Start</label>
      <input type="date" name="contractStartDate" onChange={handleChange} />

      <label>Contract End</label>
      <input type="date" name="contractEndDate" onChange={handleChange} />

      <label>Papers Deadline Day (Example: 25)</label>
      <input name="papersDeadline" onChange={handleChange} />

      <button type="submit">Save</button>

    </form>
  );
}
