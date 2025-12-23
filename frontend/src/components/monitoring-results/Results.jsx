import { useState } from "react";
import DashboardNavbar from "../teacher/Navbar.jsx";
import {
  ChevronDown,
  Share2,
  Timer,
  UserCheck,
  Key,
  Eye,
  Printer,
  Download,
  Send,
  Filter,
  Search,
} from "lucide-react";

/* ================= MAIN COMPONENT ================= */

export default function MonitoringResults() {
  const [mainTab, setMainTab] = useState("monitoring");
  const [resultTab, setResultTab] = useState("students");
  const [subject, setSubject] = useState("DSA");

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar active="monitoring" />

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* ========== LEFT SIDEBAR ========== */}
        <aside className="w-64 bg-white rounded-lg shadow p-4 space-y-4">
          <h3 className="font-semibold">Overview</h3>

          <div>
            <label className="text-sm text-gray-600">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2 text-sm"
            >
              <option>DSA</option>
              <option>Operating System</option>
              <option>Computer Networks</option>
              <option>DBMS</option>
            </select>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              placeholder="Search name"
              className="w-full pl-9 pr-3 py-2 border rounded text-sm"
            />
          </div>

          <div className="flex justify-between text-sm">
            <span>Show names</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="text-sm space-y-2">
            <div>
              <p className="font-medium">Submitted (1)</p>
              <p className="text-gray-500">MC24035 Vishal</p>
            </div>
            <div>
              <p className="font-medium">Not submitted (1)</p>
              <p className="text-gray-500">⚡ Test Student</p>
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <main className="flex-1 bg-white rounded-lg shadow p-6">

          {/* TOP TABS */}
          <div className="flex border-b mb-6">
            <Tab label="Monitoring" active={mainTab === "monitoring"} onClick={() => setMainTab("monitoring")} />
            <Tab label="Results" active={mainTab === "results"} onClick={() => setMainTab("results")} />
          </div>

          {mainTab === "monitoring" && <MonitoringCard subject={subject} />}
          {mainTab === "results" && (
            <ResultsTable
              subject={subject}
              resultTab={resultTab}
              setResultTab={setResultTab}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ================= MONITORING ================= */

function MonitoringCard({ subject }) {

  const printContent = (id) => {
    const html = document.getElementById(id).innerHTML;
    const win = window.open("", "", "width=900,height=700");
    win.document.write(`
      <html>
      <head>
        <title>Print</title>
        <style>
          body { font-family: Arial; padding: 40px; }
          h2 { margin-bottom: 5px; }
          hr { margin: 20px 0; }
        </style>
      </head>
      <body>${html}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-semibold">{subject}</h2>

      <div className="grid grid-cols-2 gap-8">

        {/* LEFT INFO */}
        <div className="space-y-4">
          <InfoRow label="Exam key" value="fjjtrn" />

          <InfoRow
            label="Access"
            value={
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Closed
              </span>
            }
          />

          <div>
            <label className="text-sm text-gray-500">Student status</label>
            <div className="grid grid-cols-2 mt-3">
              <StatusCard label="Ongoing" value="0 / 1" color="blue" />
              <StatusCard label="Submitted" value="1 / 1" color="green" />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <ActionBtn dark>End exam for all</ActionBtn>
          <ActionBtn icon={<Timer size={16} />}>Set timer</ActionBtn>
          <ActionBtn icon={<UserCheck size={16} />}>Reveal identities</ActionBtn>
          <ActionBtn icon={<Key size={16} />}>Exam keys</ActionBtn>
          <ActionBtn icon={<Eye size={16} />}>Preview exam</ActionBtn>

          <ActionBtn icon={<Printer size={16} />} onClick={() => printContent("print-exam")}>
            Print empty exam
          </ActionBtn>

          <ActionBtn icon={<Printer size={16} />} onClick={() => printContent("print-answers")}>
            Print answer key
          </ActionBtn>
        </div>
      </div>

      {/* ========== PRINT TEMPLATES ========== */}
      <div id="print-exam" style={{ display: "none" }}>
        <img src="/logo.png" width="120" alt="Logo" />
        <h2>{subject} Examination</h2>
        <p>Name: _____________________</p>
        <p>Date: _____________________</p>
        <hr />
        <p><b>Q1.</b> What is Stack?</p>
        <p>________________________________</p>
        <p><b>Q2.</b> Explain Queue.</p>
        <p>________________________________</p>
      </div>

      <div id="print-answers" style={{ display: "none" }}>
        <img src="/logo.png" width="120" alt="Logo" />
        <h2>{subject} – Answer Key</h2>
        <hr />
        <p><b>Q1.</b> Stack is a LIFO data structure.</p>
        <p><b>Q2.</b> Queue is a FIFO data structure.</p>
      </div>

    </div>
  );
}

/* ================= RESULTS ================= */

const students = [
  { id: 1, name: "Rahul Patil", points: "18 / 20", className: "TY", teacher: "Prof. A", submittedAt: "10:45 AM" },
];

function ResultsTable({ subject, resultTab, setResultTab }) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">{subject}</h2>
        <div className="flex gap-2">
          <ActionBtn icon={<Share2 size={16} />}>Export</ActionBtn>
          <ActionBtn icon={<Download size={16} />}>Download</ActionBtn>
          <ActionBtn icon={<Printer size={16} />}>Print</ActionBtn>
          <ActionBtn icon={<Send size={16} />}>Send</ActionBtn>
        </div>
      </div>

      <div className="border-b mb-4 flex gap-6">
        <Tab label="Students" active={resultTab === "students"} onClick={() => setResultTab("students")} />
        <Tab label="Questions" active={resultTab === "questions"} onClick={() => setResultTab("questions")} />
        <Tab label="Statistics" active={resultTab === "statistics"} onClick={() => setResultTab("statistics")} />
      </div>

      {resultTab === "students" && (
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Student</th>
              <th className="px-3 py-2">Points</th>
              <th className="px-3 py-2">Class</th>
              <th className="px-3 py-2">Teacher</th>
              <th className="px-3 py-2">Submitted</th>
              <th className="px-3 py-2 text-right"><Filter size={16} /></th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="px-3 py-2 text-blue-600">{s.name}</td>
                <td className="px-3 py-2">{s.points}</td>
                <td className="px-3 py-2">{s.className}</td>
                <td className="px-3 py-2">{s.teacher}</td>
                <td className="px-3 py-2">{s.submittedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {resultTab !== "students" && <p className="text-gray-500">Coming soon…</p>}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 text-sm font-medium ${
        active ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
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
  const border = color === "blue" ? "border-blue-500" : "border-green-500";
  return (
    <div className={`border-b-2 ${border} py-4 text-center`}>
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ActionBtn({ children, icon, dark, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${
        dark ? "bg-gray-900 text-white" : "hover:bg-gray-100"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
