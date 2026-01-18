/* eslint-disable no-unused-vars */
import { useState } from "react";
import DashboardNavbar from "../teacher/Navbar.jsx";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2Settings from "./steps/Step2Settings.jsx";
import Step3Questions from "./steps/Step3Questions.jsx";
import Step4Review from "./steps/Step4Review.jsx";
import { useNavigate } from "react-router-dom";


const THEME = "#2a384a";

export default function NewExam() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate();

  const [examData, setExamData] = useState({
    examName: "",
    subject: "",
    class: "",
    examType: "practice",
    description: "",

    duration: "",
    totalMarks: "",
    startTime: "",
    endTime: "",
    attempts: "",
    shuffleQuestions: false,
    showResults: false,
    allowCalculator: false,
  });

  const [questions, setQuestions] = useState([]);

  /* ================= API CALLS ================= */

  const createExam = async (status) => {
    const res = await fetch("https://eduexam-5c0p.onrender.com/api/exam/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...examData,
        status,
      }),
    });

    if (!res.ok) throw new Error("Exam creation failed");
    return res.json(); // returns exam with _id
  };
  const saveQuestions = async (examId) => {
  
    if (questions.length === 0) return;
   
    const res = await fetch("https://eduexam-5c0p.onrender.com/api/questions/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        examId,
        questions,
      }),
    });

    console.log(res)
    if (!res.ok) throw new Error("Saving questions failedd");
    return res.json();
  };

  /* ================= HANDLERS ================= */

  const handleSaveDraft = async () => {
  try {
    setLoading(true);

    const { exam } = await createExam("DRAFT");
    await saveQuestions(exam._id);

    alert("📄 Draft saved successfully");

    navigate("/teacher/exams"); // ✅ redirect
  } catch (err) {
    alert("❌ Failed to save draft: " + err.message);
  } finally {
    setLoading(false);
  }
};

 const handlePublish = async () => {
  try {
    setLoading(true);

    const { exam } = await createExam("PUBLISHED");
    await saveQuestions(exam._id);

    alert("✅ Exam published successfully");

    navigate("/teacher/exams"); // ✅ redirect
  } catch (err) {
    alert("❌ Failed to publish exam");
  } finally {
    setLoading(false);
  }
};


  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar active="new-exam" />

      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow p-8">
        {step === 1 && (
          <Step1BasicInfo data={examData} setData={setExamData} />
        )}

        {step === 2 && (
          <Step2Settings data={examData} setData={setExamData} />
        )}

        {step === 3 && (
          <Step3Questions
            questions={questions}
            setQuestions={setQuestions}
            examSettings={examData}
          />
        )}

        {step === 4 && (
          <Step4Review
            examInfo={examData}
            questions={questions}
            settings={examData}
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
            loading={loading}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border rounded"
            >
              Back
            </button>
          )}

          {step < 4 && (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 rounded text-white font-semibold"
              style={{ backgroundColor: THEME }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
