import Exam from "../models/Exam.model.js";
import Student from "../models/Student.model.js";

export const registerStudent = async (req, res) => {
  try {
    const examKey1= req.params;
  const { name, email, rollNo } = req.body;
   const examKey = examKey1['examkey']
  const exam = await Exam.findOne({ examKey });
  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  let student = await Student.findOne({
    examId: exam._id,
    email, // or rollNo (recommended rollNo)
  });

  // 🔁 Student already exists
  if (student) {
    // ❌ Already submitted
    if (student.status === "SUBMITTED") {
      return res.status(400).json({
        message: "You have already submitted this exam",
        status: student.status,
      });
    }

    // ✅ Allow continuation
    return res.json({
      success: true,
      studentId: student._id,
      alreadyRegistered: true,
      status: student.status,
    });
  }

  // 🆕 New student
  student = await Student.create({
    examId: exam._id,
    name,
    email,
    rollNo,
    status: "REGISTERED",
  });

  res.status(201).json({
    success: true,
    studentId: student._id,
    alreadyRegistered: false,
    status: student.status,
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
