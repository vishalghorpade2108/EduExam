/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ClockIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";

export default function StudentDetails() {
  const { examKey } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
  });

  const [exam, setExam] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH EXAM DETAILS ================= */
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/exam/key/${examKey}`
        );
        setExam(res.data);
        setTeacherName(res.data.teacherName);
      } catch (err) {
        alert("Invalid Exam Key or Exam not found");
        navigate(-1);
      }
    };

    fetchExam();
  }, [examKey, navigate]);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.rollNo) {
    alert("All fields are required");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      `http://localhost:5000/api/exam/${examKey}/student`,
      formData
    );

    const { studentId, status } = res.data;

    localStorage.setItem("studentId", studentId);

    // 🔁 Decide where to go based on status
    if (status === "IN_PROGRESS") {
      navigate(`/student/exam/${examKey}`);
    } else {
      navigate(`/student/examInstruction/${examKey}`);
    }

  } catch (error) {
    // ❌ Already submitted
    if (error.response?.data?.status === "SUBMITTED") {
      alert("You have already submitted this exam.");
      return;
    }

    alert(
      error.response?.data?.message ||
      "Unable to Register. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-6xl">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1 text-sm"
          style={{ color: "#2a384a" }}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </button>

        {/* ================= EXAM DETAILS ================= */}
        {exam && (
          <div
            className="rounded-xl shadow-lg p-6 mb-10 border-l-8"
            style={{
              borderColor: "#2a384a",
              backgroundColor: "#f8fafc",
            }}
          >
            <h2
              className="text-xl font-bold mb-6 flex items-center gap-2"
              style={{ color: "#2a384a" }}
            >
              <BookOpenIcon className="h-6 w-6" />
              Exam Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
              <InfoItem label="Exam Name" value={exam.examName} />
              <InfoItem label="Subject" value={exam.subject} />
              <InfoItem label="Class" value={exam.className} />
              <InfoItem label="Duration" value={`${exam.duration} mins`} />
              <InfoItem label="Total Marks" value={exam.totalMarks} />
              <InfoItem label="Teacher" value={teacherName} />
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-gray-600">
              <ClockIcon className="h-4 w-4" />
              Once started, the exam timer cannot be paused.
            </div>
          </div>
        )}

        {/* ================= STUDENT FORM ================= */}
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <AcademicCapIcon
                className="h-8 w-8"
                style={{ color: "#2a384a" }}
              />
              <h2
                className="text-2xl font-bold"
                style={{ color: "#2a384a" }}
              >
                Student Details
              </h2>
            </div>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded mb-4"
              style={{ borderColor: "#2a384a" }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded mb-4"
              style={{ borderColor: "#2a384a" }}
            />

            <input
              type="text"
              name="rollNo"
              placeholder="Roll Number"
              value={formData.rollNo}
              onChange={handleChange}
              className="w-full p-3 border rounded mb-6"
              style={{ borderColor: "#2a384a" }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded"
              style={{ backgroundColor: "#2a384a" }}
            >
              {loading ? "Starting Exam..." : "Proceed to Instructions"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= INFO ITEM ================= */
function InfoItem({ label, value }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="font-semibold text-gray-800 mt-1">
        {value || "—"}
      </p>
    </div>
  );
}
