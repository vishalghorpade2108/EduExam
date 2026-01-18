export default function Step1BasicInfo({ data, setData }) {
  const THEME = "#2a384a";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">

      {/* Heading */}
      <div>
        <h2 className="text-2xl font-semibold" style={{ color: THEME }}>
          Basic Exam Information
        </h2>
        <p className="text-sm text-gray-500">
          Start by giving your exam a name and basic details.
        </p>
      </div>

      {/* Exam Name */}
      <div>
        <label className="font-medium block mb-1">
          Exam name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="examName"
          value={data.examName}
          onChange={handleChange}
          placeholder="e.g. Mid Term Examination"
          className="w-full border px-4 py-2 rounded "
        />
        
      </div>

      {/* Subject */}
      <div>
        <label className="font-medium block mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="subject"
          value={data.subject}
          onChange={handleChange}
          placeholder="e.g. Mathematics"
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      {/* Class / Grade */}
      <div>
        <label className="font-medium block mb-1">
          Class / Grade <span className="text-red-500">*</span>
        </label>
        <select
          name="class"
          value={data.class}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select class</option>
          <option>MCA I</option>
          <option>MCA II</option>
          <option>MBA I</option>
          <option>MBA II</option>
          <option>BVOC I</option>
          <option>BVOC II</option>
          <option>BVOC III</option>
        </select>
      </div>

      {/* Exam Type */}
      <div>
        <label className="font-medium block mb-2">
          Exam type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          {["Practice", "Test", "Final Exam"].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="examType"
                value={type}
                checked={data.examType === type}
                onChange={handleChange}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="font-medium block mb-1">
          Description (optional)
        </label>
        <textarea
          name="description"
          placeholder="Instructions for students..."
          className="w-full border px-4 py-2 rounded resize-none"
          rows={4}
        />
      </div>
    </div>
  );
}
