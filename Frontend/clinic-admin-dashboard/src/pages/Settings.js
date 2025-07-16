import React from "react";
import { Button } from "react-bootstrap";
import ExportCSV from "../components/ExportCSV";
import ExportPDF from "../components/ExportPDF";

const Settings = ({ patients, appointments, payments }) => {

  const handleBackup = async () => {
    try {
      const response = await fetch("http://localhost:3000/backup");
      const data = await response.json();
      if (data.message === "Backup successful") {
        alert("Backup completed successfully!");
      } else {
        alert("Backup failed.");
      }
    } catch (error) {
      alert("An error occurred while backing up data.");
    }
  };

  return (
    <div className="settings-container">
      <h1>Dashboard</h1>
      <p>Welcome to the Clinic Admin</p>

      <div className="settings-section">
        <Button variant="secondary" onClick={handleBackup}>
          Backup Database
        </Button>

        <ExportCSV patients={patients} appointments={appointments} payments={payments} />
        <ExportPDF patients={patients} appointments={appointments} payments={payments} />
      </div>
    </div>
  );
};

export default Settings;
