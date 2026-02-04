/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../teacher/Navbar.jsx";
import { ChevronDown, Search, Eye, Printer } from "lucide-react";

/* ================= MAIN COMPONENT ================= */

export default function MonitoringResults() {
  const teacher = JSON.parse(localStorage.getItem("teacher"));
const token = localStorage.getItem("token");
console.log("Teacher info:", token);
  const [mainTab, setMainTab] = useState("monitoring");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [attempts, setAttempts] = useState([]);

  /* ========== SAFETY ========== */
  if (!teacher?.id) {
    return (
      <p className="text-center mt-10 text-red-500">
        Teacher not logged in
      </p>
    );
  }

  /* ================= FETCH EXAMS ================= */
  useEffect(() => {
    const fetchTeacherExams = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/teacher/${teacher.id}/exams`
        );
        setExams(res.data);
        if (res.data.length) setSelectedExam(res.data[0]);
      } catch (err) {
        console.error("Failed to load exams", err);
      }
    };
    fetchTeacherExams();
  }, []);

  /* ================= FETCH ATTEMPTS ================= */
  useEffect(() => {
    if (!selectedExam?.examKey) return;

    const fetchAttempts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/exam/${selectedExam.examKey}/attempts`
        );
        setAttempts(res.data.attempts || []);
      } catch (err) {
        console.error("Failed to load attempts", err);
      }
    };

    fetchAttempts();
  }, [selectedExam]);

  /* ================= DERIVED DATA ================= */
  const submitted = attempts.filter((a) => a.submitted);
  const ongoing = attempts.filter((a) => !a.submitted);

  /* ================= PRINT RESULTS ================= */
  const printResults = () => {
    const table = document.getElementById("resultsTable");
    if (!table) return alert("No results to print.");

    const win = window.open("", "", "width=900,height=650");

    win.document.write(`
      <html>
      <head>
        <title>Exam Results</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { text-align: center; }
          .exam-info { margin-bottom: 20px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; text-align: center; }
          th, td { border: 1px solid #000; padding: 8px; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>

        <h2>Exam Results</h2>

        <div class="exam-info">
          <p><strong>Subject:</strong> ${selectedExam.subject}</p>
          <p><strong>Class:</strong> ${selectedExam.class}</p>
          <p><strong>Exam Key:</strong> ${selectedExam.examKey}</p>
          <p><strong>Total Marks:</strong> ${selectedExam.totalMarks}</p>
        </div>

        ${table.outerHTML}

      </body>
      </html>
    `);

    win.document.close();
    win.print();
    win.close();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar active="monitoring" />

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* ========== LEFT SIDEBAR ========== */}
        <aside className="w-64 bg-white rounded-lg shadow p-4 space-y-4">
          <h3 className="font-semibold">Your Exams</h3>

          <select
            value={selectedExam?._id || ""}
            onChange={(e) =>
              setSelectedExam(exams.find((x) => x._id === e.target.value))
            }
            className="w-full border rounded px-3 py-2 text-sm"
          >
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.subject} ({exam.class})
              </option>
            ))}
          </select>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              placeholder="Search student"
              className="w-full pl-9 pr-3 py-2 border rounded text-sm"
            />
          </div>

          <div className="text-sm space-y-4">
            <div>
              <p className="font-medium">
                Submitted ({submitted.length})
              </p>
              {submitted.map((s) => (
                <p key={s.studentId} className="text-gray-500">
                  {s.student?.rollNo} – {s.student?.name}
                </p>
              ))}
            </div>

            <div>
              <p className="font-medium">
                Not Submitted ({ongoing.length})
              </p>
              {ongoing.map((s) => (
                <p key={s.studentId} className="text-gray-500">
                  ⚡ {s.student?.rollNo} – {s.student?.name}
                </p>
              ))}
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <main className="flex-1 bg-white rounded-lg shadow p-6">

          {/* TABS */}
          <div className="flex border-b mb-6">
            <Tab
              label="Monitoring"
              active={mainTab === "monitoring"}
              onClick={() => setMainTab("monitoring")}
            />
            <Tab
              label="Results"
              active={mainTab === "results"}
              onClick={() => setMainTab("results")}
            />
          </div>

          {mainTab === "monitoring" && selectedExam && (
            <MonitoringCard
              exam={selectedExam}
              submitted={submitted}
              ongoing={ongoing}
            />
          )}

          {mainTab === "results" && selectedExam && (
            <ResultsTable
              exam={selectedExam}
              attempts={attempts}
              onPrint={printResults}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ================= MONITORING ================= */

function MonitoringCard({ exam, submitted, ongoing }) {
  const endExamForAll = async () => {
    if (!confirm("Are you sure you want to end the exam for all students?")) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/exam/end`,
        { examKey: exam.examKey }
      );
      alert("Exam ended for all students.");
    } catch (err) {
      alert("Failed to end exam.");
    }
  };

  const previewExam = () => {
    window.open(`/teacher/exam/${exam._id}/view`, "_blank");
  };

  return (
  <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        {exam.subject} – {exam.class}
      </h2>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <InfoRow label="Exam Key" value={exam.examKey} />

          <div>
            <label className="text-sm text-gray-500">Student Status</label>
            <div className="grid grid-cols-2 mt-3">
              <StatusCard
                label="Ongoing"
                value={`${ongoing.length} / ${submitted.length + ongoing.length}`}
                color="blue"
              />
              <StatusCard
                label="Submitted"
                value={`${submitted.length} / ${submitted.length + ongoing.length}`}
                color="green"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
  
  {exam.status === "ENDED" && (
    <span className=" text-center  text-xs px-4 py-2 rounded-full bg-red-100 text-red-600 border border-red-400">
      ENDED
    </span>
  )}
</h2>

        {exam.status !== "ENDED" && (
  <ActionBtn dark onClick={endExamForAll}>
    End exam for all
  </ActionBtn>
)}
   <ActionBtn icon={<Eye size={16} />} onClick={previewExam}>Preview exam</ActionBtn>
        </div>
      </div>
    </div>
  );
}


function InfoRow({ label, value }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <div className="flex items-center gap-2 mt-1 font-medium">
        {value}
        <ChevronDown size={16} />
      </div>
    </div>
  );
}
function StatusCard({ label, value, color }) { const border = color === "blue" ? "border-blue-500" : "border-green-500"; return ( <div className={`border-b-2 ${border} py-4 text-center`}> <p className="text-xl font-semibold">{value}</p> <p className="text-sm text-gray-500">{label}</p> </div> ); }

/* ================= RESULTS ================= */

function ResultsTable({ exam, attempts, onPrint }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ActionBtn icon={<Printer size={16} />} onClick={onPrint}>
          Print results
        </ActionBtn>
      </div>

      <table id="resultsTable" className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th>Student</th>
            <th>Score</th>
            <th>Class</th>
            <th>Warnings</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {attempts.map((s) => (
            <tr key={s.studentId} className="border-b">
              <td>{s.student?.name}</td>
              <td>{s.student?.totalMarks ?? 0} / {exam.totalMarks}</td>
              <td>{exam.class}</td>
              <td>{s.warnings}</td>
              <td>
                {s.submittedAt
                  ? new Date(s.submittedAt).toLocaleTimeString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 text-sm font-medium ${
        active
          ? "border-b-2 border-blue-500 text-blue-600"
          : "text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

function ActionBtn({ children, icon, dark, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex text-center items-center gap-2 px-4 py-2 rounded-full border text-sm ${
        dark ? "bg-gray-900 text-white text-center" : "hover:bg-gray-100"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
