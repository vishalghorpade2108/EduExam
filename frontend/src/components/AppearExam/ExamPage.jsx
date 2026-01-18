/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MAX_WARNINGS = 30;

export default function ExamPage() {
  const { examKey } = useParams();
  const navigate = useNavigate();

  const examSubmittedRef = useRef(false);
  const studentId = localStorage.getItem("studentId");
   const [examInfo, setExamInfo] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);

  const [warnings, setWarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
 const [, setSaving] = useState(false);
const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
  const blockKeys = (e) => {
    if (examSubmittedRef.current) return;

    // Allowed keys (ONLY these will work)
    const allowedKeys = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Enter",
      "Tab",
    ];

    // Allow radio navigation keys
    if (allowedKeys.includes(e.key)) return;

    // Block ALL ctrl / alt / shift shortcuts
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
      issueWarning("Keyboard shortcut blocked");
      e.preventDefault();
      return;
    }

    // Block function keys
    if (e.key.startsWith("F")) {
      issueWarning("Function key blocked");
      e.preventDefault();
      return;
    }

    // Block Escape explicitly
    if (e.key === "Escape") {
      issueWarning("ESC key pressed");
      e.preventDefault();
      return;
    }

    // Block everything else (typing)
    e.preventDefault();
  };

  document.addEventListener("keydown", blockKeys, true);

  return () => {
    document.removeEventListener("keydown", blockKeys, true);
  };
}, []);


  /* ================= SESSION CHECK ================= */
  useEffect(() => {
    if (!studentId) {
      alert("Session expired. Please enter details again.");
      navigate(`/student/details/${examKey}`);
    }
  }, [studentId, examKey, navigate]);

  /* ================= FETCH EXAM + QUESTIONS ================= */
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const examRes = await axios.get(
          `https://eduexam-5c0p.onrender.com/api/exam/key/${examKey}`
        );

        const questionRes = await axios.get(
          `https://eduexam-5c0p.onrender.com/api/exam/${examKey}/questions`
        );
        console.log(examRes.data);
         setExamInfo(examRes.data);
        setTimeLeft(examRes.data.duration * 60);
        setQuestions(questionRes.data.questions);
        setLoading(false);

        // restore saved answers
try {
  const savedRes = await axios.get(
    `https://eduexam-5c0p.onrender.com/api/examAttempt/${examKey}/saved-answers/${studentId}`
  );

  if (savedRes.data?.answers) {
    setAnswers(savedRes.data.answers);
  }

} catch (err) {
  console.warn("No saved answers found");
}

       } catch (err) {
        alert("Unable to load exam");
        navigate(-1);
      }
    };  

    fetchExamData();
  }, [examKey, navigate, studentId]);

  /* ================= FORCE FULLSCREEN ================= */
  useEffect(() => {
    const forceFullscreen = async () => {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    };
    forceFullscreen();
  }, []);

  /* ================= FULLSCREEN EXIT DETECTION ================= */
  useEffect(() => {
  const handleFullscreenChange = async () => {
    // If exam not submitted and fullscreen exited
    if (!document.fullscreenElement && !examSubmittedRef.current) {
      issueWarning("Exited fullscreen");

      // Re-enter fullscreen immediately
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.warn("Fullscreen re-entry blocked by browser");
      }
    }
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  return () =>
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
}, []);

  /* ================= ESC KEY DETECTION ================= */
  useEffect(() => {
    const detectEsc = (e) => {
      if (e.key === "Escape" && !examSubmittedRef.current) {
        issueWarning("ESC key pressed");
      }
    };

    document.addEventListener("keydown", detectEsc);
    return () => document.removeEventListener("keydown", detectEsc);
  }, []);

  /* ================= TAB SWITCH DETECTION ================= */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !examSubmittedRef.current) {
        issueWarning("Tab switching detected");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  /* ================= DISABLE COPY / PASTE ================= */
  useEffect(() => {
    const disable = (e) => e.preventDefault();

    document.addEventListener("contextmenu", disable);
    document.addEventListener("copy", disable);
    document.addEventListener("paste", disable);
    document.addEventListener("cut", disable);

    return () => {
      document.removeEventListener("contextmenu", disable);
      document.removeEventListener("copy", disable);
      document.removeEventListener("paste", disable);
      document.removeEventListener("cut", disable);
    };
  }, []);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
           
          handleSubmitExam("Time up");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  /* ================= WARNINGS ================= */
  const issueWarning = (reason) => {
    alert(`⚠ Warning: ${reason}`);
    setWarnings((prev) => prev + 1);
  };

  useEffect(() => {
    if (warnings >= MAX_WARNINGS) {
      handleSubmitExam("Multiple violations");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warnings]);

 

  /* ================= SUBMIT EXAM ================= */
  const handleSubmitExam = async (reason) => {
    if (examSubmittedRef.current) return;
    examSubmittedRef.current = true;

    try {
      await axios.post(
        `https://eduexam-5c0p.onrender.com/api/examAttempt/${examKey}/submit`,
        {
          studentId,
          answers,
          warnings,
          reason,
        }
      );
    } catch (err) {
      console.error(err);
    }

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    localStorage.removeItem("studentId");
    navigate("/student/exam-submitted");
  };

  const handleSelect = async (qid, index) => {
  // Update UI instantly
  setAnswers((prev) => {
    const updated = { ...prev, [qid]: index };
    setAnsweredCount(Object.keys(updated).length);
    return updated;
  });

  // Auto-save to backend
  try {
    setSaving(true);
    await axios.post(
      `https://eduexam-5c0p.onrender.com/api/examAttempt/${examKey}/save-answer`,
      {
        studentId,
        questionId: qid,
        selectedOption: index,
      }
    );
  } catch (err) {
    console.error("Auto-save failed");
  } finally {
    setSaving(false);
  }
};
useEffect(() => {
  const interval = setInterval(async () => {
    if (examSubmittedRef.current) return;
    if (Object.keys(answers).length === 0) return;

    try {
      await axios.post(
        `https://eduexam-5c0p.onrender.com/api/examAttempt/${examKey}/autosave`,
        {
          studentId,
          answers,
        }
      );
    } catch (err) {
      console.warn("Periodic autosave failed");
    }
  }, 10000);

  return () => clearInterval(interval);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [answers]);


  /* ================= UTIL ================= */
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) {
    return <p className="text-center mt-10">Loading exam...</p>;
  }

  const q = questions[currentQ];

  return (

    
    <div className="min-h-screen bg-gray-100 p-6">

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
