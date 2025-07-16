import React from 'react';
import { Button } from 'react-bootstrap';
import { jsPDF } from 'jspdf';

const ExportPDF = ({ patients, appointments, payments }) => {
  
  const generatePDF = (data, title) => {
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    data.forEach((item, index) => {
      doc.text(JSON.stringify(item), 10, 20 + (index * 10));
    });
    doc.save(`${title}.pdf`);
  };

  const handleExportPatientsPDF = () => {
    generatePDF(patients, 'Patients Report');
  };

  const handleExportAppointmentsPDF = () => {
    generatePDF(appointments, 'Appointments Report');
  };

  const handleExportPaymentsPDF = () => {
    generatePDF(payments, 'Payments Report');
  };

  return (
    <div>
      <h1>Export Data to PDF</h1>
      <Button onClick={handleExportPatientsPDF}>Export Patients to PDF</Button>
      <Button onClick={handleExportAppointmentsPDF}>Export Appointments to PDF</Button>
      <Button onClick={handleExportPaymentsPDF}>Export Payments to PDF</Button>
    </div>
  );
};

export default ExportPDF;
