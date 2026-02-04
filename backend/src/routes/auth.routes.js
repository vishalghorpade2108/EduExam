import express from "express";
import {
   sendVerificationEmail,
  verifyEmail,
  registerTeacher,
  loginTeacher,
} from "../controllers/auth.controller.js";
import { googleLogin } from "../controllers/googleAuthController.js";
import { microsoftLogin } from "../controllers/microsoftAuthController.js";

const router=express.Router();
router.post("/send-verification", sendVerificationEmail);
router.post("/verify-email", verifyEmail);
router.post("/register", registerTeacher);
router.post("/login", loginTeacher);
router.post("/google-login", googleLogin);
router.post("/microsoft-login", microsoftLogin);

export default router;
