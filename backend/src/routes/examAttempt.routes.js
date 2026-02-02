import express from "express";
import {
  saveAnswer,
  autosaveAnswers,
  getSavedAnswers,
  submitExam,
} from "../controllers/examAttempt.controller.js";

const router = express.Router();

router.post("/:examKey/save-answer", saveAnswer);
router.post("/:examKey/autosave", autosaveAnswers);
router.get("/:examKey/saved-answers/:studentId", getSavedAnswers);
router.post("/submit/:examKey", submitExam);
export default router;
