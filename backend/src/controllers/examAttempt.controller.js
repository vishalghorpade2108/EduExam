import ExamAttempt from "../models/ExamAttempt.js";
import Student from "../models/Student.model.js";
import Question from "../models/Question.model.js";
import Exam from "../models/Exam.model.js";
/* ================= SAVE SINGLE ANSWER ================= */
export const saveAnswer = async (req, res) => {
  const { examKey } = req.params;
  const { studentId, questionId, selectedOption } = req.body;

  if (!studentId || !questionId) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const attempt = await ExamAttempt.findOneAndUpdate(
      { examKey, studentId, submitted: false },
      {
        $set: {
          [`answers.${questionId}`]: selectedOption,
        },
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, attemptId: attempt._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save answer" });
  }
};

/* ================= AUTOSAVE ALL ANSWERS ================= */
export const autosaveAnswers = async (req, res) => {
  const { examKey } = req.params;
  const { studentId, answers } = req.body;

  if (!studentId || !answers) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    await ExamAttempt.findOneAndUpdate(
      { examKey, studentId, submitted: false },
      {
        $set: { answers },
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Autosave failed" });
  }
};

/* ================= GET SAVED ANSWERS ================= */
export const getSavedAnswers = async (req, res) => {
  const { examKey, studentId } = req.params;

  try {
    const attempt = await ExamAttempt.findOne({
      examKey,
      studentId,
      submitted: false,
    });

    res.json({
      answers: attempt?.answers || {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch answers" });
  }
};

/* ================= FINAL SUBMIT ================= */

export const submitExam = async (req, res) => {
  const { examKey } = req.params;
  const { studentId, answers, warnings, reason } = req.body;

  try {
    /* ================= 1. FIND EXAM ================= */
    const exam = await Exam.findOne({ examKey: examKey });
  
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    /* ================= 2. UPDATE EXAM ATTEMPT ================= */
    const attempt = await ExamAttempt.findOneAndUpdate(
  { examKey, studentId, submitted: false },
  {
    $set: {
      answers,
      warnings,
      submitted: true,
      submitReason: reason,
      submittedAt: new Date(),
    },
  },
   { upsert: true, new: true }
);

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    /* ================= 3. FETCH ALL QUESTIONS ================= */
    const questions = await Question.find({ exam: exam._id });

    /* ================= 4. EVALUATE ANSWERS ================= */
    let totalMarks = 0;

    questions.forEach((q) => {
      const studentAnswer = answers[q._id.toString()];

      if (
        studentAnswer !== undefined &&
        studentAnswer.toString() === q.correctOption
      ) {
        totalMarks += q.marks;
      }
    });

    /* ================= 5. UPDATE STUDENT ================= */
    await Student.findByIdAndUpdate({_id: studentId}, {
      $set: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        totalMarks,
      },
    });

    /* ================= 6. RESPONSE ================= */
    res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      totalMarks,
    });

  } catch (err) {
    console.error("Submit Exam Error:", err);
    res.status(500).json({ message: "Submit failed" });
  }
};



export const getExamAttempts = async (req, res) => {
  try {
     const { examKey } = req.params;
    if (!examKey) {
      return res.status(400).json({
        success: false,
        message: "Exam key is required",
      });
    }

    // Fetch attempts
    const attempts = await ExamAttempt.find({ examKey })
      .sort({ createdAt: -1 });

    // Fetch student details for mapping
    const studentIds = attempts.map(a => a.studentId);

    const students = await Student.find({
      _id: { $in: studentIds },
    }).select("name email rollNo status totalMarks isDisqualified");

    // Map studentId -> student
    const studentMap = {};
    students.forEach(s => {
      studentMap[s._id.toString()] = s;
    });

    // Merge attempt + student info
    const enrichedAttempts = attempts.map(attempt => ({
      _id: attempt._id,
      examKey: attempt.examKey,
      studentId: attempt.studentId,
      student: studentMap[attempt.studentId] || null,
      submitted: attempt.submitted,
      warnings: attempt.warnings,
      submitReason: attempt.submitReason,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      createdAt: attempt.createdAt,
    }));

    res.status(200).json({
      success: true,
      attempts: enrichedAttempts,
    });
  } catch (error) {
    console.error("Error fetching exam attempts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load attempts",
    });
  }
};
