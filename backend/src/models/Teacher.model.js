import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      trim: true,
    },

    organizationName: {
      type: String,
      trim: true,
    },

    organizationWebsite: {
      type: String,
      trim: true,
    },

    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      default: "Teacher",
    },

    subject: {
      type: String,
    },

    password: {
      type: String,
      minlength: 6,
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
