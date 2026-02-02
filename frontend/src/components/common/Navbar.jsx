import { Link ,useNavigate} from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo3.png";
import axios from "axios";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [examKey, setExamKey] = useState("");
  const navigate = useNavigate();

const handleExamKeySubmit = async () => {
  if (!examKey.trim()) {
    alert("Please enter exam key");
    return;
  }

  if (examKey.length < 5) {
    alert("Invalid exam key");
    return;
  }

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/exam/verify/${examKey}`
    );

    if (res.data.success) {
      navigate(`/student/details/${examKey}`);
    }

  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message;

      // ❌ Exam not found
      if (status === 404) {
        alert("Invalid exam key. Please check and try again.");
      }
      // ❌ Exam exists but not published
      else if (status === 403) {
        alert("Exam is not published yet. Please wait for the exam to start.");
      }
       else if (status === 405) {
        alert("Exam is Ended. You can no longer take this exam.");
      }
      // ❌ Other server-side errors
      else {
        alert(message || "Something went wrong. Please try again.");
      }
    } else {
      // ❌ Network / server error
      alert("Server error. Please try again later.");
    }
  }
};

return (
  <nav
    className="sticky top-0 z-50 px-4 md:px-6 h-20 md:h-28 flex items-center justify-between"
    style={{ backgroundColor: "#2a384a" }}
  >
    {/* Logo */}
    <Link to="/" className="flex items-center">
      <img src={logo} alt="EduExam Logo" className="h-40 md:h-40 w-auto" />
    </Link>

    {/* Desktop Center Menu */}
    <div className="hidden md:flex gap-6 text-lg font-bold text-white ml-6">
      {/* How it Works */}
      <div className="relative group">
        <span className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
          How it Works
          <span className="group-hover:rotate-180 transition">▼</span>
        </span>
        <div className="absolute top-full left-0 mt-3 w-56 bg-white text-[#2a384a]
          rounded-xl shadow-lg opacity-0 invisible translate-y-3
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all">
          <ul className="py-2">
            <li className="px-5 py-2 hover:bg-gray-100">Product Overview</li>
            <li className="px-5 py-2 hover:bg-gray-100">Tools</li>
            <li className="px-5 py-2 hover:bg-gray-100">Technology</li>
            <li className="px-5 py-2 hover:bg-gray-100">LMS Integration</li>
          </ul>
        </div>
      </div>

      <Link to="#pricing" className="hover:text-gray-300">Pricing</Link>
      <Link to="#resources" className="hover:text-gray-300">Resources</Link>
    </div>

    {/* Desktop Right */}
    <div className="hidden md:flex items-center gap-4">
      {/* Exam Key */}
      <div className="flex items-center bg-white rounded-3xl px-1">
        <input
          placeholder="Student Exam Key"
          value={examKey}
          onChange={(e) => setExamKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleExamKeySubmit()}
          className="px-4 py-2 text-black outline-none w-48 font-bold bg-transparent"
        />
        <button
          onClick={handleExamKeySubmit}
          className="px-4 py-2 text-white font-bold rounded-3xl"
          style={{ backgroundColor: "#2a384a" }}
        >
          →
        </button>
      </div>

      <Link
        to="/teacher-registration"
        className="border border-white px-5 py-2 rounded-3xl font-bold text-white hover:bg-white hover:text-black"
      >
        Sign Up
      </Link>

      <Link
        to="/teacher-login"
        className="px-5 py-2 rounded-3xl font-bold text-white bg-gray-700 hover:bg-gray-600"
      >
        Teacher Sign In
      </Link>
    </div>

    {/* Mobile Menu Button */}
    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={
            isOpen
              ? "M6 18L18 6M6 6l12 12"
              : "M4 6h16M4 12h16M4 18h16"
          }
        />
      </svg>
    </button>

    {/* Mobile Menu */}
{isOpen && (
  <div className="absolute top-full left-0 w-full bg-white text-[#2a384a] shadow-xl md:hidden">
    <div className="p-5 space-y-4 font-semibold">

      {/* How it Works */}
      <div>
        <p className="font-bold mb-2">How it Works</p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>Product Overview</li>
          <li>Tools</li>
          <li>Technology</li>
          <li>LMS Integration</li>
        </ul>
      </div>

      {/* Customers */}
      <div>
        <p className="font-bold mb-2">Customers</p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>Schools</li>
          <li>Higher Education</li>
          <li>Companies & Organizations</li>
          <li>Regions</li>
        </ul>
      </div>

      {/* Pricing */}
      <Link
        to="#pricing"
        onClick={() => setIsOpen(false)}
        className="block"
      >
        Pricing
      </Link>

      {/* Resources */}
      <div>
        <p className="font-bold mb-2">Resources</p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>Privacy Center</li>
          <li>Blog</li>
          <li>Training Videos</li>
          <li>About</li>
          <li>Support</li>
        </ul>
      </div>

      {/* Student Exam Key */}
      <div className="flex border rounded-3xl overflow-hidden mt-4">
        <input
          placeholder="Student Exam Key"
          value={examKey}
          onChange={(e) => setExamKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleExamKeySubmit()}
          className="px-4 py-2 w-full outline-none"
        />
        <button
          onClick={handleExamKeySubmit}
          className="px-4 text-white"
          style={{ backgroundColor: "#2a384a" }}
        >
          →
        </button>
      </div>

      {/* Auth Buttons */}
      <Link
        onClick={() => setIsOpen(false)}
        to="/teacher-registration"
        className="block text-center border px-4 py-2 rounded-3xl"
      >
        Sign Up
      </Link>

      <Link
        onClick={() => setIsOpen(false)}
        to="/teacher-login"
        className="block text-center px-4 py-2 rounded-3xl bg-gray-700 text-white"
      >
        Teacher Sign In
      </Link>
    </div>
  </div>
)}

  </nav>
);
}