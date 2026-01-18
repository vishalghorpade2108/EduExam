export default function Step2Settings({ data, setData }) {
  const THEME = "#2a384a";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="space-y-6">

      {/* Heading */}
      <div>
        <h2 className="text-2xl font-semibold" style={{ color: THEME }}>
          Exam Settings
        </h2>
        <p className="text-sm text-gray-500">
          Configure timing, attempts, and exam behavior.
        </p>
      </div>

      {/* Duration */}
      <div>
        <label className="font-medium block mb-1">
          Exam duration (minutes) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="duration"
          min="1"
          value={data.duration}
          onChange={handleChange}
          className={`w-full border px-4 py-2 rounded`}
          placeholder="e.g. 90"
        />
      
      </div>
{/* Total Exam Marks */}
<div>
  <label className="font-medium block mb-1">
    Total exam marks <span className="text-red-500">*</span>
  </label>
  <input
    type="number"
    name="totalMarks"
    min="1"
    value={data.totalMarks}
    onChange={handleChange}
    className= "w-full border px-4 py-2 rounded "
    placeholder="e.g. 100"
  />
  
</div>

      {/* Start & End */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="font-medium block mb-1">
            Start date & time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={data.startTime}
            onChange={handleChange}
            className= "w-full border px-4 py-2 rounded "
          />
        </div>

        <div>
          <label className="font-medium block mb-1">
            End date & time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={data.endTime}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded "
          />
        </div>
      </div>

      {/* Attempts */}
      <div>
        <label className="font-medium block mb-1">
          Number of attempts <span className="text-red-500">*</span>
        </label>
        <select
          name="attempts"
          value={data.attempts}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded "
          
        >
          <option value="">Select</option>
          <option value="1">1 Attempt</option>
          <option value="2">2 Attempts</option>
          <option value="3">3 Attempts</option>
          <option value="unlimited">Unlimited</option>
        </select>
      </div>

      {/* Behavior Options */}
      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="shuffleQuestions"
            checked={data.shuffleQuestions}
            onChange={handleChange}
          />
          Shuffle questions for each student
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="showResults"
            checked={data.showResults}
            onChange={handleChange}
          />
          Show results immediately after submission
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="allowCalculator"
            checked={data.allowCalculator}
            onChange={handleChange}
          />
          Allow calculator
        </label>
      </div>
    </div>
  );
}
