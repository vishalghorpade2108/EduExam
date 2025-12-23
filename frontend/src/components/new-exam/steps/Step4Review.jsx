import { CheckCircle, AlertTriangle } from "lucide-react";

const THEME = "#2a384a";

export default function Step4Review({
  examInfo,
  settings,
  questions,
  onPublish,
  onSaveDraft,
}) {
  const totalQuestionMarks = questions.reduce(
    (sum, q) => sum + Number(q.marks || 0),
    0
  );

  const marksMismatch =
    Number(settings.totalMarks) !== totalQuestionMarks;

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div>
        <h2 className="text-2xl font-semibold" style={{ color: THEME }}>
          Review & Publish
        </h2>
        <p className="text-sm text-gray-500">
          Please review all details before publishing the exam.
        </p>
      </div>

      {/* ================= EXAM SUMMARY ================= */}
      <div className="border rounded-lg p-6 space-y-4 bg-white">

        <h3 className="text-lg font-semibold" style={{ color: THEME }}>
          Exam Summary
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Exam Name</p>
            <p className="font-medium">{examInfo.examName}</p>
          </div>

          <div>
            <p className="text-gray-500">Subject</p>
            <p className="font-medium">{examInfo.subject}</p>
          </div>

          <div>
            <p className="text-gray-500">Duration</p>
            <p className="font-medium">{settings.duration} minutes</p>
          </div>

          <div>
            <p className="text-gray-500">Attempts</p>
            <p className="font-medium">{settings.attempts}</p>
          </div>

          <div>
            <p className="text-gray-500">Total Questions</p>
            <p className="font-medium">{questions.length}</p>
          </div>

          <div>
            <p className="text-gray-500">Total Marks</p>
            <p className="font-medium">
              {totalQuestionMarks} / {settings.totalMarks}
            </p>
          </div>
        </div>
      </div>

      {/* ================= MARKS WARNING ================= */}
      {marksMismatch && (
        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded flex gap-3">
          <AlertTriangle className="text-red-600 mt-1" />
          <div>
            <p className="font-semibold text-red-700">
              Marks mismatch detected
            </p>
            <p className="text-sm text-red-600">
              Total question marks must exactly match exam total marks.
            </p>
          </div>
        </div>
      )}

      {/* ================= SUCCESS READY ================= */}
      {!marksMismatch && (
        <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded flex gap-3">
          <CheckCircle className="text-green-600 mt-1" />
          <div>
            <p className="font-semibold text-green-700">
              Exam is ready to publish
            </p>
            <p className="text-sm text-green-600">
              All required validations passed successfully.
            </p>
          </div>
        </div>
      )}

      {/* ================= ACTION BUTTONS ================= */}
      <div className="flex justify-end gap-4">

        <button
          onClick={onSaveDraft}
          className="px-6 py-2 border rounded font-medium hover:bg-gray-50"
        >
          Save as Draft
        </button>

        <button
          disabled={marksMismatch}
          onClick={onPublish}
          className={`px-6 py-2 rounded text-white font-medium ${
            marksMismatch ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{ backgroundColor: THEME }}
        >
          Publish Exam
        </button>
      </div>
    </div>
  );
}
