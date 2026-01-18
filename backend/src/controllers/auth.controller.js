import Teacher from "../models/Teacher.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {sendOTPEmail} from "../config/mailer.js";

export const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    let teacher = await Teacher.findOne({ email });

    if (!teacher) {
      teacher = await Teacher.create({ email });
    }

    if (teacher.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
// Math.floor(100000 + Math.random() * 900000).toString();
    const otp = "123456"; // For testing purposes, use a fixed OTP. Replace with above line in production.

    teacher.emailOTP = otp;
    teacher.otpExpiry = Date.now() + 10 * 60 * 1000;
    await teacher.save();

    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent successfully" }, { otp });
  } catch (err) {
    res.status(500).json({ message: "OTP sending failed" });
  }
};
/* ================= VERIFY OTP ================= */

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher)
      return res.status(404).json({ message: "Email not found" });

    if (
      teacher.emailOTP !== code ||
      teacher.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    teacher.emailVerified = true;
    teacher.emailOTP = null;
    teacher.otpExpiry = null;
    await teacher.save();

    res.json({ message: "Email verified successfully" });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
};


/* ================= REGISTER ================= */
export const registerTeacher = async (req, res) => {
  try {
    const {
      country,
      organizationName,
      organizationWebsite,
      name,
      email,
      role,
      subject,
      password,
    } = req.body;

    const teacher = await Teacher.findOne({ email });

    if (!teacher)
      return res.status(404).json({ message: "Email not verified" });

    if (!teacher.emailVerified)
      return res.status(400).json({ message: "Please verify email first" });

    if (teacher.password)
      return res.status(400).json({ message: "Teacher already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    teacher.country = country;
    teacher.organizationName = organizationName;
    teacher.organizationWebsite = organizationWebsite;
    teacher.name = name;
    teacher.role = role;
    teacher.subject = subject;
    teacher.password = hashedPassword;

    await teacher.save();

    res.status(201).json({
      message: "Teacher registered successfully",
      teacherId: teacher._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= LOGIN ================= */
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        role: teacher.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
