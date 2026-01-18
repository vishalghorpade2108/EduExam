/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../teacher/Navbar.jsx";
import { ChevronDown, Search, Eye, Printer } from "lucide-react";

/* ================= MAIN COMPONENT ================= */

export default function MonitoringResults() {
  const teacher = JSON.parse(localStorage.getItem("teacher"));

  const [mainTab, setMainTab] = useState("monitoring");
  const [resultTab, setResultTab] = useState("students");

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

  /* ================= FETCH TEACHER EXAMS ================= */
  useEffect(() => {
    const fetchTeacherExams = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/teacher/${teacher.id}/exams`
        );

        setExams(res.data);

        if (res.data.length > 0) {
          setSelectedExam(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to load exams", err);
      }
    };

    fetchTeacherExams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= FETCH ATTEMPTS ================= */
  useEffect(() => {
    if (!selectedExam?.examKey) return;

    const fetchAttempts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/exam/${selectedExam.examKey}/attempts`
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
              setSelectedExam(
                exams.find((ex) => ex._id === e.target.value)
              )
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
                  ⚡ {s.student?.rollNo} - {s.student?.name}
                </p>
              ))}
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <main className="flex-1 bg-white rounded-lg shadow p-6">

          {/* TOP TABS */}
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
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ================= MONITORING ================= */

function MonitoringCard({ exam, submitted, ongoing }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        {exam.subject} – {exam.class}
      </h2>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <InfoRow label="Exam Key" value={exam.examKey} />

          <div>
            <label className="text-sm text-gray-500">
              Student Status
            </label>
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
          <ActionBtn dark>End exam for all</ActionBtn>
          <ActionBtn icon={<Eye size={16} />}>Preview exam</ActionBtn>
          <ActionBtn icon={<Printer size={16} />}>Print results</ActionBtn>
        </div>
      </div>
    </div>
  );
}

/* ================= RESULTS ================= */

function ResultsTable({ exam, attempts }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-3 py-2 text-left">Student</th>
          <th className="px-3 py-2">Score</th>
          <th className="px-3 py-2">Class</th>
          <th className="px-3 py-2">Warnings</th>
          <th className="px-3 py-2">Submitted</th>
        </tr>
      </thead>
      <tbody>
        {attempts.map((s) => (
          <tr key={s.studentId} className="border-b">
            <td className="px-3 py-2 text-blue-600">
              {s.student?.name}
            </td>
            <td className="px-3 py-2">
              {s.student?.totalMarks ?? 0} / {exam.totalMarks}
            </td>
            <td className="px-3 py-2">{exam.class}</td>
            <td className="px-3 py-2">{s.warnings}</td>
            <td className="px-3 py-2">
              {s.submittedAt
                ? new Date(s.submittedAt).toLocaleTimeString()
                : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ================= SMALL COMPONENTS ================= */

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

function StatusCard({ label, value, color }) {
  const border =
    color === "blue" ? "border-blue-500" : "border-green-500";
  return (
    <div className={`border-b-2 ${border} py-4 text-center`}>
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ActionBtn({ children, icon, dark }) {
  return (
    <button
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${
        dark ? "bg-gray-900 text-white" : "hover:bg-gray-100"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
