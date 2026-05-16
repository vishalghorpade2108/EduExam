import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOTPEmail = async (to, otp) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Verify your email - EduExam";
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2a384a;">Email Verification</h2>
          <p>Your OTP code for EduExam is:</p>
          <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 5px; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This code is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;
    sendSmtpEmail.sender = { name: "EduExam", email: process.env.SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Brevo Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Brevo Email Error:", error.response ? error.response.body : error.message);
    throw error;
  }
};
