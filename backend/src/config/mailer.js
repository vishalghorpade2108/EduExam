import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// ✅ CORRECT: pass API key directly
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (to, otp) => {
  try {
    const response = await resend.emails.send({
      from: "EduExam <onboarding@resend.dev>",
      to,
      subject: "Verify your email - EduExam",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This code is valid for 10 minutes.</p>
      `,
    });

    console.log("✅ Email sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Resend Email Error:", error.message);
    throw error;
  }
};
