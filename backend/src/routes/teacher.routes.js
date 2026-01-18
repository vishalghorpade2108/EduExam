import express from "express";
import auth from "../middlewares/auth.middleware.js";
import Teacher from "../models/Teacher.model.js";
import { getTeacherExams } from "../controllers/teacher.controller.js";
const router = express.Router();
router.get(
  "/:teacherId/exams",
  getTeacherExams
);
/* ================= GET PROFILE ================= */
router.get("/profile", auth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-password");
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/profile", auth, async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "country",
      "organizationName",
      "organizationWebsite",
      "designation",
      "subject",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json(updatedTeacher);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
