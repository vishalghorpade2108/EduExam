import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ExamSubmitted() {
  const navigate = useNavigate();

  // Prevent back navigation
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", blockBack);

    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded shadow-lg p-8 max-w-md w-full text-center">
        
        <div className="text-green-600 text-5xl mb-4">✅</div>

        <h2 className="text-2xl font-semibold mb-2">
          Exam Submitted Successfully
        </h2>

        <p className="text-gray-600 mb-6">
          Your answers have been saved and the exam has been submitted.
          <br />
          You may now safely close this window.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 text-white rounded"
          style={{ backgroundColor: "#2a384a" }}
        >
          Go to Home
        </button>

        <p className="text-xs text-gray-400 mt-4">
          ⚠ Do not refresh or go back to the exam page
        </p>
      </div>
    </div>
  );
}
