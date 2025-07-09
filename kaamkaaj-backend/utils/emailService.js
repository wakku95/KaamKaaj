import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export const sendStatusEmail = async (to, status) => {
	const subject = `Your request has been ${status}`;
	const html = `<p>Your job request was <strong>${status}</strong> by the worker.</p>`;

	await transporter.sendMail({
		from: `"KaamKaaj" <${process.env.EMAIL_USER}>`,
		to,
		subject,
		html,
	});
};
