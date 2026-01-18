import Question from "../models/Question.model.js";
import Exam from "../models/Exam.model.js";

export const saveQuestions = async (req, res) => {
  try {
    const { examId, questions } = req.body;
    if (!examId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const examExists = await Exam.findById(examId);
    if (!examExists) {
      return res.status(404).json({ message: "Exam not found" });
    }
  

    const formattedQuestions = questions.map((q) => ({
      exam: examId,
      question: q.question,
      options: q.options,
      correctOption: String(q.correctOption),
      marks: q.marks || 1,
      difficulty: q.difficulty || "Easy",
    }));
    await Question.insertMany(formattedQuestions);

    res.status(201).json({
      message: "Questions saved successfully",
      count: formattedQuestions.length,
    });
  } catch (error) {
    console.error("Save Questions Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const saveDraftQuestions = async (req, res) => {
  try {
    const { examId, questions } = req.body;

    // 🛑 Basic validation
    if (!examId || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // 🔒 Check exam status
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.status === "published") {
      return res.status(403).json({
        message: "Exam is published. Questions cannot be edited.",
      });
    }

    const savedQuestions = [];

    for (const q of questions) {
      // 🛑 Prevent editing locked questions
      if (q._id) {
        const existing = await Question.findById(q._id);
        // 🔁 UPDATE
        const updated = await Question.findByIdAndUpdate(
          q._id,
          {
            questionText: q.questionText,
            type: q.type,
            options: q.options,
            answer: q.answer,
            marks: q.marks,
          },
          { new: true }
        );

        savedQuestions.push(updated);
      } else {
        // ➕ CREATE
        const created = await Question.create({
          exam:examId,
          question: q.question,
          difficulty: q.difficulty,
          options: q.options,
          correctOption: q.correctOption,
          marks: q.marks,
        });

        savedQuestions.push(created);
      }
    }

    res.json({
      message: "Questions saved successfully",
      questions: savedQuestions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};