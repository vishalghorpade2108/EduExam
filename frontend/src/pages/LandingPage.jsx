import Navbar from "../components/common/Navbar";
import bg from "../assets/bg.svg";
import heroImg from "../assets/common2.png";
import ExamInfo from "../components/common/ExamInfo";
import TrustedSection from "../components/common/TrustedSection";
import WhyChooseEduExam from "../components/common/WhyChooseEduExam";
import Footer from "../components/common/Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
  const navigate = useNavigate();
   useEffect(() => {
    const token = localStorage.getItem("token"); // or "teacherToken"
    if (token) {
      navigate("/teacher/exams");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">

        {/* Hero Background (scrolls with content) */}
        <div className="absolute inset-0 -z-10">
          <img
            src={bg}
            alt="background"
            className="w-full h-full object-cover object-top -translate-y-25"
          />
        </div>

        {/* Hero Content */}
       <div className="flex flex-col md:flex-row items-center justify-between
  pt-25 pb-20 px-4 md:px-16 max-w-8xl mx-auto "   style={{ fontFamily: "Poppins, sans-serif" }}>

          {/* Left Side - Text */}
          <div className="md:w-1/2">
            <h1 className="text-5xl font-bold mb-4 text-[#2a384a]">
              Simply Powerful
            </h1>

            <h2 className="text-7xl font-semibold mb-6 text-[#2a384a]">
              Online Exams
            </h2>

            <p className="text-2xl mb-8 text-[#2a384a]">
              Simple to get started and easy to use. EduExam provides all the tools and flexibility you need to design secure exams tailored to your students.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
  <Link to="/teacher-login">
    <button
      className="bg-[#2a384a] hover:bg-[#525d6c]
      px-6 py-3 rounded-3xl font-semibold text-white transition"
    >
      Sign Up For Your Free Trial
    </button>
  </Link>

  <Link to="/teacher-login">
    <button
      className="border border-[#2a384a] hover:bg-[#2a384a]
      hover:text-white px-6 py-3 rounded-3xl font-semibold transition"
    >
      Book a Demo
    </button>
  </Link>
</div>
          </div>

          {/* Right Side - Image */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center items-start">
            <img
              src={heroImg}
              alt="Hero"
              className="max-h-125 w-auto object-contain"
            />
          </div>

        </div>
      </section>

      {/* ================= EXAM INFO SECTION ================= */}
      <section className="bg-white">
        <ExamInfo />
      </section>
      {/*================Trust section ===========*/}
      <section className="bg-white">
        <TrustedSection />
      </section>
       {/*================Trust section ===========*/}
       <section className="bg-white">
        <WhyChooseEduExam/>
      </section>
     
       {/*================footer section ===========*/}
       <section className="bg-white">
         <Footer />  
      </section>
   
    </div>
  );
}
