import express from "express";
import {
	registerUser,
	loginUser,
	sendOtpByEmail,
	verifyEmailOtp,
	sendForgotPasswordOtp,
	resetPasswordWithOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-email-otp", sendOtpByEmail);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/forgot-password", sendForgotPasswordOtp);
router.post("/reset-password", resetPasswordWithOtp);

export default router;
