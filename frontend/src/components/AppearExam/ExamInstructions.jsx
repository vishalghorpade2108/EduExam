import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/solid";

export default function ExamInstructions() {
  const { examKey } = useParams();
  const navigate = useNavigate();

  const [accepted, setAccepted] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= CHECK STUDENT REGISTRATION ================= */
  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      alert("Please enter student details first");
      navigate(-1);
    }
  }, [navigate]);

  /* ================= CAMERA PERMISSION CHECK ================= */
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraAllowed(true))
      .catch(() => setCameraAllowed(false));
  }, []);

  /* ================= BLOCK REFRESH & BACK ================= */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  /* ================= FULLSCREEN EXIT DETECTION ================= */
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        alert("Fullscreen exited. Exam will be auto-submitted.");
        // Later: call auto-submit API
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  /* ================= DISABLE COPY / PASTE / RIGHT CLICK ================= */
  useEffect(() => {
    const disable = (e) => e.preventDefault();

    document.addEventListener("contextmenu", disable);
    document.addEventListener("copy", disable);
    document.addEventListener("paste", disable);

    return () => {
      document.removeEventListener("contextmenu", disable);
      document.removeEventListener("copy", disable);
      document.removeEventListener("paste", disable);
    };
  }, []);

  /* ================= START EXAM ================= */
  const handleStartExam = async () => {
    if (!accepted) return;

    if (!cameraAllowed) {
      alert("Camera access is required to start the exam");
      return;
    }

    try {
      setLoading(true);

      const studentId = localStorage.getItem("studentId");

      // 🔴 Mark exam as started in backend
      await axios.post(
        `http://localhost:5000/api/exam/${examKey}/start`,
        { studentId }
      );

      // 🔴 Force fullscreen
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      navigate(`/student/exam/${examKey}`);
    } catch (error) {
      console.error(error);
      alert("Unable to start exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">

        {/* HEADER */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <CheckCircleIcon className="h-8 w-8" style={{ color: "#2a384a" }} />
          <h2 className="text-2xl font-bold" style={{ color: "#2a384a" }}>
            Exam Instructions
          </h2>
        </div>

        {/* RULES */}
        <ul className="space-y-3 text-gray-700 mb-6 text-sm">
          <li className="flex gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
            Do not switch tabs, minimize, or change windows.
          </li>

          <li className="flex gap-2">
            <ComputerDesktopIcon className="h-5 w-5 text-blue-500" />
            Exam must be taken in fullscreen mode only.
          </li>

          <li className="flex gap-2">
            <CameraIcon className="h-5 w-5 text-green-600" />
            Camera must remain ON throughout the exam.
          </li>

          <li className="flex gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            Copy, paste, right-click, and refresh are disabled.
          </li>

          <li className="flex gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-purple-500" />
            Multiple violations will auto-submit your exam.
          </li>
        </ul>

        {/* CAMERA WARNING */}
        {!cameraAllowed && (
          <p className="text-sm text-red-600 mb-4">
            ⚠ Camera permission not detected. Please allow camera access.
          </p>
        )}

        {/* ACCEPTANCE */}
        <div className="flex items-start gap-2 mb-6">
          <input
            type="checkbox"
            id="accept"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <label htmlFor="accept" className="text-sm text-gray-700">
            I have read and agree to all exam rules and restrictions.
          </label>
        </div>

        {/* START BUTTON */}
        <button
          disabled={!accepted || loading}
          onClick={handleStartExam}
          className="w-full text-white py-3 rounded transition disabled:opacity-50"
          style={{ backgroundColor: "#2a384a" }}
        >
          {loading ? "Starting Exam..." : "Start Exam"}
        </button>
      </div>
    </div>
  );
}
