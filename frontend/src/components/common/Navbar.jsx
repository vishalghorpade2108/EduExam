import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo3.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 px-6 h-28 flex items-center justify-between"
      style={{ backgroundColor: "#2a384a" }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="EduExam Logo" className="h-30 w-auto" />
      </Link>

      {/* Center Menu - Desktop */}
      <div className="hidden md:flex gap-6 text-lg font-bold text-white ml-6">

        {/* How it Works */}
        <div className="relative group">
          <span className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
            How it Works
            <span className="transition-transform duration-300 group-hover:rotate-180">▼</span>
          </span>

          <div
            className="absolute top-full left-0 mt-3 w-56 bg-white text-[#2a384a]
            rounded-xl shadow-lg opacity-0 invisible translate-y-3
            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
            transition-all duration-300"
          >
            <ul className="py-2">
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Product Overview</li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Tools</li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Technology</li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">LMS Integration</li>
            </ul>
          </div>
        </div>

        {/* Customers */}
        <div className="relative group">
          <span className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
            Customers
            <span className="transition-transform duration-300 group-hover:rotate-180">▼</span>
          </span>

          <div
            className="absolute top-full left-0 mt-3 w-64 bg-white text-[#2a384a]
            rounded-xl shadow-lg opacity-0 invisible translate-y-3
            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
            transition-all duration-300"
          >
            <ul className="py-2">
              <li className="px-5 py-2 text-gray-400 text-sm cursor-default">
                Who We Serve
              </li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Schools</li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Higher Education</li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Companies & Organizations</li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Regions</li>
            </ul>
          </div>
        </div>

        {/* Pricing */}
        <Link to="#pricing" className="hover:text-gray-300">
          Pricing
        </Link>

        {/* Resources */}
        <div className="relative group">
          <span className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
            Resources
            <span className="transition-transform duration-300 group-hover:rotate-180">▼</span>
          </span>

          <div
            className="absolute top-full left-0 mt-3 w-56 bg-white text-[#2a384a]
            rounded-xl shadow-lg opacity-0 invisible translate-y-3
            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
            transition-all duration-300"
          >
            <ul className="py-2">
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Privacy Center</li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Blog</li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Training Videos</li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">About</li>
              <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer">Support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Student Exam Key */}
        <div className="hidden md:flex items-center bg-white rounded-3xl px-1">
          <input
            type="text"
            placeholder="Student Exam Key"
            className="px-4 py-2 text-black outline-none w-48 font-bold bg-transparent"
          />
          <button
            className="px-4 py-2 text-white font-bold rounded-3xl m-0.5"
            style={{ backgroundColor: "#2a384a" }}
          >
            →
          </button>
        </div>

        {/* Sign Up */}
        <Link
          to="/teacher-registration"
          className="border border-white px-5 py-2 rounded-3xl font-bold text-white
          hover:bg-white hover:text-gray-900 transition"
        >
          Sign Up
        </Link>

        {/* Teacher Sign In */}
        <Link
          to="/teacher-login"
          className="px-5 py-2 rounded-3xl font-bold text-white bg-gray-700
          hover:bg-gray-600 transition"
        >
          Teacher Sign In
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden ml-2" onClick={() => setIsOpen(!isOpen)}>
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
      </div>
    </nav>
  );
}
