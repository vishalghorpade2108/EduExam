import Exam from "../models/Exam.model.js";

/**
 * GET /api/teacher/:teacherId/exams
 * Returns exams created by this teacher
 */
export const getTeacherExams = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({
        message: "Teacher ID is required",
      });
    }

    const exams = await Exam.find({
      teacherId,
      status: { $in: ["PUBLISHED", "ENDED"] },
    }).sort({ createdAt: -1 });

    return res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching teacher exams:", error);
    return res.status(500).json({
      message: "Failed to fetch exams",
    });
  }
};
