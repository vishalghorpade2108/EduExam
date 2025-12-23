import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo3.png";
import bg from "../assets/teacher-loginbg.png";
import { CheckCircle } from "lucide-react";
const THEME = "#2a384a";

export default function TeacherSignUp() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [emailVerifiedUI, setEmailVerifiedUI] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    userType: "teacher",
    country: "",
    organizationName: "",
    organizationWebsite: "",
    noWebsite: false,
    email: "",
    teacherName: "",
    designation: "",
    subject: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= VALIDATION ================= */

  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.organizationName)
        newErrors.organizationName = "Organization name is required";
      if (!formData.noWebsite && !formData.organizationWebsite)
        newErrors.organizationWebsite = "Website is required";
    }

    if (step === 2) {
      if (!formData.email) newErrors.email = "Email is required";
      if (!emailVerified)
        newErrors.emailVerify = "Please verify your email";
    }

    if (step === 3) {
      if (!formData.teacherName)
        newErrors.teacherName = "Full name is required";
      if (!formData.designation)
        newErrors.designation = "Designation is required";
      if (!formData.subject)
        newErrors.subject = "Subject is required";
    }

    if (step === 4) {
      if (!formData.password)
        newErrors.password = "Password is required";
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm password required";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
      if (!formData.acceptTerms)
        newErrors.acceptTerms = "Accept terms to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => validateStep() && setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  /* ================= EMAIL VERIFICATION ================= */

  const sendVerificationEmail = async () => {
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      const res = await fetch(
        "http://localhost:5000/api/auth/send-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setEmailVerifiedUI(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!verificationCode) {
      setErrors({ emailVerify: "Enter verification code" });
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      const res = await fetch(
        "http://localhost:5000/api/auth/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            code: verificationCode,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setEmailVerified(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FINAL SUBMIT ================= */

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      setApiError("");

      const res = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: formData.country,
            organizationName: formData.organizationName,
            organizationWebsite: formData.noWebsite
              ? ""
              : formData.organizationWebsite,
            email: formData.email,
            name: formData.teacherName,
            designation: formData.designation,
            subject: formData.subject,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("teacher", JSON.stringify(data.teacher));

      navigate("/teacher/exams");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background */}
      <img
        src={bg}
        alt="bg"
        className="fixed inset-0 w-full h-screen object-cover -z-10"
      />

      <div className="relative z-10 min-h-screen">
        {/* Navbar */}
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-white">
          <Link to="/">
            <img src={logo} alt="EduExam" className="h-30" />
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <Link to="/" className="text-xl">Home</Link>

            <div className="flex bg-white rounded-3xl px-1">
              <input
                placeholder="Student Exam Key"
                className="px-4 py-2 outline-none text-black bg-transparent font-bold w-48"
              />
              <button
                className="px-4 py-2 rounded-3xl text-white font-bold"
                style={{ backgroundColor: THEME }}
              >
                →
              </button>
            </div>

            <Link
              to="/teacher-login"
              className="border px-5 py-2 rounded-3xl font-bold hover:bg-white hover:text-black"
            >
              Teacher Sign In
            </Link>
          </div>
        </div>

        {/* FORM */}
        <div className="flex justify-center mt-10 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-8">

            {/* Heading */}
            <h2 className="text-3xl font-semibold text-center mb-1" style={{ color: THEME }}>
              Welcome to EduExam
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Register an account or sign up for a free trial
            </p>

            {/* Steps */}
            <div className="flex items-center justify-between text-sm font-semibold mb-8">
              {["Organization", "Email", "Teacher", "Details"].map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full border"
                    style={{
                      backgroundColor: step === i + 1 ? THEME : "transparent",
                      color: step === i + 1 ? "#fff" : "#9ca3af",
                      borderColor: THEME,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className={step === i + 1 ? "text-black" : "text-gray-400"}>
                    {label}
                  </span>
                  {i < 3 && <span className="mx-2 text-gray-300">→</span>}
                </div>
              ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Tell us where you teach</h3>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="userType" value="teacher" checked={formData.userType === "teacher"} onChange={handleChange} />
                    I am a teacher
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="userType" value="student" checked={formData.userType === "student"} onChange={handleChange} />
                    I am a student
                  </label>
                </div>

                
    {/* STUDENT INFO MESSAGE */}
    {formData.userType === "student" && (
      <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
        <p className="font-semibold text-lg text-[#2a384a]">
          There are no student accounts at EduExam
        </p>

        <p className="text-gray-600 text-sm leading-relaxed">
          Only teachers register accounts. Students receive an
          <strong> Exam Key </strong>
          from their teacher to access exams.
        </p>

        <Link
          to="/"
          className="inline-block font-semibold hover:underline text-[#2a384a]"
        >
          ← Back to home
        </Link>
      </div>
                )}

                {formData.userType === "teacher" && (
                  <>
                   <select
  name="country"
  value={formData.country}
  onChange={handleChange}
  className="w-full border px-4 py-2 rounded"
>
  <option value="">Select country</option>
  <option>India</option>
  <option>USA</option>
</select>

{errors.country && (
  <p className="text-red-500 text-sm">{errors.country}</p>
)}

                    <input
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                       required
                      placeholder="Organization name"
                      className="w-full border px-4 py-2 rounded"
                    />

                    <input
                      name="organizationWebsite"
                      value={formData.organizationWebsite}
                      onChange={handleChange}
                      placeholder="Organization website"
                      disabled={formData.noWebsite}
                      className="w-full border px-4 py-2 rounded"
                       required={!formData.noWebsite}
             
                    />

                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="noWebsite" checked={formData.noWebsite} onChange={handleChange} />
                      My organization doesn't have a website
                    </label>
                  </>
                )}
              </div>
            )}

          {step === 2 && (
              <>
                {!emailVerifiedUI ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="teacher@school.edu"
                      className="w-full border px-4 py-2 rounded"
                    />
                    <button
                      onClick={sendVerificationEmail}
                      className="w-full mt-4 py-2 text-white rounded"
                      style={{ backgroundColor: THEME }}
                    >
                      {loading ? "Sending..." : "Verify Email"}
                    </button>
                  </>
                ) : !emailVerified ? (
                  <>
                    <CheckCircle className="mx-auto text-green-600" size={40} />
                    <input
                      placeholder="Enter OTP"
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(e.target.value)
                      }
                      className="w-full border px-4 py-2 rounded mt-4"
                    />
                    <button
                      onClick={verifyEmailCode}
                      className="w-full mt-4 py-2 text-white rounded"
                      style={{ backgroundColor: THEME }}
                    >
                      {loading ? "Verifying..." : "Verify Code"}
                    </button>
                  </>
                ) : (
                  <p className="text-green-600 text-center font-semibold">
                    Email verified successfully ✔
                  </p>
                )}
              </>
            )}

            {apiError && (
              <p className="text-red-500 text-sm text-center mt-4">
                {apiError}
              </p>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Teacher details</h3>

                <input
                  name="teacherName"
                  value={formData.teacherName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full border px-4 py-2 rounded"
                />

                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                >
                  <option value="">Select role</option>
                  <option>Teacher</option>
                  <option>Professor</option>
                  <option>Lecturer</option>
                </select>

                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject / Department"
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border px-4 py-2 rounded"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full border px-4 py-2 rounded"
                />

                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />
                  I agree to Terms & Privacy Policy
                </label>

               <button
  onClick={handleSubmit}
  disabled={!formData.acceptTerms || loading}
  className="w-full py-2 rounded text-white font-semibold disabled:opacity-50"
  style={{ backgroundColor: THEME }}
>
  {loading ? "Creating account..." : "Create teacher account"}
</button>

{apiError && (
  <p className="text-red-500 text-sm text-center mt-3">
    {apiError}
  </p>
)}

              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} disabled={step === 1} className="px-6 py-2 border rounded"> Previous </button>
              {step < 4 && (
                <button onClick={nextStep} className="px-6 py-2 rounded text-white" style={{ backgroundColor: THEME }}>
                  Next
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
