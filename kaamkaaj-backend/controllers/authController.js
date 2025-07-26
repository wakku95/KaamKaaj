import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { sendEmailOtp } from "../utils/sendEmailOtp.js";

export const sendOtpByEmail = async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });
	if (!user) return res.status(404).json({ message: "User not found" });
	// ✅ Prevent sending OTP if already verified
	if (user.isEmailVerified) {
		return res.status(400).json({ message: "Email is already verified." });
	}

	const otp = Math.floor(100000 + Math.random() * 900000);
	user.otpCode = otp;
	user.otpExpires = Date.now() + 5 * 60 * 1000;
	await user.save();

	await sendEmailOtp(email, otp);
	res.json({ message: "OTP sent to email" });
};
export const verifyEmailOtp = async (req, res) => {
	const { email, otp } = req.body;

	const user = await User.findOne({ email });
	if (!user) return res.status(404).json({ message: "User not found" });

	if (user.otpCode !== otp || Date.now() > user.otpExpires) {
		return res.status(400).json({ message: "Invalid or expired OTP" });
	}

	user.isEmailVerified = true;
	user.otpCode = null;
	user.otpExpires = null;
	await user.save();

	res.json({ message: "Email verified successfully" });
};

export const registerUser = async (req, res) => {
	const { name, email, password, phone, isWorker, location } = req.body;

	const userExists = await User.findOne({ email });
	if (userExists)
		return res.status(400).json({ message: "User already exists" });

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		phone,
		isWorker,
		location,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			isWorker: user.isWorker,
			token: generateToken(user._id),
		});
	} else {
		res.status(400).json({ message: "Invalid user data" });
	}
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user)
		return res.status(401).json({ message: "Invalid email or password" });

	const isMatch = await bcrypt.compare(password, user.password);
	if (!user.isEmailVerified) {
		return res.status(403).json({ message: "Please verify your email first." });
	}
	if (!isMatch)
		return res.status(401).json({ message: "Invalid email or password" });

	res.json({
		_id: user._id,
		name: user.name,
		email: user.email,
		phone: user.phone,
		isWorker: user.isWorker,
		location: user.location,
		isEmailVerified: user.isEmailVerified,
		token: generateToken(user._id),
	});
};

// 🔐 1. Send OTP for Forgot Password
export const sendForgotPasswordOtp = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "User not found" });

		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		user.otpCode = otp;
		user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
		await user.save();

		await sendEmailOtp(user.email, otp);

		res.json({ message: "OTP sent to your email." });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to send OTP" });
	}
};

// 🔐 2. Reset Password with OTP
export const resetPasswordWithOtp = async (req, res) => {
	const { email, otp, newPassword } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user || user.otpCode !== otp || user.otpExpires < Date.now()) {
			return res.status(400).json({ message: "Invalid or expired OTP" });
		}

		const hashed = await bcrypt.hash(newPassword, 10);
		user.password = hashed;
		user.otpCode = null;
		user.otpExpires = null;
		await user.save();

		res.json({ message: "Password reset successful" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Password reset failed" });
	}
};
