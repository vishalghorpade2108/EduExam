import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    /* ===== BASIC INFO ===== */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    rollNo: {
      type: String,
      required: true,
      trim: true,
    },

    /* ===== EXAM LINK ===== */
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    /* ===== ATTEMPT CONTROL ===== */
    attemptNumber: {
      type: Number,
      default: 1,
    },

     status: {
      type: String,
      enum: ["REGISTERED", "INSTRUCTIONS", "STARTED", "SUBMITTED"],
      default: "REGISTERED",
    },

    /* ===== TIMING ===== */
    startedAt: Date,
    submittedAt: Date,

    /* ===== PROCTORING ===== */
    tabSwitchCount: {
      type: Number,
      default: 0,
    },

    cameraWarnings: {
      type: Number,
      default: 0,
    },

    microphoneWarnings: {
      type: Number,
      default: 0,
    },

    ipAddress: String,
    deviceInfo: String,

    /* ===== RESULT ===== */
    totalMarks: {
      type: Number,
      default: 0,
    },

    isDisqualified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* Prevent multiple attempts */
studentSchema.index(
  { examId: 1, rollNo: 1 },
  { unique: true }
);

export default mongoose.model("Student", studentSchema);
