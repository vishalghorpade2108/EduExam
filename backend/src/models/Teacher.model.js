import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },

    role: {
      type: String,
      default: "Teacher",
    },

    subject: String,

    password: {
      type: String,
      minlength: 6,
    },

    // 🔐 AUTH PROVIDERS
    authProviders: {
      local: { type: Boolean, default: true },
      google: { type: Boolean, default: false },
      microsoft: { type: Boolean, default: false },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    microsoftId: {
      type: String,
      unique: true,
      sparse: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailOTP: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
