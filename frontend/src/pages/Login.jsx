
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.jpg"; 

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      console.error("Email and Password are required");
      alert("⚠️ Email and Password are required!");
      return;
    }

    if (isRegister) {
      if (!formData.name.trim() || !formData.confirmPassword.trim()) {
        alert("⚠️ All fields are required!");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("❌ Passwords do not match!");
        return;
      }
    }

    try {
      const url = isRegister ? "http://localhost:5000/register" : "http://localhost:5000/login";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: isRegister ? formData.name.trim() : undefined,
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(isRegister ? "✅ Registration successful! Please log in." : "✅ Login successful!");
        if (isRegister) {
          setIsRegister(false);
        } else {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        }
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-main">
      <div className="login-container">
        <div className="login-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <h1>{isRegister ? "REGISTRATION" : forgotPassword ? "RESET PASSWORD" : "LOGIN"}</h1>

        <form onSubmit={handleSubmit} className="inline-form">
          {isRegister && (
            <div className="input-group same-size-input">
              <label htmlFor="name"> Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group same-size-input">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {!forgotPassword && (
            <>
              <div className="input-group same-size-input">
                <label htmlFor="password">Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {isRegister && (
                <div className="input-group same-size-input">
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </>
          )}

          <div className="login-center-buttons">
            <button type="submit" className="login-btn">
              {isRegister ? "Sign Up" : forgotPassword ? "Reset Password" : "Log In"}
            </button>
          </div>
        </form>

        {!forgotPassword && !isRegister && (
          <p className="login-bottom-p">
            <a href="#" className="forgot-pass-link" onClick={() => setForgotPassword(true)}>
              Forgot password?
            </a>
          </p>
        )}

        {!forgotPassword && (
          <p className="login-bottom-p">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <a href="#" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Log In" : "Sign Up"}
            </a>
          </p>
        )}

        {forgotPassword && (
          <p className="login-bottom-p">
            <a href="#" onClick={() => setForgotPassword(false)}>
              Back to Login
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
