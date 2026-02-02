import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import DashboardFooter from "./DashboardFooter";

const THEME = "#2a384a";

export default function TeacherExamView() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [examInfo, setExamInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/teacher-signin");
  }, [navigate]);

  /* ================= FETCH EXAM ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const examRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/exam/${examId}/view`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const qRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/exam/${examId}/questions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
       
        setExamInfo(examRes.data.exam);
        console.log("Questions fetched:", qRes.data);
        setQuestions(qRes.data.question || []);
        setLoading(false);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        alert("Failed to load exam");
        
      }
    };

    fetchData();
  }, [examId, navigate]);

  if (loading) {
    return <p className="text-center mt-10">Loading exam...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar active="" />

      <div className="grow p-6 max-w-6xl mx-auto w-full">

        {/* ================= EXAM INFO ================= */}
        {examInfo && (
          <div className="bg-white rounded shadow p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
              <Info label="Exam" value={examInfo.examName} />
              <Info label="Subject" value={examInfo.subject} />
              <Info label="Class" value={examInfo.class} />
              <Info label="Status" value={examInfo.status} />
              <Info label="Total Marks" value={examInfo.totalMarks} />
            </div>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div
          className="flex justify-between items-center p-4 rounded mb-6"
          style={{ backgroundColor: THEME, color: "white" }}
        >
          <div>📝 Total Questions: {questions.length}</div>

          <button
            onClick={() => setShowAnswers((p) => !p)}
            className="bg-white text-[#2a384a] px-4 py-2 rounded font-medium"
          >
            {showAnswers ? "Hide Answers" : "Show Answers"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="border border-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>

        {/* ================= QUESTIONS ================= */}
        <div className="space-y-6">
  {questions.map((q, index) => (
    <div key={q._id} className="bg-white p-6 rounded shadow">
      <h3 className="font-semibold mb-2">
        Q{index + 1}. {q.question}
        <span className="ml-2 text-sm text-gray-500">
          ({q.marks} marks)
        </span>
      </h3>

      <p className="text-xs text-gray-500 mb-4">
        Difficulty: {q.difficulty}
      </p>

      <div className="space-y-3">
        {q.options.map((opt, idx) => {
          const isCorrect = Number(q.correctOption) === idx;

          return (
            <div
              key={idx}
              className={`p-3 border rounded ${
                showAnswers && isCorrect
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}

              {showAnswers && isCorrect && (
                <span className="ml-3 text-green-700 text-sm font-semibold">
                  ✔ Correct
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  ))}
</div>

      </div>

      <DashboardFooter />
    </div>
  );
}

/* ================= SMALL INFO COMPONENT ================= */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 font-semibold">{label}</p>
      <p className="text-gray-800 font-medium">{value || "-"}</p>
    </div>
  );
}
