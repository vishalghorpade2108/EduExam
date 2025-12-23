import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
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
  {
    value: "Open",
    label: "Open / Open for new entrances",
    color: "bg-green-500",
  },
  {
    value: "Closed",
    label: "Closed / Closed for new entrances",
    color: "bg-red-500",
  },
  {
    value: "Discoverable",
    label: "Discoverable",
    color: "bg-yellow-400",
    note:
      "Students entering the exam will reach a lobby until you open the exam.",
  },
];

export default function DashboardExams() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const exams = [
    {
      id: 1,
      name: "Mid Term Examination",
      key: "MTX-9021",
      created: "10 Sep 2025",
      status: "Active",
      access: "Open",
    },
    {
      id: 2,
      name: "Unit Test – Science",
      key: "UTS-1143",
      created: "01 Sep 2025",
      status: "Draft",
      access: "Discoverable",
    },
  ];

  const statusBadge = (status) => {
    if (status === "Active")
      return "bg-green-100 text-green-700";
    if (status === "Draft")
      return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };
   
  useEffect(() => {
 
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/teacher-signin");
          return;
        }  
})

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active="exams" />

      {/* Teacher info */}
      <div className="bg-gray-200 px-4 py-2 text-sm text-gray-700">
        xyz@school.co.in – School administrator
      </div>

      {/* ================= EMPTY CARD ================= */}
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
          <button className="bg-white text-[#2a384a] px-6 py-2 rounded-md font-semibold flex items-center gap-2 mx-auto">
            <Plus size={18} /> New Exam
          </button>
        </div>
      </div>

      {/* ================= EXAMS TABLE ================= */}
      <div
        className="max-w-7xl mx-auto rounded-xl shadow overflow-hidden"
        style={{ backgroundColor: THEME }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 text-white">
          <h2 className="text-xl font-semibold">My Exams</h2>
          <button className="bg-white text-[#2a384a] px-4 py-2 rounded-md font-medium flex items-center gap-2">
            <Plus size={18} /> New Exam
          </button>
        </div>

        {/* Table */}
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
                const access = accessOptions.find(
                  (a) => a.value === exam.access
                );

                return (
                  <tr
                    key={exam.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/exam/${exam.id}`)}
                  >
                    <td className="px-4 py-3 font-medium">
                      {exam.name}
                    </td>
                    <td className="px-4 py-3">{exam.key}</td>
                    <td className="px-4 py-3">{exam.created}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                          exam.status
                        )}`}
                      >
                        {exam.status}
                      </span>
                    </td>

                    {/* ACCESS */}
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        defaultValue={exam.access}
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

                      {access.note && (
                        <p className="text-xs text-gray-500 mt-1">
                          {access.note}
                        </p>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 relative">
                        <Edit size={18} className="text-gray-600 hover:text-black" />
                        <MonitorPlay size={18} className="text-gray-600 hover:text-black" />
                        <Eye size={18} className="text-gray-600 hover:text-black" />

                        <MoreVertical
                          size={18}
                          className="cursor-pointer"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === exam.id ? null : exam.id
                            )
                          }
                        />

                        {/* DROPDOWN */}
                        {openMenu === exam.id && (
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
    </div>
  );
}

/* Reusable menu item */
function MenuItem({ icon, label, danger }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 ${
        danger ? "text-red-600" : ""
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
