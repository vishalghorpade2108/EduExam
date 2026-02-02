import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo3.png";
import bg from "../assets/teacher-loginbg.jpg";
import googleLogo from "../assets/google.svg";
import microsoftLogo from "../assets/microsoft.svg";

import axios from "axios";
const THEME = "#2a384a";

export default function TeacherSignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [examKey, setExamKey] = useState("");
  
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
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border rounded-full py-2 font-semibold hover:bg-gray-50"
                style={{ borderColor: THEME }}
              >
                <img src={googleLogo} alt="Google" className="h-5 w-5" />
                Teacher sign in with Google
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border rounded-full py-2 font-semibold hover:bg-gray-50"
                style={{ borderColor: THEME }}
              >
                <img src={microsoftLogo} alt="Microsoft" className="h-5 w-5" />
                Teacher sign in with Microsoft
              </button>
            </div>

            <p
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
    </div>
  );
}
