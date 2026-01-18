import express from "express";
import { saveQuestions ,saveDraftQuestions} from "../controllers/question.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/save", authMiddleware, saveQuestions);
router.post("/addquestions", authMiddleware, saveQuestions);
router.post("/savedraft", authMiddleware, saveDraftQuestions);
export default router;
