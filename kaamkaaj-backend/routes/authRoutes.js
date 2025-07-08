import express from "express";
import {
	registerUser,
	loginUser,
	sendOtpByEmail,
	verifyEmailOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-email-otp", sendOtpByEmail);
router.post("/verify-email-otp", verifyEmailOtp);

export default router;
