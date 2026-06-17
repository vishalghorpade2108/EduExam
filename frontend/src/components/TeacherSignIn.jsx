/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo3.png";
import bg from "../assets/teacher-loginbg.jpg";
import googleLogo from "../assets/google.svg";
import microsoftLogo from "../assets/microsoft.svg";
import { GoogleLogin } from "@react-oauth/google";

import axios from "axios";
const THEME = "#2a384a";

export default function TeacherSignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [examKey, setExamKey] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save token & teacher info
      localStorage.setItem("token", data.token);
      localStorage.setItem("teacher", JSON.stringify(data.teacher));

      // ✅ Redirect to dashboard
      navigate("/teacher/exams");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError("Email is required");
      return;
    }
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email: forgotEmail });
      setForgotSuccess(res.data.message);
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotOtp || !newPassword) {
      setForgotError("OTP and new password are required");
      return;
    }
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, { 
        email: forgotEmail,
        otp: forgotOtp,
        newPassword
      });
      alert(res.data.message);
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail("");
      setForgotOtp("");
      setNewPassword("");
      setForgotSuccess("");
    } catch (err) {
      setForgotError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setForgotLoading(false);
    }
  };
  const handleExamKeySubmit = async () => {
    if (!examKey.trim()) {
      alert("Please enter exam key");
      return;
    }
  
    if (examKey.length < 5) {
      alert("Invalid exam key");
      return;
    }
  
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/exam/verify/${examKey}`
      );
  
      if (res.data.success) {
        navigate(`/student/details/${examKey}`);
      }
  
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message;
  
        // ❌ Exam not found
        if (status === 404) {
          alert("Invalid exam key. Please check and try again.");
        }
        // ❌ Exam exists but not published
        else if (status === 403) {
          alert("Exam is not published yet. Please wait for the exam to start.");
        }
        // ❌ Other server-side errors
        else {
          alert(message || "Something went wrong. Please try again.");
        }
      } else {
        // ❌ Network / server error
        alert("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <img
        src={bg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 min-h-screen">
        {/* Navbar */}
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-white">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="EduExam Logo" className="h-30 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <Link to="/" className="hover:text-gray-300 text-2xl">
              Home
            </Link>

            <div className="flex items-center bg-white rounded-3xl px-1">
        <input
          placeholder="Student Exam Key"
          value={examKey}
          onChange={(e) => setExamKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleExamKeySubmit()}
          className="px-4 py-2 text-black outline-none w-48 font-bold bg-transparent"
        />
        <button
          onClick={handleExamKeySubmit}
          className="px-4 py-2 text-white font-bold rounded-3xl"
          style={{ backgroundColor: "#2a384a" }}
        >
          →
        </button>
      </div>

            <Link
              to="/teacher-registration"
              className="border border-white px-5 py-2 rounded-3xl font-bold
              hover:bg-white hover:text-gray-900 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex justify-center items-center mt-14 px-4">
          <form
            onSubmit={handleSignIn}
            className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
          >
            <h2
              className="text-3xl font-semibold text-center mb-6"
              style={{ color: THEME }}
            >
              Sign In
            </h2>

            {error && (
              <p className="text-red-600 text-sm mb-3 text-center">
                {error}
              </p>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4 focus:ring-2"
              style={{ borderColor: THEME }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-6 focus:ring-2"
              style={{ borderColor: THEME }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-2 rounded-3xl font-semibold disabled:opacity-60"
              style={{ backgroundColor: THEME }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* OAuth */}
            <div className="mt-6 space-y-3">
              <div className="w-full flex justify-center google-btn-container">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      setError("");
                      const res = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/auth/google-login`,
                        { token: credentialResponse.credential }
                      );

                      localStorage.setItem("token", res.data.token);
                      localStorage.setItem("teacher", JSON.stringify(res.data.teacher));

                      navigate("/teacher/exams");
                    } catch (err) {
                      setError(err.response?.data?.message || "Google login failed");
                    }
                  }}
                  onError={() => {
                    setError("Google login failed");
                  }}
                  theme="outline"
                  size="large"
                  shape="pill"
                  width="384"
                />
              </div>

              <button
                type="button"
                onClick={() => setError("Microsoft sign-in is currently pending integration.")}
                className="w-full flex items-center justify-center gap-3 border rounded-full py-2 font-semibold hover:bg-gray-50 cursor-pointer"
                style={{ borderColor: THEME }}
              >
                <img src={microsoftLogo} alt="Microsoft" className="h-5 w-5" />
                Teacher sign in with Microsoft (Pending)
              </button>
            </div>

            <p
              onClick={() => setShowForgotModal(true)}
              className="text-center text-sm mt-4 cursor-pointer hover:underline"
              style={{ color: THEME }}
            >
              Forgot your password?
            </p>

            <div className="my-6 h-px bg-gray-300"></div>

            <div className="text-center">
              <p className="text-sm text-gray-700">Don’t have an account?</p>
              <p className="text-xs text-gray-500">
                No payment or commitment required
              </p>

              <Link
                to="/teacher-registration"
                className="block mt-4 border py-2 rounded font-semibold"
                style={{ borderColor: THEME, color: THEME }}
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotStep(1);
                setForgotError("");
                setForgotSuccess("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-center mb-6" style={{ color: THEME }}>
              {forgotStep === 1 ? "Forgot Password" : "Reset Password"}
            </h2>

            {forgotError && <p className="text-red-600 text-sm mb-3 text-center">{forgotError}</p>}
            {forgotSuccess && <p className="text-green-600 text-sm mb-3 text-center">{forgotSuccess}</p>}

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotPassword}>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Enter your registered email address to receive an OTP.
                </p>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-4 focus:ring-2"
                  style={{ borderColor: THEME }}
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full text-white py-2 rounded-3xl font-semibold disabled:opacity-60"
                  style={{ backgroundColor: THEME }}
                >
                  {forgotLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Enter the OTP sent to {forgotEmail} and your new password.
                </p>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-4 focus:ring-2"
                  style={{ borderColor: THEME }}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-6 focus:ring-2"
                  style={{ borderColor: THEME }}
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full text-white py-2 rounded-3xl font-semibold disabled:opacity-60"
                  style={{ backgroundColor: THEME }}
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
