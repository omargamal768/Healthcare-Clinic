// App.js
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
import Orders from "./pages/Orders"; // ✅ Import your Orders page

// ------------------- Role Context -------------------
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

// ------------------- PrivateRoute -------------------
const PrivateRoute = ({ children, allowedRoles }) => {
  const { role } = useRole();
  if (!role) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/login" />;
  return children;
};

// ------------------- App -------------------
const App = () => {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [numFetches, setNumFetches] = useState(0);

  // ------------------- States -------------------
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]); // ✅ NEW state for Orders

  // ------------------- RTL toggle -------------------
  useEffect(() => {
    document.body.classList.toggle("rtl", i18n.language === "ar");
  }, [i18n.language]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  // ------------------- Fetch Patients -------------------
  async function fetchPatientsData() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/admin/api/patients/?page=${currentPage - 1}`,
        { headers: { Authorization: `Bearer ${token}` } }
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
  const handlePatientDelete = () => setNumFetches((prev) => prev + 1);

  // ------------------- Fetch Reservations -------------------
  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/reservations/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  // ------------------- Fetch Orders -------------------
  const fetchOrdersData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/public/orders/");
      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // ------------------- Delete Order -------------------
  const handleOrderDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:8080/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  // ------------------- Initial fetch -------------------
  useEffect(() => {
    fetchPatientsData();
    fetchReservations();
    fetchOrdersData(); // ✅ also fetch orders
  }, [currentPage, numFetches]);

  // ------------------- CRUD Patients -------------------
  const addPatient = async (newPatient) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/admin/api/patients/",
        newPatient,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === "success") {
        await fetchPatientsData();
      }
    } catch (error) {
      console.error("Failed to add patient:", error);
    }
  };
  const updatePatient = (updatedPatient) => {
    setPatients(patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
  };
  const deletePatient = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
    setAppointments(appointments.filter((a) => a.patientId !== id));
    setPayments(payments.filter((p) => p.patientId !== id));
    fetchPatientsData();
  };

  // ------------------- CRUD Payments -------------------
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

  // ------------------- Logout -------------------
  const handleLogout = () => {
    setRole("");
    navigate("/login", { replace: true });
  };

  // ------------------- JSX -------------------
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
              {/* Public Home */}
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
              {/* Login */}
              <Route path="/login" element={<Login onLogin={setRole} />} />

              {/* Private routes */}
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
                          onAddAppointment={(newApp) =>
                            setAppointments([...appointments, newApp])
                          }
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

                  {/* ✅ Orders route */}
                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute allowedRoles={["admin"]}>
                        <Orders
                          orders={orders}
                          setOrders={setOrders}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          totalPages={totalPages}
                          fetchOrdersData={fetchOrdersData}
                          handleOrderDelete={handleOrderDelete}
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
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default App;
