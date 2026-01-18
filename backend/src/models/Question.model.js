import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length >= 2;
        },
        message: "At least 2 options are required",
      },
    },

    correctOption: {
      type: String, // index as string: "0", "1", "2"
      required: true,
    },

    marks: {
      type: Number,
      default: 1,
      min: 1,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
