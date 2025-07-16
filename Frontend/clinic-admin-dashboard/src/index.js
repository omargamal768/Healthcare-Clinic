import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App, { RoleProvider } from "./App"; // Import RoleProvider
import "./index.css";
import { NotificationProvider } from "./components/NotificationContext";
import './i18n'; // ✅ this line is very important

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RoleProvider> {/* ✅ Provide Role Context at the top */}
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NotificationProvider>
        <App />
        </NotificationProvider>
      </BrowserRouter>
    </RoleProvider>
  </React.StrictMode>
  );
