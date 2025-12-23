import { useState } from "react";
import DashboardNavbar from "../teacher/Navbar.jsx";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2Settings from "./steps/Step2Settings.jsx";
import Step3Questions from "./steps/Step3Questions.jsx";
import Step4Review from "./steps/Step4Review.jsx"; // ✅ IMPORT

const THEME = "#2a384a";

export default function NewExam() {
  const [step, setStep] = useState(1);

  const [examData, setExamData] = useState({
    examName: "",
    subject: "",
    grade: "",
    examType: "Practice",
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

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctOption: "",
      marks: 1,
      difficulty: "Easy",
      type: "MCQ",
    },
  ]);

  const [errors, setErrors] = useState({});
  const [questionErrors, setQuestionErrors] = useState([]);

  /* ================= VALIDATIONS ================= */

  const validateStep1 = () => {
    const newErrors = {};
    if (!examData.examName.trim()) newErrors.examName = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!examData.duration) newErrors.duration = true;
    if (!examData.startTime) newErrors.startTime = true;
    if (!examData.endTime) newErrors.endTime = true;
    if (!examData.attempts) newErrors.attempts = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const errs = [];

    questions.forEach((q, index) => {
      const qErr = {};
      if (!q.question) qErr.question = true;
      if (q.correctOption === "") qErr.correctOption = true;
      if (q.options.some((o) => !o)) qErr.options = true;
      errs[index] = qErr;
    });

    setQuestionErrors(errs);
    return errs.every((e) => Object.keys(e).length === 0);
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  /* ================= STEP 4 HANDLERS ================= */

  const handlePublish = () => {
    const payload = {
      ...examData,
      questions,
      status: "Published",
      createdAt: new Date().toISOString(),
    };

    console.log("Publishing Exam:", payload);
    alert("✅ Exam Published Successfully");
  };

  const handleSaveDraft = () => {
    const payload = {
      ...examData,
      questions,
      status: "Draft",
      createdAt: new Date().toISOString(),
    };

    console.log("Saving Draft:", payload);
    alert("📄 Exam Saved as Draft");
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar active="new-exam" />

      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow p-8">
        {step === 1 && (
          <Step1BasicInfo data={examData} setData={setExamData} errors={errors} />
        )}

        {step === 2 && (
          <Step2Settings data={examData} setData={setExamData} errors={errors} />
        )}

        {step === 3 && (
          <Step3Questions
            examSettings={examData}
            questions={questions}
            setQuestions={setQuestions}
            errors={questionErrors}
          />
        )}

        {step === 4 && (
          <Step4Review
            examInfo={examData}
            settings={examData}
            questions={questions}
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-2 border rounded"
            >
              Back
            </button>
          )}

          {step < 4 && (
            <button
              onClick={nextStep}
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
