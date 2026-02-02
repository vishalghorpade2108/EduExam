import { useState } from "react";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import axios from "axios";
const THEME = "#2a384a";

export default function EditQuestions({
  questions,
  setQuestions,
  examSettings,
}) {
  const [showAI, setShowAI] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiCount, setAiCount] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState("Mixed");
  const [loadingAI, setLoadingAI] = useState(false);
 


  /* ================= ADD EMPTY QUESTION ================= */
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctOption: "",
        marks: 1,
        difficulty: "Easy",
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  /* ================= AI GENERATION ================= */
  const generateWithAI = async() =>{
  if (!aiTopic || aiCount < 1) return;

  try {
    setLoadingAI(true);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/ai/generate-questions`,
      {
        topic: aiTopic,
        count: Number(aiCount),
        difficulty: aiDifficulty,
      }
    );

    const aiData = res.data.data;

    let parsed;
    try {
      parsed = JSON.parse(aiData);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("AI returned invalid JSON");
      return;
    }

    const formatted = parsed.map((q) => ({
      question: q.question,
      options: q.options,
      correctOption: String(q.correctAnswer), // 🔑 important
      marks: q.marks || 1,
      difficulty: q.difficulty || aiDifficulty,
    }));

    setQuestions((prev) => [...prev, ...formatted]);
    setShowAI(false);
    setAiTopic("");
  } catch (err) {
    console.error(err);
    alert("Failed to generate questions");
  } finally {
    setLoadingAI(false);
  }
};

  const totalMarks = questions.reduce(
    (sum, q) => sum + Number(q.marks || 0),
    0
  );

  const marksMismatch =
    examSettings?.totalMarks > 0 &&
    totalMarks !== examSettings.totalMarks;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold" style={{ color: THEME }}>
          Edit Questions
        </h2>

         <button
                 onClick={() => setShowAI(!showAI)}
                 className="flex items-center gap-2 px-4 py-2 rounded text-white"
                 style={{ backgroundColor: THEME }}
               >
                 <Sparkles size={18} />
                 Generate with AI
               </button>
             </div>

      {/* SUMMARY */}
      <div className="flex gap-6 p-4 border rounded-lg">
        <p><b>Total Questions:</b> {questions.length}</p>
        <p><b>Total Marks:</b> {totalMarks}</p>
      </div>

      {marksMismatch && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          ⚠ Question marks do not match exam total marks
        </div>
      )}

      {/* AI PANEL */}
      {showAI && (
        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <input
            type="text"
            placeholder="Topic"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              min="1"
              value={aiCount}
              onChange={(e) => setAiCount(e.target.value)}
              className="border px-3 py-2 rounded"
              placeholder="Number of questions"
            />

            <select
              value={aiDifficulty}
              onChange={(e) => setAiDifficulty(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="Mixed">Mixed</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <button
            onClick={generateWithAI}
            disabled={loadingAI}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: THEME }}
          >
            {loadingAI ? "Generating..." : "Generate"}
          </button>
        </div>
      )}

      {/* QUESTIONS */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border rounded-lg p-5 relative space-y-4">
          {questions.length > 1 && (
            <button
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-1 right-0 mr-0 text-red-500"
            >
              <Trash2 />
            </button>
          )}

          <textarea
            value={q.question}
            onChange={(e) =>
              updateQuestion(qIndex, "question", e.target.value)
            }
            className="w-full border px-4 py-2 rounded"
            rows={3}
            placeholder={`Question ${qIndex + 1}`}
          />

          <select
            value={q.difficulty}
            onChange={(e) =>
              updateQuestion(qIndex, "difficulty", e.target.value)
            }
            className="border px-3 py-2 rounded"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <div className="grid md:grid-cols-2 gap-4">
            {q.options.map((opt, oIndex) => (
              <input
                key={oIndex}
                value={opt}
                onChange={(e) =>
                  updateOption(qIndex, oIndex, e.target.value)
                }
                className="border px-3 py-2 rounded"
                placeholder={`Option ${oIndex + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <select
              value={q.correctOption}
              onChange={(e) =>
                updateQuestion(qIndex, "correctOption", e.target.value)
              }
              className="border px-3 py-2 rounded"
            >
              <option value="">Correct Option</option>
              <option value="0">Option 1</option>
              <option value="1">Option 2</option>
              <option value="2">Option 3</option>
              <option value="3">Option 4</option>
            </select>

            <input
              type="number"
              min="1"
              value={q.marks}
              onChange={(e) =>
                updateQuestion(qIndex, "marks", e.target.value)
              }
              className="w-24 border px-3 py-2 rounded"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="flex items-center gap-2 px-4 py-2 rounded text-white"
        style={{ backgroundColor: THEME }}
      >
        <Plus size={18} /> Add Question
      </button>
    </div>
  );
}
