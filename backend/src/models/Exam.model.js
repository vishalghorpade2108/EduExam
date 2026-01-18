import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    examName: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    class: {
      type: String,
      required: true,
      trim: true,
      // Examples: "FY BCS", "SY IT", "10th A"
    },

    examType: {
      type: String,
      default: "test",
    },

    
    description: String,

    duration: {
      type: Number, // in minutes
      required: true,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },
lastCompletedStep: {
  type: Number,
  default: 1,
},
isPublished: {
  type: Boolean,
  default: false,
},
    examKey: {
      type: String,
      unique: true,
      required: true,
    },

    status: {
      type: String,
      default: "draft",
    },


    startTime: Date,
    endTime: Date,
    
    attempts: {
      type: Number,
      default: 1,
    },

    shuffleQuestions: {
      type: Boolean,
      default: false,
    },

    showResults: {
      type: Boolean,
      default: false,
    },

    allowCalculator: {
      type: Boolean,
      default: false, 
    
    },  isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
