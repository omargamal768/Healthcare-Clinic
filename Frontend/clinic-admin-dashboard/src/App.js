import React, { useState, createContext, useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import "./App.css";
import AddPatient from "./pages/AddPatient";
import Payments from "./pages/Payments";
import { NotificationProvider } from "./components/NotificationContext";
import { useTranslation } from "react-i18next";
import AddAppointment from "./pages/AddAppoiment";
import axios from "axios";
import PublicHome from "./pages/PublicHome";

// Role Context
const RoleContext = createContext();
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("");
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
export const useRole = () => useContext(RoleContext);

// PrivateRoute wrapper
const PrivateRoute = ({ children, allowedRoles }) => {
  const { role } = useRole();
  if (!role) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [numFetches, setNumFetches] = useState(0);
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    document.body.classList.toggle("rtl", i18n.language === "ar");
  }, [i18n.language]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  // Fetch patient data and update state
  async function fetchPatientsData() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/admin/api/patients/?page=${currentPage - 1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setPatients(response.data.data);
        setTotalPatients(response.data.total);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  }

  const handlePatientDelete = () => {
    setNumFetches((prev) => prev + 1);
  };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/reservations/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  // Initial fetch and re-fetch when currentPage or numFetches changes
  useEffect(() => {
    fetchPatientsData();
    fetchReservations();
  }, [currentPage, numFetches]);

  const addPatient = async (newPatient) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/admin/api/patients/",
        newPatient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        await fetchPatientsData();
      }
    } catch (error) {
      console.error("Failed to add patient:", error);
    }
  };

  const updatePatient = (updatedPatient) => {
    setPatients(
      patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
  };

  const deletePatient = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
    setAppointments(appointments.filter((a) => a.patientId !== id));
    setPayments(payments.filter((p) => p.patientId !== id));
    fetchPatientsData();
  };

  const addAppointment = (newAppointment) => {
    setAppointments([...appointments, { ...newAppointment, id: Date.now() }]);
  };

  const addPayment = (newPayment) => {
    setPayments([...payments, { ...newPayment, paymentId: Date.now() }]);
  };

  const updatePayment = (updatedPayment) => {
    setPayments(
      payments.map((p) =>
        p.paymentId === updatedPayment.paymentId ? updatedPayment : p
      )
    );
  };

  const deletePayment = (id) => {
    setPayments(payments.filter((p) => p.paymentId !== id));
  };

  const handleLogout = () => {
    setRole("");
    navigate("/login", { replace: true });
  };

  return (
    <NotificationProvider>
      <div className={`app ${role ? "with-sidebar" : ""}`}>
        {role && <Sidebar />}
        <div className="content">
          {role && (
            <div className="navbar">
              <Navbar onLogout={handleLogout} toggleLanguage={toggleLanguage} />
            </div>
          )}
          <div className="scrollable-content">
            <Routes>
              {/* Public Home when not logged in */}
              <Route
                path="/"
                element={
                  role ? (
                    <PrivateRoute>
                      <Dashboard
                        totalPatients={totalPatients}
                        appointments={appointments}
                        setAppointments={setAppointments}
                        patients={patients}
                      />
                    </PrivateRoute>
                  ) : (
                    <PublicHome />
                  )
                }
              />

              {/* Login route */}
              <Route
                path="/login"
                element={<Login onLogin={(selectedRole) => setRole(selectedRole)} />}
              />

              {/* Private routes for logged-in users */}
              {role && (
                <>
                  <Route
                    path="/patients"
                    element={
                      <PrivateRoute allowedRoles={["receptionist", "admin"]}>
                        <Patients
                          fetchPatientsData={fetchPatientsData}
                          handlePatientDelete={handlePatientDelete}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          totalPages={totalPages}
                          patients={patients}
                          setPatients={setPatients}
                          onDeletePatient={deletePatient}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/patients/:id"
                    element={
                      <PrivateRoute>
                        <Profile patients={patients} appointments={appointments} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/add-patient/:id?"
                    element={
                      <PrivateRoute>
                        <AddPatient
                          patients={patients}
                          setPatients={setPatients}
                          onAddPatient={addPatient}
                          onUpdatePatient={updatePatient}
                          onPatientAdded={fetchPatientsData}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/appointments"
                    element={
                      <PrivateRoute>
                        <Appointments
                          appointments={appointments}
                          setAppointments={setAppointments}
                          payments={payments}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/add-appointment/:id"
                    element={
                      <PrivateRoute>
                        <AddAppointment
                          patients={patients}
                          appointments={appointments}
                          onAddAppointment={addAppointment}
                          setPayments={setPayments}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/payments"
                    element={
                      <PrivateRoute>
                        <Payments
                          patients={patients}
                          payments={payments}
                          setPayments={setPayments}
                          onAddPayment={addPayment}
                          onUpdatePayment={updatePayment}
                          onDeletePayment={deletePayment}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute allowedRoles={["admin"]}>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                </>
              )}

              {/* Fallback to "/" */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default App;