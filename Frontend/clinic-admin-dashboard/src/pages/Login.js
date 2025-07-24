import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../App";
import "../styles/Login.css";
import profileImg from '../imges/images.png'; // تأكد من المسار الصحيح للصورة

const Login = () => {
  const { setRole } = useRole();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // مسح أي خطأ سابق

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
        throw new Error(errData.message || "فشل تسجيل الدخول");
      }

      const data = await response.json();
      const { role, token } = data;

      // حفظ الرمز المميز (token) في التخزين المحلي (localStorage)
      localStorage.setItem("token", token);

      // تعيين الدور في السياق (context)
      setRole(role);

      // إعادة التوجيه بناءً على الدور
      if (role === "admin") {
        navigate("/");
      } else if (role === "receptionist") {
        navigate("/patients");
      } else {
        navigate("/"); // مسار احتياطي للأدوار الأخرى
      }
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول");
    }
  };

  return (
    <div className="public-home bodyy">
      <div id="top"></div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid">
          <a href="#top" className="navbar-brand d-flex align-items-center">
            <strong>عيادة د. جمال أبورجيلة</strong>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#clinicNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="clinicNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link active" href="#about">نبذة</a></li>
              <li className="nav-item"><a className="nav-link" href="#services">الخدمات</a></li>
              <li className="nav-item"><a className="nav-link" href="#clinics">العيادات</a></li>
              <li className="nav-item"><a className="nav-link" href="#booking">الحجز</a></li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="login-container"> {/* هذه ستمثل خلفية الصفحة بالكامل */}

        <div className="login-card"> {/* هذا هو البطاقة البيضاء ذات الزوايا المستديرة */}
          <div className="login-form-section">
            <div className="logo-text">الشعار هنا</div>
            <div className="welcome-text">مرحباً، قم بتسجيل الدخول</div>
            <h2>تسجيل الدخول</h2>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}>
              <div className="form-group">
                <label htmlFor="username">اسم المستخدم:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">كلمة المرور:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-button">دخول</button>
            </form>

          
</div>
          <div className="login-illustration-section">
            {/* تأكد من أن مسار الصورة profileImg صحيح */}
            <img src={profileImg} alt="رسم توضيحي لتسجيل الدخول" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;