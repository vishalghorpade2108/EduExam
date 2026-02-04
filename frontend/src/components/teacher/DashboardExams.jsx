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


export default function DashboardExams() {
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [exams, setExams] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/exam/teacher`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setExams(data.exams || []);
      } catch (err) {
        console.error("Failed to fetch exams", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  /* ================= DELETE EXAM ================= */
  const handleDeleteExam = async (examId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/exam/${examId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete exam");

      setExams((prev) => prev.filter((exam) => exam._id !== examId));
      setOpenMenu(null);

      alert("✅ Exam deleted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete exam");
    }
  };

  /* ================= LOADING UI ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar active="exams" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-[#2a384a]" />
            <p className="text-sm">Loading exams...</p>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  if (!teacher) return null;

  const statusBadge = (status) => {
    if (status === "PUBLISHED") return "bg-green-100 text-green-700";
    if (status === "DRAFT") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

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
              <table className="w-full text-sm text-center">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Exam name</th>
                    <th className="px-4 py-3">Key</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Schedule</th>

                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>

                <tbody >
                  {exams.map((exam) => {
                    return (
                      <tr
                        key={exam._id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-4 py-3 font-medium">
                          {exam.examName}
                        </td>

                        <td className="px-4 py-3">{exam.examKey}</td>

                        <td className="px-4 py-3">
                          {new Date(
                            exam.createdAt
                          ).toLocaleDateString()}
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

                       <td className="px-4 py-3 text-xs">
  <div className="flex flex-col gap-1">
    <span className="text-gray-700 font-medium">
      Start: {formatDateTime(exam.startTime)}
    </span>
    <span className="text-gray-500">
      End: {formatDateTime(exam.endTime)}
    </span>
  </div>
</td>


                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 relative">
                            {/* EDIT */}
  <div className="relative group">
    <Edit
      size={18}
      className={`${
        exam.status === "PUBLISHED"
          ? "cursor-not-allowed text-gray-400"
          : "cursor-pointer text-gray-700"
      }`}
      onClick={() => {
        if (exam.status !== "PUBLISHED") {
          navigate(`/teacher/exam/${exam._id}/edit`);
        }
      }}
    />
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 
      whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded
      opacity-0 group-hover:opacity-100 transition">
      {exam.status === "PUBLISHED" ? "Cannot edit published exam" : "Edit exam"}
    </span>
  </div>


                             {/* PREVIEW */}
  <div className="relative group">
    <MonitorPlay
      size={18}
      className="cursor-pointer text-gray-700"
      onClick={() =>
        navigate(`/teacher/exam/${exam._id}/preview`)
      }
    />
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 
      whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded
      opacity-0 group-hover:opacity-100 transition">
      Preview exam
    </span>
  </div>

  {/* VIEW */}
  <div className="relative group">
    <Eye
      size={18}
      className="cursor-pointer text-gray-700"
      onClick={() =>
        navigate(`/teacher/exam/${exam._id}/view`)
      }
    />
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 
      whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded
      opacity-0 group-hover:opacity-100 transition">
      View exam
    </span>
  </div>

                            <MoreVertical
                              size={18}
                              className="cursor-pointer"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === exam._id
                                    ? null
                                    : exam._id
                                )
                              }
                            />

                            {openMenu === exam._id && (
                              <div className="absolute right-0 top-6 w-72 bg-white shadow-lg rounded-md z-20 text-sm">
                                <MenuItem
                                  icon={<UserPlus size={16} />}
                                  label="Give another teacher access"
                                />
                                <MenuItem
                                  icon={<Eye size={16} />}
                                  label="Reveal student identities"
                                />
                                <MenuItem
                                  icon={<Copy size={16} />}
                                  label="Duplicate the exam"
                                />
                                <MenuItem
                                  icon={<Mail size={16} />}
                                  label="Send resume exam keys via email"
                                />
                                <MenuItem
                                  icon={<Share2 size={16} />}
                                  label="Share exam template via link"
                                />
                                <MenuItem
                                  icon={<Tag size={16} />}
                                  label="Tag exam with a color"
                                />
                                <MenuItem
                                  icon={<Folder size={16} />}
                                  label="Move to group"
                                />
                                <MenuItem
                                  icon={<Archive size={16} />}
                                  label="Archive the exam"
                                />
                                <MenuItem
                                  icon={<Trash2 size={16} />}
                                  label="Delete the exam"
                                  danger
                                  onClick={() =>
                                    handleDeleteExam(exam._id)
                                  }
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
