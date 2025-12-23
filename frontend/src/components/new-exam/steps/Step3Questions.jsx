import { useState } from "react";
import {
  Plus,
  Trash2,
  Sparkles,
  Loader2
} from "lucide-react";

const THEME = "#2a384a";

export default function Step3Questions({ questions, setQuestions,examSettings }) {
  const [showAI, setShowAI] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiCount, setAiCount] = useState(5);
  const [loadingAI, setLoadingAI] = useState(false);

  const difficultyStyles = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };
  const totalQuestions = questions.length;
const totalMarks = questions.reduce(
  (sum, q) => sum + Number(q.marks || 0),
  0
);
const totalQuestionMarks = questions.reduce(
  (sum, q) => sum + Number(q.marks || 0),
  0
);

const examMarks = Number(examSettings?.totalMarks || 0);

const marksMismatch =
  examMarks > 0 && totalQuestionMarks !== examMarks;


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

  /* 🔮 Dummy AI generation */
  const generateWithAI = async () => {
    if (!aiTopic || aiCount < 1) return;

    setLoadingAI(true);

    setTimeout(() => {
      const aiQuestions = Array.from({ length: aiCount }).map((_, i) => ({
        question: `AI Generated (${aiTopic}) Question ${i + 1}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctOption: "0",
        marks: 1,
        difficulty: "Medium",
      }));

      setQuestions((prev) => [...prev, ...aiQuestions]);
      setLoadingAI(false);
      setShowAI(false);
      setAiTopic("");
    }, 1500);
  };



  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: THEME }}>
            Add Questions
          </h2>
          <p className="text-sm text-gray-500">
            Add manual or AI-generated questions with difficulty levels.
          </p>
        </div>

        <button
          onClick={() => setShowAI(!showAI)}
          className="flex items-center gap-2 px-4 py-2 rounded text-white"
          style={{ backgroundColor: THEME }}
        >
          <Sparkles size={18} />
          Generate with AI
        </button>
      </div>
 {/* Summary */}
<div
  className="flex flex-wrap gap-6 items-center justify-between p-4 rounded-lg border"
  style={{ borderColor: THEME }}
>
  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-600">Total Questions</span>
    <span
      className="px-3 py-1 rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: THEME }}
    >
      {totalQuestions}
    </span>
  </div>

  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-600">Total Marks</span>
    <span
      className="px-3 py-1 rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: THEME }}
    >
      {totalMarks}
    </span>
  </div>
</div>

{marksMismatch && (
  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
    <p className="text-sm text-yellow-800 font-medium">
      ⚠️ Marks mismatch detected
    </p>
    <p className="text-sm text-yellow-700 mt-1">
      Total question marks (
      <strong>{totalQuestionMarks}</strong>) do not match exam
      total marks (
      <strong>{examMarks}</strong>).
    </p>
    <p className="text-xs text-yellow-700 mt-1">
      Please adjust question marks or update exam settings.
    </p>
  </div>
)}

      {/* AI Panel */}
      {showAI && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
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
              placeholder="Questions count"
            />

            <select
              className="border px-3 py-2 rounded"
              onChange={(e) => setAiTopic(aiTopic)}
            >
              <option>Mixed Difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <button
            onClick={generateWithAI}
            disabled={loadingAI}
            className="flex items-center gap-2 px-4 py-2 rounded text-white"
            style={{ backgroundColor: THEME }}
          >
            {loadingAI ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Questions
              </>
            )}
          </button>
        </div>
      )}

      {/* QUESTIONS */}
      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="border rounded-lg p-5 space-y-4 relative"
        >
          {questions.length > 1 && (
            <button
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-4 right-0 text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          )}

          {/* Question */}
          <textarea
            value={q.question}
            onChange={(e) =>
              updateQuestion(qIndex, "question", e.target.value)
            }
            className="w-full border px-4 py-2 rounded"
            rows={3}
            placeholder={`Question ${qIndex + 1}`}
          />

          {/* Difficulty */}
          <div className="flex items-center gap-4">
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

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyStyles[q.difficulty]}`}
            >
              {q.difficulty}
            </span>
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-4">
            {q.options.map((opt, oIndex) => (
              <input
                key={oIndex}
                type="text"
                value={opt}
                onChange={(e) =>
                  updateOption(qIndex, oIndex, e.target.value)
                }
                className="border px-3 py-2 rounded"
                placeholder={`Option ${oIndex + 1}`}
              />
            ))}
          </div>

          {/* Correct + Marks */}
          <div className="flex gap-6 items-center">
            <select
              value={q.correctOption}
              onChange={(e) =>
                updateQuestion(qIndex, "correctOption", e.target.value)
              }
              className="border px-3 py-2 rounded"
            >
              <option value="">Correct option</option>
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
        <Plus size={18} />
        Add Question
      </button>
    </div>
  );
}
