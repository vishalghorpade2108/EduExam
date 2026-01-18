import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FilePlus,
  FileText,
  MonitorPlay,
  School,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logo from "../../assets/logo3.png";

const THEME = "#2a384a";

/* reusable nav item style */
const navItem = (isActive) =>
  `flex items-center gap-2 px-3 py-2 rounded-md transition
   ${
     isActive
       ? "bg-white/20 border-b-2 border-white text-white"
       : "hover:text-gray-300"
   }`;

export default function DashboardNavbar({ active }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/teacher-login");
  };

  const closeMenu = () => setOpen(false);

  return (
    <nav
      className="w-full text-white"
      style={{ backgroundColor: THEME }}
    >
      {/* TOP BAR */}
      <div className="h-16 flex items-center justify-between px-6">
        {/* LOGO */}
        <Link to="/teacher/exams" className="flex items-center gap-2">
          <img src={logo} alt="EduExam" className="h-40" />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-2 text-sm font-semibold">
          <Link to="/teacher/new-exam" className={navItem(active === "new-exam")}>
            <FilePlus size={20} /> New Exam
          </Link>

          <Link to="/teacher/exams" className={navItem(active === "exams")}>
            <FileText size={20} /> Exams
          </Link>

          <Link to="/teacher/results" className={navItem(active === "monitoring")}>
            <MonitorPlay size={20} /> Monitoring / Results
          </Link>

          <Link to="/dashboard/school" className={navItem(active === "school")}>
            <School size={20} /> School
          </Link>

          <Link to="/teacher/profile" className={navItem(active === "profile")}>
            <User size={20} /> Profile
          </Link>

          <Link to="/dashboard/help" className={navItem(active === "help")}>
            <HelpCircle size={20} /> Help & Training
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 hover:text-red-300 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-semibold">
          <Link onClick={closeMenu} to="/teacher/new-exam" className={navItem(active === "new-exam")}>
            <FilePlus size={20} /> New Exam
          </Link>

          <Link onClick={closeMenu} to="/teacher/exams" className={navItem(active === "exams")}>
            <FileText size={20} /> Exams
          </Link>

          <Link onClick={closeMenu} to="/teacher/results" className={navItem(active === "monitoring")}>
            <MonitorPlay size={20} /> Monitoring / Results
          </Link>

          <Link onClick={closeMenu} to="/dashboard/school" className={navItem(active === "school")}>
            <School size={20} /> School
          </Link>

          <Link onClick={closeMenu} to="/teacher/profile" className={navItem(active === "profile")}>
            <User size={20} /> Profile
          </Link>

          <Link onClick={closeMenu} to="/dashboard/help" className={navItem(active === "help")}>
            <HelpCircle size={20} /> Help & Training
          </Link>

          <button
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
            className="flex items-center gap-2 px-3 py-2 hover:text-red-300 transition w-full"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
