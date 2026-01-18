
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardFooter from "./DashboardFooter";
import Navbar from "./Navbar.jsx";
import {
  FolderOpen,
  Plus,
  Edit,
  MonitorPlay,
  Eye,
  MoreVertical,
  UserPlus,
  Mail,
  Share2,
  Tag,
  Folder,
  Archive,
  Trash2,
  Copy,
} from "lucide-react";

const THEME = "#2a384a";

const accessOptions = [
  { value: "Open", label: "Open", color: "bg-green-500" },
  { value: "Closed", label: "Closed", color: "bg-red-500" },
  { value: "Discoverable", label: "Discoverable", color: "bg-yellow-400" },
];

export default function DashboardExams() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [exams, setExams] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedTeacher = localStorage.getItem("teacher");

    if (!token || !storedTeacher) {
      navigate("/teacher-signin");
      return;
    }

    setTeacher(JSON.parse(storedTeacher));
  }, [navigate]);

  /* ================= FETCH EXAMS ================= */
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("https://eduexam-5c0p.onrender.com/api/exam/teacher", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setExams(data.exams || []);
      } catch (err) {
        console.error("Failed to fetch exams", err);
      }
    };

    fetchExams();
  }, []);

  if (!teacher) return null;

  const statusBadge = (status) => {
    if (status === "PUBLISHED") return "bg-green-100 text-green-700";
    if (status === "DRAFT") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };
  const handleDeleteExam = async (examId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this exam? This action cannot be undone."
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `https://eduexam-5c0p.onrender.com/api/exam/${examId}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete exam");
    }

    // ✅ Remove exam from UI without reload
    setExams((prev) => prev.filter((exam) => exam._id !== examId));
    setOpenMenu(null);

    alert("✅ Exam deleted successfully");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete exam");
  }
};



  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
       <div className="grow">
      <Navbar active="exams" />

      {/* ================= TEACHER INFO ================= */}
      <div className="bg-gray-200 px-4 py-2 text-sm text-gray-700">
        {teacher.email} – {teacher.role}
      </div>

      {/* ================= CONDITIONAL UI ================= */}
      {exams.length === 0 ? (
        /* ========== EMPTY STATE ========== */
        <div className="flex justify-center my-10">
          <div
            className="w-full max-w-md text-white p-8 rounded-xl text-center"
            style={{ backgroundColor: THEME }}
          >
            <h2 className="text-2xl font-semibold mb-4">My Exams</h2>
            <FolderOpen className="mx-auto h-14 w-14 mb-4" />
            <p className="text-lg">No exams yet</p>
            <p className="text-sm text-gray-200 mt-2 mb-6">
              You have not created any exam yet.
            </p>
            <button
              onClick={() => navigate("/teacher/new-exam")}
              className="bg-white text-[#2a384a] px-6 py-2 rounded-md font-semibold flex items-center gap-2 mx-auto"
            >
              <Plus size={18} /> New Exam
            </button>
          </div>
        </div>
      ) : (
        /* ========== EXAMS TABLE ========== */
        <div
  className="max-w-7xl mx-auto rounded-xl shadow overflow-hidden"
  style={{ backgroundColor: THEME }}
>
  <div className="flex justify-between items-center px-6 py-4 text-white">
    <h2 className="text-xl font-semibold">My Exams</h2>
    <button
      onClick={() => navigate("/teacher/new-exam")}
      className="bg-white text-[#2a384a] px-4 py-2 rounded-md font-medium flex items-center gap-2"
    >
      <Plus size={18} /> New Exam
    </button>
  </div>

  <div className="bg-white overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          <th className="px-4 py-3 text-left">Exam name</th>
          <th className="px-4 py-3">Key</th>
          <th className="px-4 py-3">Created</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Access</th>
          <th className="px-4 py-3"></th>
        </tr>
      </thead>

      <tbody>
        {exams.map((exam) => {
          const access =
            accessOptions.find((a) => a.value === exam.access) ||
            accessOptions[0];

          return (
            <tr
              key={exam._id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() =>{} }
            >
              <td className="px-4 py-3 font-medium">
                {exam.examName}
              </td>

              <td className="px-4 py-3">{exam.examKey}</td>

              <td className="px-4 py-3">
                {new Date(exam.createdAt).toLocaleDateString()}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                    exam.status
                  )}`}
                >
                  {exam.status}
                </span>
              </td>

              <td
                className="px-4 py-3"
                onClick={(e) => e.stopPropagation()}
              >
                <select
                  defaultValue={exam.access || "Open"}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {accessOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${access.color}`}
                  />
                  <span className="text-xs">{access.value}</span>
                </div>

              {access.note && exam.status === "DRAFT" && (
  <p
    className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline"
  >
    {access.note} • Edit draft
  </p>
)}

              </td>

              <td
                className="px-4 py-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 relative">
                  <Edit
  size={18}
  className="cursor-pointer  hover:text-blue-800"
  onClick={(e) => {
    e.stopPropagation(); // 🔴 IMPORTANT
    navigate(`/teacher/exam/${exam._id}/edit`);
  }}
/>
                 <MonitorPlay
  size={18}
  className="cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/teacher/exam/${exam._id}/preview`);
  }}
/>

<Eye
  size={18}
  className="cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/teacher/exam/${exam._id}/view`);
  }}
/>


                  <MoreVertical
                    size={18}
                    className="cursor-pointer"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === exam._id ? null : exam._id
                      )
                    }
                  />

                  {openMenu === exam._id && (
                    <div className="absolute right-0 top-6 w-72 bg-white shadow-lg rounded-md z-20 text-sm">
                      <MenuItem icon={<UserPlus size={16} />} label="Give another teacher access" />
                      <MenuItem icon={<Eye size={16} />} label="Reveal student identities" />
                      <MenuItem icon={<Copy size={16} />} label="Duplicate the exam" />
                      <MenuItem icon={<Mail size={16} />} label="Send resume exam keys via email" />
                      <MenuItem icon={<Share2 size={16} />} label="Share exam template via link" />
                      <MenuItem icon={<Tag size={16} />} label="Tag exam with a color" />
                      <MenuItem icon={<Folder size={16} />} label="Move to group" />
                      <MenuItem icon={<Archive size={16} />} label="Archive the exam" />
                      <MenuItem
                        icon={<Trash2 size={16} />}
                        label="Delete the exam"
                        danger
                          onClick={() => handleDeleteExam(exam._id)}
                      />
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

      )}
      </div>  
      <DashboardFooter />
    </div>
    
  );
}

function MenuItem({ icon, label, danger, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 ${
        danger ? "text-red-600" : ""
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
