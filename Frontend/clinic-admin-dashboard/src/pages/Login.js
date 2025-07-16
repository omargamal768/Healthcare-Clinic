import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../App";
import "../styles/Login.css";

const Login = () => {
  const { setRole } = useRole();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // Clear any previous error

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Login failed");
      }

      const data = await response.json();
      const { role, token } = data;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Set role in context
      setRole(role);

      // Redirect based on role
      if (role === "admin") {
        navigate("/");
      } else if (role === "receptionist") {
        navigate("/patients");
      } else {
        navigate("/"); // fallback for other roles
      }

    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
