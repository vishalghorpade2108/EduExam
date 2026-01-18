import mongoose from "mongoose";

const studentAnswerSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedAnswer: {
      type: String,
      required: true,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    marksAwarded: {
      type: Number,
      default: 0,
    },

    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* Prevent duplicate answers */
studentAnswerSchema.index(
  { studentId: 1, questionId: 1 },
  { unique: true }
);

export default mongoose.model("StudentAnswer", studentAnswerSchema);
