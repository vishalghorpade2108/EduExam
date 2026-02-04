import express, { text } from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import examRoutes from "./routes/Exam.routes.js"
import QuestionRoutes from "./routes/Question.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import teacherRoutes from "./routes/teacher.routes.js"
import examAttemptRoutes from "./routes/examAttempt.routes.js";

dotenv.config(); 

const app = express();

app.use(cors({
    origin: [
       "http://localhost:5173", 
      "https://edu-exam-one.vercel.app/",
      "https://www.eduexam.shop/",
       "https://eduexam.shop",


    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }));
app.use(express.json());

connectDB(); 

app.use("/api/auth", authRoutes);
app.use("/api/exam",examRoutes)
app.use("/api/teacher",teacherRoutes)
app.use("/api/questions",QuestionRoutes)
app.use("/api/ai", aiRoutes);
app.use("/api/examAttempt", examAttemptRoutes);
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("EduExam Backend is running ");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
