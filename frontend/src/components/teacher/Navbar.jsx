import { Link, useNavigate } from "react-router-dom";
import {
  FilePlus,
  FileText,
  MonitorPlay,
  School,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo3.png";

const THEME = "#2a384a";

/* reusable nav item style */
const navItem = (isActive) =>
  `flex items-center gap-1 px-3 py-2 rounded-md transition
   ${
     isActive
       ? "bg-white/20 border-b-2 border-white text-white"
       : "hover:text-gray-300"
   }`;

export default function DashboardNavbar({ active }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/teacher-login");
  };

  return (
    <nav
      className="w-full h-16 flex items-center justify-between px-6 text-white"
      style={{ backgroundColor: THEME }}
    >
      {/* LEFT – LOGO */}
      <Link to="/teacher/exams" className="flex items-center gap-2">
        <img src={logo} alt="EduExam" className="h-40" />
      </Link>

      {/* RIGHT – MENU */}
      <div className="hidden md:flex items-center gap-2 text-sm font-semibold">

        <Link
          to="/teacher/new-exam"
          className={navItem(active === "new-exam")}
        >
          <FilePlus size={23} />
          New Exam
        </Link>

        <Link
          to="/teacher/exams"
          className={navItem(active === "exams")}
        >
          <FileText size={23} />
          Exams
        </Link>

        <Link
          to="/teacher/results"
          className={navItem(active === "monitoring")}
        >
          <MonitorPlay size={23} />
          Monitoring / Results
        </Link>

        <Link
          to="/dashboard/school"
          className={navItem(active === "school")}
        >
          <School size={23} />
          School
        </Link>

        <Link
          to="/dashboard/profile"
          className={navItem(active === "profile")}
        >
          <User size={23} />
          Profile
        </Link>

        <Link
          to="/dashboard/help"
          className={navItem(active === "help")}
        >
          <HelpCircle size={23} />
          Help & Training
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:text-red-300 transition"
        >
          <LogOut size={23} />
          Logout
        </button>
      </div>
    </nav>
  );
}
