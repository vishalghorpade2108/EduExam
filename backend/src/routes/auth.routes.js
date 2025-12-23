import express from "express";
import {
   sendVerificationEmail,
  verifyEmail,
  registerTeacher,
  loginTeacher,
} from "../controllers/auth.controller.js";

const router=express.Router();
router.post("/send-verification", sendVerificationEmail);
router.post("/verify-email", verifyEmail);
router.post("/register", registerTeacher);
router.post("/login", loginTeacher);

export default router;
