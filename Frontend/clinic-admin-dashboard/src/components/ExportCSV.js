import React from 'react';
import Papa from 'papaparse';
import { Button } from 'react-bootstrap';

const ExportCSV = ({ patients, appointments, payments }) => {

  const exportToCSV = (data, fileName) => {
    const csvData = Papa.unparse(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.click();
  };

  const handleExportPatients = () => {
    exportToCSV(patients, 'patients_report');
  };

  const handleExportAppointments = () => {
    exportToCSV(appointments, 'appointments_report');
  };

  const handleExportPayments = () => {
    exportToCSV(payments, 'payments_report');
  };

  return (
    <div>
      <h1>Export Data</h1>
      <Button onClick={handleExportPatients}>Export Patients to CSV</Button>
      <Button onClick={handleExportAppointments}>Export Appointments to CSV</Button>
      <Button onClick={handleExportPayments}>Export Payments to CSV</Button>
    </div>
  );
};

export default ExportCSV;
