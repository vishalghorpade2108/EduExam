
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MAX_WARNINGS = 3;

export default function ExamPage() {
  const { examKey } = useParams();
  const navigate = useNavigate();

  const examSubmittedRef = useRef(false);
  const studentId = localStorage.getItem("studentId");
const [examStarted, setExamStarted] = useState(false);

  const [examInfo, setExamInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);

  const [warnings, setWarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answeredCount, setAnsweredCount] = useState(0);

  const [forceFS, setForceFS] = useState(false); // 🔒 fullscreen lock

  /* ================= SESSION CHECK ================= */
  useEffect(() => {
    if (!studentId) {
      alert("Session expired. Please enter details again.");
      navigate(`/student/details/${examKey}`);
    }
  }, [studentId, examKey, navigate]);

  /* ================= FETCH EXAM ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const examRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/exam/key/${examKey}`
        );
        const qRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/exam/questions/${examKey}`
        );

        setExamInfo(examRes.data);
        setTimeLeft(examRes.data.duration * 60);
        setQuestions(qRes.data.questions);
        setLoading(false);
      } catch {
        alert("Failed to load exam");
        navigate(-1);
      }
    };

    fetchData();
  }, [examKey, navigate]);


  /* ================= FULLSCREEN EXIT DETECTION ================= */
  useEffect(() => {
  const onFSChange = () => {
    if (
      examStarted &&
      !document.fullscreenElement &&
      !examSubmittedRef.current
    ) {
      issueWarning("Exited fullscreen");
      setForceFS(true);
    }
  };

  document.addEventListener("fullscreenchange", onFSChange);
  return () =>
    document.removeEventListener("fullscreenchange", onFSChange);
}, [examStarted]);

  /* ================= TAB SWITCH ================= */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && !examSubmittedRef.current) {
        issueWarning("Tab switch detected");
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (loading) return;

    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleSubmitExam("Time up");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  /* ================= WARNINGS ================= */
  const issueWarning = (reason) => {
    alert(`⚠ Warning: ${reason}`);
    setWarnings((w) => w + 1);
  };

  useEffect(() => {
    if (warnings >= MAX_WARNINGS) {
      handleSubmitExam("Multiple violations");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warnings]);

  /* ================= SUBMIT ================= */
  const handleSubmitExam = async (reason) => {
    if (examSubmittedRef.current) return;
    examSubmittedRef.current = true;

    try {
       await axios.post(
        `${import.meta.env.VITE_API_URL}/api/examAttempt/submit/${examKey}`,
        { studentId, answers, warnings, reason }
      );
    } catch (error) {
      console.error("Error submitting exam:", error);
    }

    document.exitFullscreen?.();
    localStorage.removeItem("studentId");
    navigate("/student/exam-submitted");
  };

  /* ================= ANSWER ================= */
  const handleSelect = (qid, idx) => {
    setAnswers((prev) => {
      const updated = { ...prev, [qid]: idx };
      setAnsweredCount(Object.keys(updated).length);
      return updated;
    });
  };

  /* ================= FULLSCREEN BUTTON ================= */
  const reEnterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setForceFS(false);
    } catch {
      alert("Fullscreen permission required to continue exam.");
    }
  };

  /* ================= UTIL ================= */
  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const q = questions[currentQ];
  return (

    
    
    <div className="min-h-screen bg-gray-100 p-6">
      {!examStarted && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white">
    <h2 className="text-2xl font-bold mb-4">Start Exam</h2>
    <p className="mb-6 text-center">
      Exam will start in fullscreen mode.<br />
      Do not switch tabs or exit fullscreen.
    </p>
    <button
      onClick={async () => {
        try {
          await document.documentElement.requestFullscreen();
          setExamStarted(true);
          setForceFS(false);
        } catch {
          alert("Fullscreen permission is required to start the exam.");
        }
      }}
      className="px-6 py-3 bg-green-600 rounded text-lg"
    >
      Start Exam
    </button>
  </div>
)}

  {forceFS && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white">
          <h2 className="text-2xl font-bold mb-4">⚠ Fullscreen Required</h2>
          <p className="mb-6 text-center">
            You exited fullscreen.<br />Click below to continue exam.
          </p>
          <button
            onClick={reEnterFullscreen}
            className="px-6 py-3 bg-red-600 rounded text-lg"
          >
            Resume Exam
          </button>
        </div>
      )}
{/* EXAM INFORMATION */}
{examInfo && (
  <div className="bg-white rounded shadow p-4 mb-4">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
      
      <div>
        <p className="text-gray-500 font-semibold">Exam</p>
        <p className="text-gray-800 font-medium">
          {examInfo.examName}
        </p>
      </div>

      <div>
        <p className="text-gray-500 font-semibold">Subject</p>
        <p className="text-gray-800 font-medium">
          {examInfo.subject}
        </p>
      </div>

      <div>
        <p className="text-gray-500 font-semibold">Class</p>
        <p className="text-gray-800 font-medium">
          {examInfo.className}
        </p>
      </div>

      <div>
        <p className="text-gray-500 font-semibold">Teacher</p>
        <p className="text-gray-800 font-medium">
          {examInfo.teacherName}
        </p>
      </div>

      <div>
        <p className="text-gray-500 font-semibold">Total Marks</p>
        <p className="text-gray-800 font-medium">
          {examInfo.totalMarks}
        </p>
      </div>

    </div>
  </div>
)}


      {/* HEADER */}
      <div
  className="flex justify-between items-center p-4 rounded mb-6"
  style={{ backgroundColor: "#2a384a", color: "white" }}
>
  <div>⏳ {formatTime(timeLeft)}</div>
  <div>📝 {answeredCount}/{questions.length}</div>
  <div>⚠ {warnings}/{MAX_WARNINGS}</div>
</div>


      {/* QUESTION */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">
          Q{currentQ + 1}. {q.question}
        </h3>

        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <label
              key={idx}
              className={`block p-3 border rounded cursor-pointer ${
                answers[q._id] === idx
                  ? "border-blue-600 bg-blue-50"
                  : ""
              }`}
            >
              <input
                type="radio"
                checked={answers[q._id] === idx}
                onChange={() => handleSelect(q._id, idx)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between mt-6">
          <button
            disabled={currentQ === 0}
            onClick={() => setCurrentQ((p) => p - 1)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>

          {currentQ < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ((p) => p + 1)}
              className="px-4 py-2 text-white rounded"
              style={{ backgroundColor: "#2a384a" }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => handleSubmitExam("Manual submit")}
              className="px-4 py-2 text-white rounded"
              style={{ backgroundColor: "#2a384a" }}
            >
              Submit Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}