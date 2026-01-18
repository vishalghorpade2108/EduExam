import { useEffect, useState, useMemo } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";

// 🔝 Navbar
import TeacherNavbar from "../teacher/Navbar.jsx";

// ✏️ Questions editor
import EditQuestions from "./EditQuestions";

export default function EditQuestionsOnly() {
  const { examId } = useParams();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();

  const saveQuestions = async () => {
      console.log("Saving questions draft...", questions);
  return axios.post(
    "http://localhost:5000/api/questions/savedraft",
    {
      examId: exam._id,
      questions: questions,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

  const handlePublish = async () => {
  try {
    // 1️⃣ Save latest edited questions
    const result=await saveQuestions();
    console.log("Questions saved:", result.data);
    // 2️⃣ Publish exam (update status)
    const res = await axios.put(
      `http://localhost:5000/api/exam/${exam._id}/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("🎉 Exam published successfully!");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate("/teacher/exams");
    setExam(res.data.exam);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to publish exam");
  }
};


  /* ================= FETCH EXAM + QUESTIONS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/exam/${examId}/edit`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setExam(res.data.exam);
        setQuestions(res.data.questions || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  /* ================= CALCULATE QUESTION MARKS ================= */
  const questionsTotalMarks = useMemo(() => {
    return questions.reduce(
      (sum, q) => sum + Number(q.marks || 0),
      0
    );
  }, [questions]);

  const isPublishEnabled =
    questions.length > 0 &&
    Number(questionsTotalMarks) === Number(exam?.totalMarks);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!exam) return <p className="text-center mt-10">Exam not found</p>;

  return (
    <>
      {/* 🔝 NAVBAR */}
      <TeacherNavbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* 🔒 EXAM INFO */}
        <div className="bg-gray-100 p-5 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {exam.examName}
          </h2>

          <div className="grid md:grid-cols-2 gap-2 mt-3 text-sm text-gray-700">
            <p><b>Subject:</b> {exam.subject}</p>
            <p><b>Class:</b> {exam.class}</p>
            <p><b>Duration:</b> {exam.duration} mins</p>
            <p><b>Exam Total Marks:</b> {exam.totalMarks}</p>
            <p>
              <b>Status:</b>{" "}
              <span className="text-orange-600 font-semibold">Draft</span>
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            🔒 Exam settings are read-only here.
          </p>
        </div>

        {/* ✏️ QUESTIONS EDITOR */}
        <EditQuestions
          examId={exam._id}
          questions={questions}
          setQuestions={setQuestions}
          examSettings={exam}
        />

        {/* 📊 MARKS SUMMARY */}
        <div className="mt-4 text-sm text-gray-700">
          <p>
            <b>Questions Total Marks:</b>{" "}
            <span
              className={
                questionsTotalMarks === Number(exam.totalMarks)
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {questionsTotalMarks}
            </span>
          </p>

          {questionsTotalMarks !== Number(exam.totalMarks) && (
            <p className="text-red-500 text-xs mt-1">
              ⚠️ Total question marks must be exactly{" "}
              {exam.totalMarks} to publish.
            </p>
          )}
        </div>

        {/* 🚀 PUBLISH BUTTON */}
        <div className="flex justify-end mt-8">
          <button
            disabled={!isPublishEnabled}
            onClick={handlePublish}
            className={`px-6 py-3 rounded-lg text-white font-semibold
              ${
                isPublishEnabled
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Publish Exam
          </button>
        </div>
      </div>
    </>
  );
}
