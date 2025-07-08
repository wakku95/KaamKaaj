import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
	service: "Gmail", // or use Mailtrap/SMTP
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export const sendEmailOtp = async (to, otp) => {
	const mailOptions = {
		from: `"KaamKaaj" <${process.env.EMAIL_USER}>`,
		to,
		subject: "Your OTP for KaamKaaj",
		html: `<p>Your verification code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
	};
	await transporter.sendMail(mailOptions);
};
