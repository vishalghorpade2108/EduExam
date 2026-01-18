import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema(
  {
    examKey: {
      type: String,
      required: true,
      index: true,
    },

    studentId: {
      type: String,
      required: true,
      index: true,
    },

    answers: {
      type: Map,
      of: Number, // questionId => selectedOption
      default: {},
    },

    warnings: {
      type: Number,
      default: 0,
    },

    submitted: {
      type: Boolean,
      default: false,
    },

    submitReason: {
      type: String,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ExamAttempt", examAttemptSchema);
