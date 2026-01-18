import express from "express";
import { getTeacherExam, saveExam, deleteExam,getExamForEdit,publishExam, verifyExamKey, getExamByKey, startExam, getQuestionsByExamKey, } from "../controllers/Exam.controller.js";
import {registerStudent} from "../controllers/student.controller.js";
import {getExamAttempts} from "../controllers/examAttempt.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/save", authMiddleware, saveExam);
router.get("/teacher",authMiddleware,getTeacherExam)
router.delete("/:id/delete", authMiddleware, deleteExam);
router.get("/:id/edit",getExamForEdit);

router.get("/verify/:examKey",verifyExamKey);
router.get("/key/:examKey",getExamByKey);
router.put("/:examId/publish",  authMiddleware,  publishExam );  

router.post("/:examKey/start", startExam);
router.post("/:examkey/student", registerStudent);
router.get("/:examkey/questions", getQuestionsByExamKey);
router.get("/:examKey/attempts", getExamAttempts);

export default router;